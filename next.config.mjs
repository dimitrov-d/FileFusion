/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    }
  },
};

export default nextConfig;
