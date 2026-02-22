import fs from 'fs'
import BLOG from '@/blog.config'

export function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link || BLOG.LINK
  const ROBOTS_ALLOW = BLOG.ROBOTS_ALLOW !== false

  const content = ROBOTS_ALLOW
    ? `
    # *
    User-agent: *
    Allow: /
  
    # Host
    Host: ${LINK}
  
    # Sitemaps
    Sitemap: ${LINK}/sitemap.xml
  
    `
    : `
    # 禁止搜索引擎爬取（私人网站）
    User-agent: *
    Disallow: /
  
    # Host
    Host: ${LINK}
    `
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
