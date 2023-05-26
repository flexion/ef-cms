import path from 'path';

const webpackConfig = config => {
  config.module?.rules?.push({
    test: /\.(sa|sc|c)ss$/,
    exclude: /\.module\.(sa|sc|c)ss$/i,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            includePaths: [
              './node_modules/@uswds',
              './node_modules/@uswds/uswds/packages',
            ],
          },
        },
      },
    ],
    include: path.resolve(__dirname, '../'),
  });
  return config;
};

export default {
  stories: [
    '../web-client/src/ustc-ui/**/*.stories.@(js|jsx|ts|tsx)',
    '../web-client/src/ustc-ui/**/*.stories.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async config => {
    return webpackConfig(config);
  },
};
