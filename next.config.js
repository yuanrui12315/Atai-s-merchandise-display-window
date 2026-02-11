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
    // 别名焊死：不管谁引用 @theme-components，统统给我指向根目录下的 themes/theme.js
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@theme-components': path.resolve(__dirname, 'themes/theme.js')
    }

    // 这一步是核心：强制 node 模块解析顺序，不给它报错的机会
    config.resolve.modules.push(path.resolve(__dirname))
    
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}

module.exports = nextConfig
