const path = require('path');

const PATHS = {
  index: path.join(__dirname, 'src', 'index.js'),
  dist: path.join(__dirname, 'dist')
}

module.exports = (conf) => ({
  devtool: 'inline-source-map',
  entry: [ PATHS.index ],
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: PATHS.dist
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'eslint-loader',
        include: [ PATHS.index ],
        enforce: 'pre'
      },
      {
        test: /.js$/,
        include: [ PATHS.index ],
        loader: 'babel-loader'
      }
    ]
  }
})
