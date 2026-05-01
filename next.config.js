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
  // pages/api 不走 serverComponentsExternalPackages；不把 sharp 标成 external 时可能被 webpack打成残包，运行时回退原图 PNG
  webpack: (config, { isServer, nextRuntime }) => {
    if (isServer && nextRuntime !== 'edge') {
      config.externals.push({ sharp: 'commonjs sharp' })
    }
    return config
  },
  experimental: {
    extensionAlias: {
      '.js': ['.js']
    },
    // 勿用 outputFileTracingIncludes 强行打包 sharp：会复制不完整，Vercel 构建 lstat 缺 install/check.js 报错 ENOENT
    serverComponentsExternalPackages: ['sharp']
  }
}
