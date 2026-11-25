import type { NextConfig } from 'next';

// Media and 3D models live in the heseos-media R2 bucket at the same paths as public/.
// With NEXT_PUBLIC_MEDIA_URL set, /media/* and /assets/* that aren't on disk are served from it, so CSS, JSON data and next/image keep their plain paths.
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    return MEDIA_URL ? [
      { source: '/media/:path*', destination: `${MEDIA_URL}/media/:path*` },
      { source: '/assets/:path*', destination: `${MEDIA_URL}/assets/:path*` },
    ] : [];
  },
  // The schema files in drizzle/ are applied on first database use (lib/admin/database.ts).
  outputFileTracingIncludes: { '/api/**': ['./drizzle/*.sql'] },
  serverExternalPackages: ['@libsql/client', 'libsql'],
  async redirects() {
    return [
      { source: '/products/browse/automation-controls/screen-control-panels', destination: '/products/browse/smart-switches-panels/screen-control-panels', permanent: true },
      { source: '/packages', destination: '/demo', permanent: true },
      { source: '/compare', destination: '/products', permanent: true },
      // The online store is retired: bag and checkout links go to the shop or a demo.
      { source: '/store', destination: '/shop', permanent: true },
      { source: '/store/:path*', destination: '/shop', permanent: true },
      { source: '/bag', destination: '/shop', permanent: true },
      { source: '/build', destination: '/demo', permanent: true },
      { source: '/checkout', destination: '/demo', permanent: true },
      { source: '/solutions', destination: '/about#spaces', permanent: true },
      { source: '/solutions/:slug', destination: '/demo', permanent: true },
    ];
  },
};

export default nextConfig;