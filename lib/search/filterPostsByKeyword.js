import { getDataFromCache } from '@/lib/cache/cache_manager'
import { ensureRecordMapBlockIds } from '@/lib/notion/ensureRecordMapBlockIds'
import { getPageWithRetry } from '@/lib/notion/getPostBlocks'
import { getPageContentText } from '@/lib/notion/getPageContentText'
import { unwrapRecordMapBlockValueLayers } from '@/lib/notion/recordMapRenderer'
import { deepClone, delay } from '@/lib/utils'

/**
 * 与 lib/notion/getPostBlocks.js 中 getPage 写入的缓存键一致。
 * 历史曾误用 page_block_，正文从未命中缓存，搜索等同「仅标题+摘要等元数据」。
 */
const PAGE_CONTENT_CACHE_KEY = id => `page_content_${id}`

/** 正文检索并发：略并行以缩短总耗时，避免单次搜索串行打满 Notion 导致超时 */
const BODY_FETCH_CONCURRENCY = 4

/**
 * 搜索正文拉取：须避免 `next build` 时对数百商品 getPage 打爆 Notion（Jest worker 子进程异常）。
 * - 可靠做法：`package.json` 的 `build` 设 **`NEXT_SEARCH_NO_REMOTE=1`**，子进程必继承，见下方。
 * - `npm_lifecycle_event` / `NEXT_PHASE` 在 Next 的 worker 里**不一定**有，不能单独依赖。
 * 生产运行时**不会**设 `NEXT_SEARCH_NO_REMOTE`，访问搜索仍会拉 `page_content_*` / Notion 补正文。
 */
function shouldSkipSearchBodyRemote() {
  if (process.env.NEXT_SEARCH_NO_REMOTE === '1') return true
  if (process.env.npm_lifecycle_event === 'build') return true
  if (process.env.NEXT_PHASE === 'phase-production-build') return true
  return false
}

/**
 * 与详情页 getPage 一致：套娃 value 展开 + 补齐块 id，否则部分 recordMap 无法 Walk 出正文。
 */
function prepareRecordMapForContentText(raw) {
  if (!raw || !raw.block) return raw
  const copy = deepClone(raw)
  unwrapRecordMapBlockValueLayers(copy)
  ensureRecordMapBlockIds(copy)
  return copy
}

function buildArticleInfo(post) {
  const tagContent =
    post?.tags && Array.isArray(post?.tags) ? post?.tags.join(' ') : ''
  const categoryContent = Array.isArray(post.category)
    ? post.category.join(' ')
    : String(post.category ?? '')
  return (
    String(post.title ?? '') +
    String(post.summary ?? '') +
    tagContent +
    categoryContent
  )
}

/**
 * 服务端：按关键词筛选商品（标题、商品描述 summary、标签、分类、Notion 正文块文本）。
 * Vercel 生产环境若未命中 Redis，`page_content_*` 常为空，须在元数据未命中时向 Notion 拉取块图。
 * @param {Array} allPosts
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
export async function filterPostsByKeyword(allPosts, keyword) {
  const filterPosts = []
  const k = (keyword || '').trim().toLowerCase()
  if (!k) return allPosts

  const needBody = []
  for (const post of allPosts) {
    const articleInfo = buildArticleInfo(post)
    const metaHit = articleInfo.toLowerCase().indexOf(k) > -1
    post.results = []
    if (metaHit) {
      filterPosts.push(post)
    } else {
      needBody.push(post)
    }
  }

  if (shouldSkipSearchBodyRemote()) {
    return filterPosts
  }

  for (let i = 0; i < needBody.length; i += BODY_FETCH_CONCURRENCY) {
    if (i > 0) {
      await delay(120)
    }
    const chunk = needBody.slice(i, i + BODY_FETCH_CONCURRENCY)
    const results = await Promise.all(
      chunk.map(post => tryBodyMatch(post, k))
    )
    for (const { post, matched } of results) {
      if (matched) {
        filterPosts.push(post)
      }
    }
  }

  return filterPosts
}

/**
 * @returns {Promise<{ post: object, matched: boolean }>}
 */
async function tryBodyMatch(post, k) {
  let blockMap = await getDataFromCache(PAGE_CONTENT_CACHE_KEY(post.id), true)
  if (!blockMap && !shouldSkipSearchBodyRemote()) {
    blockMap = await getPageWithRetry(post.id, 'search-filter')
  }
  const prepared = blockMap ? prepareRecordMapForContentText(blockMap) : null
  const contentText = getPageContentText(post, prepared)
  if (
    typeof contentText === 'string' &&
    contentText.toLowerCase().indexOf(k) > -1
  ) {
    post.results.push(contentText.slice(0, 200))
    return { post, matched: true }
  }
  return { post, matched: false }
}
