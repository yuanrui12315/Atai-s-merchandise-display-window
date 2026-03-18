import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 关于页面 - 静态备用
 * 当 Notion 中 slug=about 的页面未同步或 404 时，此页面保证 /about 可访问
 */
const AboutPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutAbout' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'about-page', locale })
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

export default AboutPage
