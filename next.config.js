const { THEME } = require('./blog.config')
const path = require('path')

module.exports = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 核心：这里只保留必要的转译，去掉可能会引起 auth() 报错的包
  transpilePackages: ['react-notion-x', 'notion-client', 'notion-utils'],

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config
  }
}
