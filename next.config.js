const { THEME } = require('./blog.config')
const fs = require('fs')
const path = require('path')
const BLOG = require('./blog.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: BLOG.BUNDLE_ANALYZER
})

function scanSubdirectories(directory) {
  const subdirectories = []
  if (!fs.existsSync(directory)) return subdirectories
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file)
    if (fs.statSync(fullPath).isDirectory()) subdirectories.push(file)
  })
  return subdirectories
}

const themes = scanSubdirectories(path.resolve(__dirname, 'themes'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 彻底移除 Next.js 16 不再支持的过时 key (swcMinify, eslint, publicRuntimeConfig)
  output: process.env.EXPORT ? 'export' : (process.env.NEXT_BUILD_STANDALONE === 'true' ? 'standalone' : undefined),
  staticPageGenerationTimeout: 120,
  compress: true,
  poweredByHeader: false,
  
  // 2. 修正图片配置：Next.js 16 弃用了 domains
  images: {
    unoptimized: true, // 这是兼容 Notion 动态图片最稳的做法
    dangerouslyAllowSVG: true,
  },

  // 3. 环境变量（替代原来的 publicRuntimeConfig）
  env: {
    THEMES: JSON.stringify(themes),
  },

  // 4. 路由逻辑优化
  i18n: process.env.EXPORT ? undefined : {
    defaultLocale: BLOG.LANG || 'zh-CN',
    locales: ['zh-CN', 'en'],
  },

  async redirects() {
    return [
      { source: '/feed', destination: '/rss/feed.xml', permanent: true }
    ]
  },

  // 5. Webpack 降级兼容（针对 Next.js 16 强制 Turbopack 的补救）
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    
    // 解决部分 Node.js 模块在客户端无法解析的问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  }
}

module.exports = process.env.ANALYZE ? withBundleAnalyzer(nextConfig) : nextConfig
