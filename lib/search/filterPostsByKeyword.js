/**
 * 按关键词筛选商品：仅 **标题、商品描述 summary、标签、分类**（元数据），**不**读 Notion 正文，避免搜索时大量请求 Notion 导致卡顿、超时。
 */

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
 * @param {Array} allPosts
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
export async function filterPostsByKeyword(allPosts, keyword) {
  const filterPosts = []
  const k = (keyword || '').trim().toLowerCase()
  if (!k) return allPosts

  for (const post of allPosts) {
    const articleInfo = buildArticleInfo(post)
    const metaHit = articleInfo.toLowerCase().indexOf(k) > -1
    post.results = []
    if (metaHit) {
      filterPosts.push(post)
    }
  }

  return filterPosts
}
