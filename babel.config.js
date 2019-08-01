module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '2',
        targets: {
          chrome: '70',
          edge: '42',
          firefox: '63',
          ie: '11',
          safari: '12',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: ['babel-plugin-cerebral', 'transform-html-import-require-to-string'],
};
