import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import {
  checkSlugHasMorThanTwoSlash,
  normalizeSlugForPath,
  processPostData
} from '@/lib/utils/post'
import { idToUuid } from 'notion-utils'
import Slug from '..'

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

/**
 * 编译渲染页面路径
 * @returns
 */
export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })
  const paths = allPages
    ?.filter(row => checkSlugHasMorThanTwoSlash(row))
    .map(row => {
      const norm = normalizeSlugForPath(row)
      const segments = norm.split('/')
      if (segments.length < 3) return null
      const suffix = segments.slice(2)
      if (!suffix.length) return null
      return {
        params: {
          prefix: segments[0],
          slug: segments[1],
          suffix
        }
      }
    })
    .filter(Boolean)
  return {
    paths: paths,
    fallback: true
  }
}

/**
 * 抓取页面数据
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({
  params: { prefix, slug, suffix },
  locale
}) {
  const fullSlug = prefix + '/' + slug + '/' + suffix.join('/')
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      p.type.indexOf('Menu') < 0 &&
      (p.slug === suffix ||
        p.slug === fullSlug.substring(fullSlug.lastIndexOf('/') + 1) ||
        p.slug === fullSlug ||
        p.id === idToUuid(fullSlug))
    )
  })

  // 处理非列表内文章：取路径最后一段作为可能的 Notion 页面 ID
  if (!props?.post) {
    const lastSegment = fullSlug.split('/').pop()
    if (lastSegment && lastSegment.length >= 32 && /^[0-9a-f-]{32,36}$/i.test(lastSegment)) {
      const post = await getPost(lastSegment)
      if (post) props.post = post
    }
  }

  if (!props?.post) {
    return { notFound: true }
  }
  await processPostData(props, from)
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default PrefixSlug
