import BLOG from '@/blog.config'
import {
  getDataFromCache,
  getOrSetDataWithCache,
  setDataToCache
} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'
import notionAPI from '@/lib/notion/getNotionAPI'
import { ensureRecordMapBlockIds } from '@/lib/notion/ensureRecordMapBlockIds'
import { unwrapRecordMapBlockValueLayers } from '@/lib/notion/recordMapRenderer'

function isNotionRateLimited(e) {
  const s = e?.response?.status ?? e?.response?.statusCode
  if (s === 429) return true
  const msg = String(e?.message ?? e ?? '')
  return msg.includes('429') || msg.includes('Too Many Requests')
}

// EmptyData 占位文章的 id，不调用 Notion API
const PLACEHOLDER_PAGE_ID = '00000000-0000-0000-0000-000000000001'

/** Notion block / 页面 id（带横线 UUID） */
function isNotionUuidString(s) {
  return (
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      s.trim()
    )
  )
}

/**
 * 展开 sync_block 后从 map 中删掉原 id，必须把各父块的 value.content 里对该 id 的引用换成子块 id，
 * 否则 react-notion-x 按 content 向下遍历时找不到块，正文与图片会整段空白。
 */
function replaceSyncBlockIdInRecordMap(recordMap, syncBlockId, replacementIds) {
  const blocks = recordMap?.block
  if (!blocks || !syncBlockId || !Array.isArray(replacementIds)) return

  for (const key of Object.keys(blocks)) {
    const content = blocks[key]?.value?.content
    if (!Array.isArray(content) || content.length === 0) continue

    let i = 0
    while (i < content.length) {
      if (content[i] === syncBlockId) {
        content.splice(i, 1, ...replacementIds)
        i += replacementIds.length
      } else {
        i++
      }
    }
  }
}

/**
 * 校验是否为有效的 Notion 页面 ID（notion-utils 会对 id 调用 .split()，非字符串会 crash）
 * @param {*} id
 * @returns {boolean}
 */
function isValidNotionPageId(id) {
  if (typeof id !== 'string' || !id) return false
  if (id === PLACEHOLDER_PAGE_ID) return false
  const hex = id.replace(/-/g, '')
  return /^[0-9a-f]{32}$/i.test(hex)
}

/**
 * 获取文章内容块
 * @param {*} id
 * @param {*} from
 * @param {*} slice
 * @returns
 */
export async function getPage(id, from = null, slice) {
  if (!isValidNotionPageId(id)) {
    return null
  }
  const cacheKey = `page_content_${id}`
  return await getOrSetDataWithCache(
    cacheKey,
    async (id, slice) => {
      let pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.debug('[API<<--缓存]', `from:${from}`, cacheKey)
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }

      // 抓取最新数据
      pageBlock = await getPageWithRetry(id, from)

      if (pageBlock) {
        await setDataToCache(cacheKey, pageBlock)
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }
      return pageBlock
    },
    id,
    slice
  )
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, from, retryAttempts = 6) {
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      '[API-->>请求]',
      `from:${from}`,
      `id:${id}`,
      retryAttempts < 6 ? `剩余重试次数:${retryAttempts}` : ''
    )
    try {
      const start = new Date().getTime()
      const pageData = await notionAPI.getPage(id)
      const end = new Date().getTime()
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
      return pageData
    } catch (e) {
      console.warn('[API<<--异常]:', e)
      const limited = isNotionRateLimited(e)
      const backoffMs = limited
        ? Math.min(45000, 6000 * Math.pow(2, 6 - retryAttempts))
        : 1000
      await delay(backoffMs)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.log('[重试缓存]', `from:${from}`, `id:${id}`)
        return pageBlock
      }
      return await getPageWithRetry(id, from, retryAttempts - 1)
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function convertNotionBlocksToPost(id, blockMap, slice) {
  const clonePageBlock = deepClone(blockMap)
  unwrapRecordMapBlockValueLayers(clonePageBlock)
  let count = 0
  const blocksToProcess = Object.keys(clonePageBlock?.block || {})

  // 循环遍历文档的每个block
  for (let i = 0; i < blocksToProcess.length; i++) {
    const blockId = blocksToProcess[i]
    const b = clonePageBlock?.block[blockId]

    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[blockId]
      continue
    }

    // 当BlockId等于PageId时移除
    if (b?.value?.id === id) {
      // 此block含有敏感信息
      delete b?.value?.properties
      continue
    }

    count++

    const syncTypes =
      b?.value?.type === 'sync_block' || b?.value?.type === 'synced_block'
    if (syncTypes && b?.value?.children) {
      const childBlocks = b.value.children
      const newBlockIds = childBlocks.map((childBlock, index) => {
        const rawChildId = childBlock?.value?.id
        const childId =
          typeof rawChildId === 'string' && isNotionUuidString(rawChildId)
            ? rawChildId.trim()
            : null
        return childId || `${blockId}_child_${index}`
      })
      replaceSyncBlockIdInRecordMap(clonePageBlock, blockId, newBlockIds)
      delete clonePageBlock.block[blockId]
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = newBlockIds[index]
        clonePageBlock.block[newBlockId] = childBlock
        blocksToProcess.splice(i + index + 1, 0, newBlockId)
      })
      i--
      continue
    }

    // 处理 c++、c#、汇编等语言名字映射
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    // 如果是文件，或嵌入式PDF，需要重新加密签名
    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0].indexOf('attachment') === 0 ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }
  }

  ensureRecordMapBlockIds(clonePageBlock)

  // 去掉不用的字段
  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock
  }
  return clonePageBlock
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
async function getBlocksWithRetry(batch, idsLen, retries = 6) {
  let lastErr
  for (let left = retries; left > 0; left--) {
    try {
      return await notionAPI.getBlocks(batch)
    } catch (e) {
      lastErr = e
      if (!isNotionRateLimited(e)) throw e
      console.warn('[API<<--getBlocks异常]:', e)
      await delay(Math.min(40000, 6000 * Math.pow(2, retries - left)))
    }
  }
  console.error('[getBlocks失败]', lastErr)
  return { recordMap: { block: {} } }
}

export const fetchInBatches = async (ids, batchSize = 100) => {
  // 如果 ids 不是数组，则将其转换为数组
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    console.log('[API-->>请求] Fetching missing blocks', ids.length)
    const start = new Date().getTime()
    const pageChunk = await getBlocksWithRetry(batch, ids.length)
    const end = new Date().getTime()
    console.log(
      `[API<<--响应] 耗时:${end - start}ms Fetching missing blocks count:${ids.length} `
    )

    console.log('[API<<--响应]')
    fetchedBlocks = Object.assign(
      {},
      fetchedBlocks,
      pageChunk?.recordMap?.block
    )
  }
  return fetchedBlocks
}
