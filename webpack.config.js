const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: "./main.js"
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: false
  },
  devtool: 'eval-source-map',
  mode: "development",
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [["@babel/plugin-transform-react-jsx", {pragma:"createElement"}]]
        }
      }
    }]
  },
  devServer: {
    contentBase: './dist',
    open: true
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'dist', 'index.html')
    })
  ]
}