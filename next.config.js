const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config) => {
    // 强制指定映射关系，确保 @theme-components 能准确指向项目中的 themes 文件夹
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes')
    
    // 如果你的主题文件是在 components 目录下，这行是双重保险
    if (!config.resolve.alias['@theme-components']) {
      config.resolve.alias['@theme-components'] = path.join(__dirname, 'themes')
    }

    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  }
}

module.exports = nextConfig
