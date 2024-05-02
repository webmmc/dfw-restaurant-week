if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
// const withExportImages = require("next-export-optimize-images");
const path = require('path');

module.exports = withPlugins([], {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '*.dfwrestaurantportal.com',
      },
      {
        protocol: 'https',
        hostname: '*.rw-cms.moritz.work',
      },
      {
        protocol: 'https',
        hostname: 'rw-cms.moritz.work',
      },
      {
        protocol: 'http',
        hostname: 'rw-cms.moritz.work',
      },
    ],
    unoptimized: true,
  },
  output: "export",
  distDir: "out",
});
