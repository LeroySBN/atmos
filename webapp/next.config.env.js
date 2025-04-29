// Environment configuration for Next.js
module.exports = {
  env: {
    // For client-side requests (browser), use the external URL
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
};
