/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cloudinary-images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/rentverse-backend-emqy\.onrender\.com\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  // Remove output: 'export' for PWA
  trailingSlash: true,
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.fazwaz.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    // Remove trailing slash from apiBaseUrl if present
    const cleanApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

    return [
      // Properties API routes - order matters, more specific routes first
      {
        source: '/api/properties/featured',
        destination: `${cleanApiBaseUrl}/api/properties/featured`,
      },
      {
        source: '/api/properties/property/:code',
        destination: `${cleanApiBaseUrl}/api/properties/property/:code`,
      },
      {
        source: '/api/properties/:id/view',
        destination: `${cleanApiBaseUrl}/api/properties/:id/view`,
      },
      {
        source: '/api/properties/:id',
        destination: `${cleanApiBaseUrl}/api/properties/:id`,
      },
      {
        source: '/api/properties',
        destination: `${cleanApiBaseUrl}/api/properties`,
      },
      // Authentication API routes
      {
        source: '/api/auth/login',
        destination: `${cleanApiBaseUrl}/api/auth/login`,
      },
      {
        source: '/api/auth/signup',
        destination: `${cleanApiBaseUrl}/api/auth/signup`,
      },
      {
        source: '/api/auth/register',
        destination: `${cleanApiBaseUrl}/api/auth/register`,
      },
      {
        source: '/api/auth/validate',
        destination: `${cleanApiBaseUrl}/api/auth/me`, // Note: validate maps to /me endpoint
      },
      {
        source: '/api/auth/me',
        destination: `${cleanApiBaseUrl}/api/auth/me`,
      },
      {
        source: '/api/auth/check-email',
        destination: `${cleanApiBaseUrl}/api/auth/check-email`,
      },
      // Upload API routes
      {
        source: '/api/upload/multiple',
        destination: `${cleanApiBaseUrl}/api/upload/multiple`,
      },
      // Generic API catchall for any other API routes (should be last)
      {
        source: '/api/:path*',
        destination: `${cleanApiBaseUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
