/** @type {import('next').NextConfig} */
const SITE = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.traveldeskgenie.com');

const securityHeaders = [
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1600, 1920],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {source: '/:path*', headers: securityHeaders},
      {source: '/images/:path*', headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]},
    ];
  },
  async redirects() {
    const bare = SITE.host.replace(/^www\./, '');
    return bare === SITE.host
      ? []
      : [{
          source: '/:path*',
          has: [{type: 'host', value: bare}],
          destination: `${SITE.origin}/:path*`,
          permanent: true,
        }];
  },
};

export default nextConfig;
