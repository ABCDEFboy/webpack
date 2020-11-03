const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js',
  }, // 入口文件
  output: {
    filename: '[name][chunkhash:8].js', // 打包后的文件名称
    path: path.resolve('dist'), // 打包后的目录，必须是绝对路径
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
    },
  },
};
