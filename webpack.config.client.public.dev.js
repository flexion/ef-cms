const config = require('./webpack.config.client');
const HtmlWebpackPlugin = require('html-webpack-plugin');

config.plugins.push(
  new HtmlWebpackPlugin({
    minify: false,
    publicPath: '/',
    template: './web-client/src/index-public.pug',
  }),
);

module.exports = {
  ...config,
  devServer: {
    compress: false,
    historyApiFallback: true,
    hot: false,
    https: false,
    port: 5678,
  },
  entry: {
    index: './web-client/src/index-public.dev.js',
  },
  mode: 'development',
  output: {
    clean: true,
    // eslint-disable-next-line @miovision/disallow-date/no-new-date
    filename: `[name].[fullhash].${new Date()
      .toISOString()
      .replace(/:/g, '.')}.js`,
    path: __dirname + '/dist-public',
  },
};
