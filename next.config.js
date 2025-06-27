/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support dynamic routes and API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'], // Add your image domains here if needed
  },
  // Add any other necessary configurations here
};

module.exports = nextConfig;
