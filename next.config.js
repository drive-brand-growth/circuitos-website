/** @type {import('next').NextConfig} */
// Domain moves stay documented only. Do not add a redirects key.
// See docs/domain-switch.md.
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Dynamic routes (/admin, /keystatic) read content/*.yaml at request time.
    // Ship the content tree with every server function so those reads succeed.
    outputFileTracingIncludes: {
      '/**': ['./content/**/*'],
    },
  },
}

module.exports = nextConfig
