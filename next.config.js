const { THEME } = require('./blog.config')
const path = require('path')
const BLOG = require('./blog.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 适配 Next.js 16，移除所有过时 key
  output: 'standalone', 
  staticPageGenerationTimeout: 300,
  images: {
    unoptimized: true, // 确保 Notion 图片在 Heo 主题中正常显示
  },
  // Heo 主题需要的语言环境配置
  i18n: {
    defaultLocale: BLOG.LANG || 'zh-CN',
    locales: ['zh-CN', 'en'],
  },
  // 确保 Heo 主题的 API 和 RSS 重定向正常
  async redirects() {
    return [
      { source: '/feed', destination: '/rss/feed.xml', permanent: true }
    ]
  },
  webpack: (config, { isServer }) => {
    // 关键：确保 Heo 主题的组件路径解析正确
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    
    // 解决 Next 16 的 Webpack 兼容性
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  }
}

module.exports = nextConfig
