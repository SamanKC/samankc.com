/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  generateBuildId: async () => 'build',
};

module.exports = nextConfig;
