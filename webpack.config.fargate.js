const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    worker: './web-api/terraform/main/worker.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/main/dist',
  },
};
