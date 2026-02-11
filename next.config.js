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
    // 获取当前主题名称，如果没有设置则默认为 'heo' (根据你的截图，你用的是 heo)
    const theme = process.env.NEXT_PUBLIC_THEME || 'heo'
    
    config.resolve.alias['@'] = path.resolve(__dirname)
    
    // 【关键修正】：别名必须指向具体的主题目录，而不是 theme.js 文件
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', theme)
    
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}

module.exports = nextConfig
