import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://backend-ecommerce-production-7c80.up.railway.app';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
