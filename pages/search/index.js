import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { filterPostsByKeyword } from '@/lib/search/filterPostsByKeyword'
import { DynamicLayout } from '@/themes/theme'

/**
 * 搜索路由：使用 /search?s=关键词（关键词在查询串），避免路径含中文在 Cloudflare/代理下出现连接失败
 */
const Search = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

export async function getServerSideProps(context) {
  const { locale, query } = context
  const rawS = query.s ?? query.q ?? ''
  const keyword = (Array.isArray(rawS) ? rawS[0] : rawS || '').trim()
  const rawPage = query.page ?? '1'
  const pageNum =
    parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage, 10) || 1

  const props = await getGlobalData({
    from: 'search-props',
    locale
  })
  const { allPages } = props
  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  if (keyword) {
    const matched = await filterPostsByKeyword(allPosts, keyword)
    props.postCount = matched.length
    props.keyword = keyword
    props.page = pageNum

    const POST_LIST_STYLE = siteConfig(
      'POST_LIST_STYLE',
      'Page',
      props?.NOTION_CONFIG
    )
    const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)

    if (POST_LIST_STYLE === 'scroll') {
      props.posts = matched
    } else if (POST_LIST_STYLE) {
      props.posts = matched.slice(
        POSTS_PER_PAGE * (pageNum - 1),
        POSTS_PER_PAGE * pageNum
      )
    } else {
      props.posts = matched
    }
  } else {
    props.posts = []
    props.postCount = 0
    props.keyword = ''
    props.page = 1
  }

  delete props.allPages
  return { props }
}

export default Search
