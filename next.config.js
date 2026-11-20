/** @type {import('next').NextConfig} */
// Domain moves stay documented only. Do not add a redirects key.
// See docs/domain-switch.md.
const nextConfig = {
  output: 'standalone',
  experimental: {
    // The Keystatic reader opens content/ with fs at request time, so file
    // tracing cannot see it. Include it in every server function bundle.
    outputFileTracingIncludes: {
      '/**/*': ['./content/**/*'],
    },
  },
}

module.exports = nextConfig
