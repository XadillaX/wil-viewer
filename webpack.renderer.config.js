'use strict';

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
}, {
  test: /\.less$/,
  use: [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
  }, {
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  }],
}, {
  test: /\.tsx$/,
  use: [{ loader: 'ts-loader' }],
});

module.exports = {
  target: 'electron-renderer',
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
