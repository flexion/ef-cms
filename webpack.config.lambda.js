const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = copyDestinations => ({
  devtool: 'source-map',
  externals: {
    '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
    'aws-crt': 'commonjs aws-crt',
    'puppeteer-core': 'commonjs puppeteer-core',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        // eslint-disable-next-line
        test: /\.(jsx)$/,
        use: ['babel-loader'],
      },
      {
        // eslint-disable-next-line
        test: /\.(map|node)$/,
        use: ['file-loader'],
      },
      {
        exclude: /node_modules/,
        // eslint-disable-next-line
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin({
      patterns: copyDestinations.flatMap(destination => [
        { from: 'node_modules/pdfjs-dist/legacy/build', to: destination },
        { from: 'node_modules/pdf-lib/dist', to: destination },
        {
          from: 'shared/static/pdfs/amended-petition-form.pdf',
          to: destination,
        },
      ]),
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'cody-seibert',
      project: 'node-awslambda',
      release: {
        name: process.env.COMMIT_SHA,
      },
      telemetry: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()], // Allows us to use the tsconfig path alias + basePath
  },
  target: 'node',
});
