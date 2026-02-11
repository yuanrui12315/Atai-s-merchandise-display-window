const path = require('path')

module.exports = {
  output: 'standalone',
  images: { unoptimized: true },
  webpack: (config) => {
    // 官方别名：这才是最稳的寻路方式
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes/theme.js')
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
