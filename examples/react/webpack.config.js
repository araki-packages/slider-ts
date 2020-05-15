const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: [path.resolve(__dirname, './index.jsx')],
  },
  output: {
    path: path.resolve('./dist'),
    publicPath: '.'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
	exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('./index.html'),
      hash: true,
      inject: true,
    }),
  ],
};
