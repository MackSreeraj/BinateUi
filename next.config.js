/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side rendering for API routes
  output: 'standalone',
  
  // Configure API routes
  serverRuntimeConfig: {
    // API configuration moved here
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
  },

  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization configuration
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // Configure webpack to handle .webmanifest files
  webpack(config) {
    config.module.rules.push({
      test: /\.webmanifest$/,
      type: 'json',
    });
    return config;
  },

  // Enable CORS for API routes
  async headers() {
    return [
      // Serve .webmanifest files with correct MIME type
      {
        source: '/:path*.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
