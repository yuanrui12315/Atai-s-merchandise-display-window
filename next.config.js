const { THEME } = require('./blog.config')
const path = require('path')

module.exports = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  transpilePackages: ['react-notion-x', 'notion-client', 'notion-utils', '@clerk/nextjs'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
