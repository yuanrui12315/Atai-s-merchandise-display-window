const path = require('path')

module.exports = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  webpack: (config) => {
    // 强制定义物理路径
    const themesPath = path.resolve(__dirname, 'themes')
    const themeEntry = path.resolve(__dirname, 'themes/theme.js')

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      // 核心：把这个别名直接物理映射到那个 theme.js 文件上
      '@theme-components': themeEntry
    }

    // 这一步是为了防止某些文件通过路径访问 themes 文件夹失败
    config.resolve.modules.push(path.resolve(__dirname))

    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
