/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    GROK_API_KEY: process.env.GROK_API_KEY,
  },
  images: {
    domains: ['localhost'],
  },
  // Add server external packages configuration
  serverExternalPackages: [],
};

module.exports = nextConfig;
