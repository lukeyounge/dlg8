/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  outputFileTracingRoot: __dirname
}

module.exports = nextConfig
