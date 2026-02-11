const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config) => {
    // 1. 设置根目录别名
    config.resolve.alias['@'] = path.resolve(__dirname)
    
    // 2. 设置主题目录别名
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes')
    
    // 3. 【最关键的一步】：告诉 Webpack 如果找不到 index，就去找你截图里的 theme.js
    config.resolve.mainFiles = ['index', 'theme']

    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}

module.exports = nextConfig
