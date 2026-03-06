module.exports = {
  output: 'standalone',
  images: { unoptimized: false }, // 启用图片优化，分类缩略图自动压缩加速加载
  experimental: {
    extensionAlias: {
      '.js': ['.js']
    }
  }
}
