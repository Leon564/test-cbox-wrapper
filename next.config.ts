import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Configure headers for the proxy
  async headers() {
    return [
      {
        source: '/api/proxy/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
  
  // Rewrites for cleaner URLs and better proxying
  async rewrites() {
    return [
      {
        source: '/cbox',
        destination: '/api/proxy?boxid=3548579&boxtag=ZJc4tl',
      },
    ];
  },
};

export default nextConfig;
