/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      });
      return config;
    },
    images: {
      domains: ['mrasco.s3.us-east-2.amazonaws.com'],
     },
  };