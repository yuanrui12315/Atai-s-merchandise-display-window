/**
 * 文章相关工具
 */
import { isHttpLink } from '.'
import { getPostBlocks } from '@/lib/db/getSiteData'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { siteConfig } from '@/lib/config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getAiSummary } from '@/lib/plugins/aiSummary'
import BLOG from '@/blog.config'
import { uploadDataToAlgolia } from '@/lib/plugins/algolia'
import { countWords } from '@/lib/plugins/wordCount'
import { getPageContentText } from '@/lib/notion/getPageContentText'
import { notionIdsEqual } from '@/lib/utils/pageId'

/**
 * 获取商品的关联推荐列表，按分类关联性筛选（同分类商品互相推荐）
 * @param post
 * @param {*} allPosts
 * @param {*} count
 * @returns
 */
export function getRecommendPost(post, allPosts, count = 6) {
  let recommendPosts = []
  const postIds = []
  const currentCats = (post?.allCategories || post?.category || '')
    .toString()
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)
  for (let i = 0; i < allPosts.length; i++) {
    const p = allPosts[i]
    if (p.id === post.id || p.type.indexOf('Post') < 0) {
      continue
    }
    if (postIds.indexOf(p.id) > -1) continue

    const pCats = (p?.allCategories || p?.category || '')
      .toString()
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)
    const hasShared = currentCats.some(c => pCats.includes(c))
    if (hasShared) {
      recommendPosts.push(p)
      postIds.push(p.id)
    }
  }

  if (recommendPosts.length > count) {
    recommendPosts = recommendPosts.slice(0, count)
  }
  return recommendPosts
}

/**
 * 确认slug中不包含 / 符号
 * @param {*} row
 * @returns
 */
export function checkSlugHasNoSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length === 0 &&
    !isHttpLink(slug) &&
    row.type.indexOf('Menu') < 0
  )
}

/**
 * 检查url中包含一个  /
 * @param {*} row
 * @returns
 */
export function checkSlugHasOneSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length === 1 &&
    !isHttpLink(slug) &&
    row.type.indexOf('Menu') < 0
  )
}

/**
 * 检查url中包含两个及以上的  /
 * @param {*} row
 * @returns
 */
export function checkSlugHasMorThanTwoSlash(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (
    (slug.match(/\//g) || []).length >= 2 &&
    row.type.indexOf('Menu') < 0 &&
    !isHttpLink(slug)
  )
}

/**
 * 与上面 slug 检查一致：去掉首尾 `/`，再分段。
 * `getStaticPaths` 必须用此结果生成 params，禁止直接对原始 `row.slug` split，
 * 否则 `/article/xxx` 会拆成 `['','article','xxx']`，与 `article/xxx` 路由冲突（Next：Conflicting paths）。
 */
export function normalizeSlugForPath(row) {
  const raw = row?.slug
  if (!raw || typeof raw !== 'string') return ''
  let slug = raw.trim()
  while (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  while (slug.endsWith('/')) {
    slug = slug.substring(0, slug.length - 1)
  }
  return slug
}

/**
 * 获取文章摘要
 * @param props
 * @param pageContentText
 * @returns {Promise<void>}
 */
async function getPageAISummary(props, pageContentText) {
  const aiSummaryAPI = siteConfig('AI_SUMMARY_API')
  if (aiSummaryAPI) {
    const post = props.post
    const cacheKey = `ai_summary_${post.id}`
    let aiSummary = await getDataFromCache(cacheKey)
    if (aiSummary) {
      props.post.aiSummary = aiSummary
    } else {
      const aiSummaryKey = siteConfig('AI_SUMMARY_KEY')
      const aiSummaryCacheTime = siteConfig('AI_SUMMARY_CACHE_TIME')
      const wordLimit = siteConfig('AI_SUMMARY_WORD_LIMIT', '1000')
      let content = ''
      for (let heading of post.toc) {
        content += heading.text + ' '
      }
      content += pageContentText
      const combinedText = post.title + ' ' + content
      const truncatedText = combinedText.slice(0, wordLimit)
      aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText)
      await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
      props.post.aiSummary = aiSummary
    }
  }
}

/**
 * 处理文章数据
 * @param props
 * @param from
 * @returns {Promise<void>}
 */
export async function processPostData(props, from) {
  // 文章内容加载
  if (!props?.post?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from)
  }

  if (props.post?.blockMap?.block) {
    // 目录默认加载
    props.post.content = Object.keys(props.post.blockMap.block).filter(key =>
      notionIdsEqual(
        props.post.blockMap.block[key]?.value?.parent_id,
        props.post.id
      )
    )
    props.post.toc = getPageTableOfContents(props.post, props.post.blockMap)
    const pageContentText = getPageContentText(props.post, props.post.blockMap)
    const { wordCount, readTime } = countWords(pageContentText)
    props.post.wordCount = wordCount
    props.post.readTime = readTime
    await getPageAISummary(props, pageContentText)
  }

  // 生成全文索引 && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post)
  }

  // 推荐关联文章处理
  const allPosts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  if (allPosts && allPosts.length > 0) {
    const index = allPosts.indexOf(props.post)
    props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
    props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
    props.recommendPosts = getRecommendPost(
      props.post,
      allPosts,
      siteConfig('POST_RECOMMEND_COUNT')
    )
  } else {
    props.prev = null
    props.next = null
    props.recommendPosts = []
  }

  delete props.allPages
}
