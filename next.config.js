const path = require('path')

module.exports = {
  output: 'standalone',
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes/theme.js')
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.fallback = { fs: false }
    return config
  }
}
