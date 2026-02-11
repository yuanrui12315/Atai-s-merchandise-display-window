const path = require('path')

module.exports = {
  output: 'standalone',
  images: { unoptimized: true },
  webpack: (config) => {
    // 强制 @ 符号指向根目录，这样 theme.js 里的 "@/blog.config" 才能找到文件
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
