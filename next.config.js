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
    // 这里的 path.resolve(__dirname, 'themes') 如果找不到，
    // 我们直接尝试用相对路径强制注入
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@theme-components': path.resolve(__dirname, 'themes'),
    }

    // 解决 fs 报错
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    
    return config;
  }
}

module.exports = nextConfig
