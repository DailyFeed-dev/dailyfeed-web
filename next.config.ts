import type { NextConfig } from 'next';

// 백엔드 서버 주소 (예: http://서버주소:8080). .env.local 과 Vercel 환경변수에서 설정합니다.
const apiProxyTarget = process.env.API_PROXY_TARGET;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // 프록시: 브라우저는 우리 사이트의 /api/... 로 요청하고, Next.js 서버가 백엔드로 전달합니다.
  // (https 배포 사이트에서 http 백엔드를 직접 부르면 브라우저가 막기 때문에 필요합니다)
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [{ source: '/api/:path*', destination: `${apiProxyTarget}/api/:path*` }];
  },
};

export default nextConfig;
