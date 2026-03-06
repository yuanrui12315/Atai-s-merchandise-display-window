import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from './config'
/**
 * 生成站点地图
 * @param {*} param0
 */
export function generateSitemapXml({ allPages, NOTION_CONFIG }) {
  let link = siteConfig('LINK', BLOG.LINK, NOTION_CONFIG)
  // 确保链接不以斜杠结尾
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }
  const urls = [
    {
      loc: `${link}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${link}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    },
    {
      loc: `${link}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    }
  ]
  // 仅包含已发布的 Post，过滤空 slug
  const posts = allPages?.filter(
    p => p?.status === 'Published' && p?.type === 'Post' && p?.slug
  ) || []
  posts.forEach(post => {
    const slugWithoutLeadingSlash = post.slug.startsWith('/')
      ? post.slug.slice(1)
      : post.slug
    if (!slugWithoutLeadingSlash) return
    const lastmod = post?.publishDay || post?.lastEditedTime || post?.date
    urls.push({
      loc: `${link}/${slugWithoutLeadingSlash}`,
      lastmod: lastmod ? new Date(lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    })
  })
  const xml = createSitemapXml(urls)
  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function escapeXml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}
