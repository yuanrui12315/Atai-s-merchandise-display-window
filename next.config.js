const { THEME } = require('./blog.config')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 强行转译所有可能报错的包
  transpilePackages: [
    '@clerk/nextjs',
    'react-notion-x',
    'notion-client',
    'notion-utils',
    'lucide-react',
    'react-facebook',
    'react-share',
    'syotaro-react-facebook'
  ],

  webpack: (config) => {
    // 解决 fs 模块找不到的问题
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    
    // 设置路径别名，确保 HEO 主题能找到组件
    config.resolve.alias['@'] = path.resolve(__dirname)
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME)
    
    // 强制兼容 CommonJS 和 ESM
    config.module.rules.push({
      test: /\.m?js/,
      resolve: { fullySpecified: false }
    });

    return config
  }
}

module.exports = nextConfig
