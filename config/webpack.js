const webpack = require('webpack');
const path = require('path');

const BASE_PATH = path.join(__dirname, '..');
const BUILD_PATH = path.join(BASE_PATH, 'dist');
const LIB_PATH = path.join(BASE_PATH, 'lib');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    bwallet: './lib/index.js'
  },
  externals: {
    react: 'React'
  },
  node: {
    fs: 'empty'
  },
  output: {
    library: 'bwallet',
    libraryTarget: 'umd',
    path: BUILD_PATH,
    filename: '[name].js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json', 'jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [LIB_PATH],
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react', 'stage-3'],
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(true),
    }),
  ],
};
