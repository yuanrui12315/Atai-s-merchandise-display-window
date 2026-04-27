/* 与 package.json 的 build 行一致，防止 Vercel 等环境把「构建命令」改成裸 `next build` 时未带 cross-env。 */
if (process.env.NEXT_SEARCH_NO_REMOTE !== '0') {
  const argv = process.argv || []
  const looksLikeNextBin = argv.some(
    p => typeof p === 'string' && /([/\\]|\b)next(\.js)?$/.test(p)
  )
  const inNextBuild = looksLikeNextBin && argv.includes('build')
  if (
    inNextBuild ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    process.env.NEXT_SEARCH_NO_REMOTE = '1'
  }
}

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
