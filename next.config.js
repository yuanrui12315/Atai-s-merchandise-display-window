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
    // 强制把路径别名注入到最顶层
    config.resolve.alias = Object.assign({}, config.resolve.alias, {
      '@': path.resolve(__dirname),
      '@theme-components': path.resolve(__dirname, 'themes')
    })

    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}

module.exports = nextConfig
