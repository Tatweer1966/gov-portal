/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'strapi'],
  },
  async rewrites() {
    return [
      {
        source: '/api/cms/:path*',
        destination: 'http://strapi:1337/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;