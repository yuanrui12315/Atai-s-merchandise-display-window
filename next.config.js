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
    // 关键修正：将别名直接指向 themes 目录本身，并允许 node 解析其内部结构
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes')
    
    // 强制加入模块搜索路径，这样 import '@theme-components/SomeComponent' 就能在 themes 目录下开花结果
    config.resolve.modules.push(path.resolve(__dirname, 'themes'))

    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}

module.exports = nextConfig
