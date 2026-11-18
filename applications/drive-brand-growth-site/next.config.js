/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/insights', destination: '/', permanent: false },
      { source: '/insights/:path*', destination: '/', permanent: false },
    ]
  },
}

module.exports = nextConfig
