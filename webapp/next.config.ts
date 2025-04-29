import type { NextConfig } from "next";

// Import environment configuration
const envConfig = require('./next.config.env.js');

const nextConfig: NextConfig = {
  images: {
    domains: ['openweathermap.org'],
  },
  // Merge environment variables
  env: {
    ...envConfig.env,
  },
};

export default nextConfig;
