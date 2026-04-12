import { idToUuid } from 'notion-utils'
import { notionIdsEqual } from '@/lib/utils/pageId'

/**
 * syncRecordValues 等接口有时返回 block[id] = { value: { value: 真实块, role } }，
 * react-notion-x 6.x 的 NotionBlockRenderer 直接读 recordMap.block[id].value 当块本体，
 * 若不展开则没有 .type/.content，整页（含图片）为空白。逻辑与 getSiteData 里规范化一致。
 */
export function unwrapRecordMapBlockValueLayers(recordMap) {
  const blocks = recordMap?.block
  if (!blocks || typeof blocks !== 'object') return

  for (const key of Object.keys(blocks)) {
    const entry = blocks[key]
    if (!entry || typeof entry !== 'object') continue
    let guard = 0
    // 必须用「外层无 type、内层有 type」判断套娃；勿用 !properties，
    // 否则 collection_view_page 等合法块 properties 为 undefined 时会被误展开，整站 getSiteData 失败→占位「无法获取 Notion 数据」。
    while (guard++ < 6) {
      const v = entry.value
      if (
        !v ||
        typeof v !== 'object' ||
        !v.value ||
        typeof v.value !== 'object' ||
        !v.value.type ||
        v.type
      ) {
        break
      }
      entry.value = v.value
    }
  }
}

/**
 * react-notion-x 的 NotionBlockRenderer 默认用 Object.keys(recordMap.block)[0] 作为根块，
 * 但 Notion 返回的 block map 键顺序不保证，第一个键往往不是当前文章 page 块 → 正文与图片整段不渲染。
 * 必须用当前文章的页面 id 对应在 map 里的 key（可能与 post.id 带/不带横线不一致）。
 */
export function resolveNotionRootBlockId(recordMap, postId) {
  const block = recordMap?.block
  if (!block || postId == null || postId === '') return null

  const id = String(postId).trim()
  if (block[id]) return id

  const compact = id.replace(/-/g, '')
  if (compact.length === 32 && block[compact]) return compact

  for (const key of Object.keys(block)) {
    const v = block[key]?.value
    if (!v || v.type !== 'page') continue
    const vid = v.id != null ? String(v.id) : ''
    if (notionIdsEqual(vid, id) || notionIdsEqual(key, id)) {
      return key
    }
  }

  const keys = Object.keys(block)
  return keys[0] || null
}

/**
 * addSignedUrls 写入的 key 与块上 block.id 可能一种带横线、一种不带，导致 asset 里 signed_urls[block.id] 取不到图。
 */
export function augmentSignedUrlsAlternateKeyForms(recordMap) {
  const su = recordMap?.signed_urls
  if (!su || typeof su !== 'object') return

  const entries = Object.entries(su).filter(
    ([, v]) => typeof v === 'string' && v.length > 0
  )

  for (const [k, v] of entries) {
    const compact = k.replace(/-/g, '')
    if (compact.length === 32 && !su[compact]) {
      su[compact] = v
    }
    if (!k.includes('-') && compact.length === 32) {
      try {
        const dashed = idToUuid(k)
        if (dashed && dashed !== k && !su[dashed]) {
          su[dashed] = v
        }
      } catch (_) {
        /* noop */
      }
    }
  }
}

/**
 * 按每个块 value.id 再互备 signed_urls，避免 image 块上 id 与 map 键略有不一致时取不到签名地址。
 */
export function mirrorSignedUrlsForBlockIds(recordMap) {
  const su = recordMap?.signed_urls
  const blocks = recordMap?.block
  if (!su || typeof su !== 'object' || !blocks) return

  const ids = new Set()
  for (const key of Object.keys(blocks)) {
    const bid = blocks[key]?.value?.id
    if (bid != null && String(bid).length > 0) {
      ids.add(String(bid).trim())
    }
  }

  for (const bid of ids) {
    const compact = bid.replace(/-/g, '')
    const url = su[bid] || (compact.length === 32 ? su[compact] : undefined)
    if (!url || typeof url !== 'string') continue
    if (!su[bid]) su[bid] = url
    if (compact.length === 32 && !su[compact]) su[compact] = url
    try {
      const dashed = bid.includes('-') ? bid : idToUuid(bid)
      if (dashed && dashed !== bid && !su[dashed]) su[dashed] = url
    } catch (_) {
      /* noop */
    }
  }
}
