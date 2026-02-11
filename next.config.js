const path = require('path')

module.exports = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@theme-components': path.resolve(__dirname, 'themes/theme.js')
    }
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
