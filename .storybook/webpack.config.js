const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-sourcemap',
  plugins: [
    new Dotenv({
      path: '.env'
    }),
    new webpack.NamedModulesPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  target: 'web'
}
