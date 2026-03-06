const BLOG = require('./blog.config')

/**
 * 通常没啥用，sitemap交给 /pages/sitemap.xml.js 动态生成
 * 排除易 404 或无需收录的路径，减少爬虫 404
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/auth', '/auth/*', '/sign-in', '/sign-in/*', '/sign-up', '/sign-up/*', '/dashboard', '/dashboard/*', '/password', '/search/NotionNext', '/search/NotionNext/*']
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
