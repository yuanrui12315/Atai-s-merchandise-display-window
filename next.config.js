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
    // 强制路径映射：直接指向你截图里的 theme.js 文件
    config.resolve.alias['@'] = path.resolve(process.cwd())
    config.resolve.alias['@theme-components'] = path.resolve(process.cwd(), 'themes', 'theme.js')
    
    // 解决 fs 模块在客户端找不到的问题
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    
    return config
  }
}

module.exports = nextConfig
