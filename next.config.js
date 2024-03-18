if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withExportImages = require("next-export-optimize-images");

module.exports = withPlugins([withExportImages], {
  images: {
    domains: [
      //process.env.WORDPRESS_API_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0], // Valid WP Image domain.
      "localhost:10004",
      "localhost",
      "0.gravatar.com",
      "1.gravatar.com",
      "2.gravatar.com",
      "secure.gravatar.com",
      "dfwrestaurantportal.com",
      "www.dfwrestaurantportal.com",
      "rw-cms.moritz.work",
    ],
  },
  output: "export", 
  distDir: "out",
});
