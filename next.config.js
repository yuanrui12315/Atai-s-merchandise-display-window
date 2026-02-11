module.exports = {
  output: 'standalone',
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false }
    return config
  }
}
