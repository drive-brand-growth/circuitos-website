/** @type {import('next').NextConfig} */
// The domain move is one host based 301 in middleware.ts. Do not add a redirects key.
// See docs/domain-switch.md.
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
