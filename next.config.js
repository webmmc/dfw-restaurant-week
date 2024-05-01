if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withExportImages = require("next-export-optimize-images");
const path = require('path');

module.exports = {
  async redirects() {
    return [
      {
        source: '/favicon/android-chrome-192x192.png',
        destination: '/out/static/favicon/android-chrome-192x192.png',
        permanent: true,
      },
      {
        source: '/favicon/android-chrome-384x384.png',
        destination: '/out/static/favicon/android-chrome-384x384.png',
        permanent: true,
      },
      {
        source: '/favicon/apple-touch-icon.png',
        destination: '/out/static/favicon/apple-touch-icon.png',
        permanent: true,
      },
      // Add more redirections for other favicon files if needed
    ];
  },
};

module.exports = withPlugins([withExportImages], {
  images: {
    // domains: [
    //   //process.env.WORDPRESS_API_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0], // Valid WP Image domain.
    //   "localhost:10004",
    //   "localhost",
    //   "0.gravatar.com",
    //   "1.gravatar.com",
    //   "2.gravatar.com",
    //   "secure.gravatar.com",
    //   "dfwrestaurantportal.com",
    //   "www.dfwrestaurantportal.com",
    //   "rw-cms.moritz.work",
    // ],
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
  },
  output: "export", 
  distDir: "out",
});
