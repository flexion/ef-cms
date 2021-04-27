const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    migration: './web-api/migration-terraform/main/lambdas/migration.js',
    'migration-segments':
      './web-api/migration-terraform/main/lambdas/migration-segments.js',
  },
  output: {
    clean: true,
    path: __dirname + './web-api/migration-terraform/main/lambdas/dist',
  },
};
