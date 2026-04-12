import { idToUuid } from 'notion-utils'

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
    if (
      vid &&
      (vid === id ||
        vid.replace(/-/g, '') === compact ||
        key === id ||
        key.replace(/-/g, '') === compact)
    ) {
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
