/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    
    // Suppress deprecation warnings
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://tms-backend-mnf4.onrender.com',
    NEXT_PUBLIC_RENDER_API_URL: process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://tms-backend-mnf4.onrender.com',
    GROK_API_KEY: process.env.GROK_API_KEY,
  },
  images: {
    domains: ['localhost'],
  },
  // Add server external packages configuration
  serverExternalPackages: [],
};

module.exports = nextConfig;
