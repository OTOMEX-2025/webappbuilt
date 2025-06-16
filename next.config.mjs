/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
