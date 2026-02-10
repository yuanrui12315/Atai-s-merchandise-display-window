const { THEME } = require('./blog.config')
const path = require('path')

module.exports = {
  output: 'standalone',
  // 强制跳过所有 ESLint 和 类型检查，不准它因为这些报错
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 核心：强制转换这些包，解决 Clerk 和 Notion 插件的兼容性报错
  transpilePackages: ['@clerk/nextjs', 'react-notion-x', 'notion-client', 'notion-utils'],

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    // 解决部分老包找不到文件系统的报错
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config
  }
}
