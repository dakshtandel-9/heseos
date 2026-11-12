import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The schema files in drizzle/ are applied on first database use (lib/admin/database.ts).
  outputFileTracingIncludes: { '/api/**': ['./drizzle/*.sql'] },
  serverExternalPackages: ['@libsql/client', 'libsql'],
  async redirects() {
    return [
      { source: '/packages', destination: '/demo', permanent: true },
      { source: '/compare', destination: '/products', permanent: true },
      // The online store is retired: shop, bag and checkout links go to the catalogue or a demo.
      { source: '/store', destination: '/products', permanent: true },
      { source: '/store/:path*', destination: '/products', permanent: true },
      { source: '/shop', destination: '/products', permanent: true },
      { source: '/shop/:path*', destination: '/products', permanent: true },
      { source: '/bag', destination: '/products', permanent: true },
      { source: '/build', destination: '/demo', permanent: true },
      { source: '/checkout', destination: '/demo', permanent: true },
      { source: '/solutions', destination: '/about#spaces', permanent: true },
      { source: '/solutions/:slug', destination: '/demo', permanent: true },
    ];
  },
};

export default nextConfig;