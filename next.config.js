const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  experimental: {
    optimizePackageImports: ['react-icons', '@paypal/paypal-js'],
  },
  async redirects() {
    return [
      // Redirect old HTML files to new routes
      {
        source: '/youtube-views.html',
        destination: '/products/youtube-views',
        permanent: true,
      },
      {
        source: '/youtube-likes.html',
        destination: '/products/youtube-likes',
        permanent: true,
      },
      {
        source: '/youtube-subscribers.html',
        destination: '/products/youtube-subscribers',
        permanent: true,
      },
      {
        source: '/deutsche-youtube-views.html',
        destination: '/products/deutsche-youtube-views',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400'
          }
        ]
      }
    ]
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = withBundleAnalyzer(nextConfig)