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

// Vercel 上勿用 standalone：其 serverless 打包对 sharp 等原生依赖追踪易不完整，运行时 require 失败则永远回退 PNG
const onVercel = process.env.VERCEL === '1'

module.exports = {
  ...(onVercel ? {} : { output: 'standalone' }),
  poweredByHeader: false, // 移除 X-Powered-By 减少响应头
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'], // 优先 AVIF/WebP，体积更小加载更快
  },
  experimental: {
    extensionAlias: {
      '.js': ['.js']
    },
    // pages/api/proxy-image 专用：让 sharp 的 linux-x64 与 libvips 打进 serverless，勿用 /* 以免踩 install/check.js
    outputFileTracingIncludes: {
      '/api/proxy-image': [
        './node_modules/sharp/lib/**/*',
        './node_modules/sharp/package.json',
        './node_modules/@img/sharp-linux-x64/**/*',
        './node_modules/@img/sharp-libvips-linux-x64/**/*'
      ]
    },
    serverComponentsExternalPackages: ['sharp']
  }
}
