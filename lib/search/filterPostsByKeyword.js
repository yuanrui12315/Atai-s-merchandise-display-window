import { getDataFromCache } from '@/lib/cache/cache_manager'
import { getPageContentText } from '@/lib/notion/getPageContentText'

/**
 * 与 lib/notion/getPostBlocks.js 中 getPage 写入的缓存键一致。
 * 历史曾误用 page_block_，正文从未命中缓存，搜索等同「仅标题+摘要等元数据」。
 */
const PAGE_CONTENT_CACHE_KEY = id => `page_content_${id}`

/**
 * 服务端：按关键词筛选商品（标题、商品描述 summary、标签、分类、Notion 正文块文本）。
 * @param {Array} allPosts
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
export async function filterPostsByKeyword(allPosts, keyword) {
  const filterPosts = []
  const k = (keyword || '').trim().toLowerCase()
  if (!k) return allPosts

  for (const post of allPosts) {
    const page = await getDataFromCache(PAGE_CONTENT_CACHE_KEY(post.id), true)
    const tagContent =
      post?.tags && Array.isArray(post?.tags) ? post?.tags.join(' ') : ''
    const categoryContent =
      post.category && Array.isArray(post.category)
        ? post.category.join(' ')
        : ''
    const articleInfo =
      String(post.title ?? '') +
      String(post.summary ?? '') +
      tagContent +
      categoryContent
    let hit = articleInfo.toLowerCase().indexOf(k) > -1
    const contentText = getPageContentText(post, page)
    post.results = []
    if (
      typeof contentText === 'string' &&
      contentText.toLowerCase().indexOf(k) > -1
    ) {
      hit = true
      post.results.push(contentText.slice(0, 200))
    }
    if (hit) {
      filterPosts.push(post)
    }
  }
  return filterPosts
}
