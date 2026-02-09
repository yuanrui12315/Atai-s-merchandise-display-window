const { THEME } = require('./blog.config')
const path = require('path')
const BLOG = require('./blog.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 这里的 output 必须这么写，否则 Vercel 找不到启动文件
  output: 'standalone', 
  
  // 2. 图像优化（Heo 主题核心）
  images: {
    unoptimized: true,
  },

  // 3. 这里的 506 报错通常是因为 i18n 配置和你的 blog.config 冲突了
  // 我们直接用最死的方式写，不让它去读取可能出错的变量
  i18n: {
    locales: ['zh-CN'],
    defaultLocale: 'zh-CN',
  },

  // 4. 彻底移除所有异步函数（async headers, async redirects）
  // 这些是触发 506 运行时错误的高危区
  
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    
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
