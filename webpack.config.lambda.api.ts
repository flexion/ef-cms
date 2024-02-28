/* eslint-disable import/no-default-export */
import config from './webpack.config.lambda';
import webpack from 'webpack';

const apiConfig: webpack.Configuration = {
  ...(config as any),
  entry: {
    handlers: './web-api/terraform/template/lambdas/handlers.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/template/lambdas/dist',
  },
};

export default apiConfig;
