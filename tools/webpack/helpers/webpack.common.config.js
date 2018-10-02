const pathConfig = require('./webpack.path.config')

module.exports = {
  context: pathConfig.context,

  entry: ['babel-polyfill', './examples/src/index.js'],

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{ loader: 'file-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
