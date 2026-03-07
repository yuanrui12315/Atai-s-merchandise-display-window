module.exports = {
  output: 'standalone',
  poweredByHeader: false, // 移除 X-Powered-By 减少响应头
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'], // 优先 AVIF/WebP，体积更小加载更快
  },
  experimental: {
    extensionAlias: {
      '.js': ['.js']
    }
  }
}
