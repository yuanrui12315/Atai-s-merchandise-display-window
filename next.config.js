const { THEME } = require('./blog.config')
const path = require('path')

module.exports = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 这里只保留最核心的几个包，减少 Webpack 解析负担
  transpilePackages: [
    'react-notion-x',
    'notion-client',
    'notion-utils',
    '@clerk/nextjs'
  ],

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
