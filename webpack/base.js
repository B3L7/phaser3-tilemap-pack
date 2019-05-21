const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  output: {
    filename: "bundle.min.js"
  },
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, '../'),
   publicPath: '/dist/',
 },
 module: {
  rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader"
    }
  },
  {
    test: [/\.vert$/, /\.frag$/],
    use: "raw-loader"
  },
  {
    test: /\.(gif|png|jpe?g|svg|xml)$/i,
    use: "file-loader"
  }
  ]
},
plugins: [
new webpack.DefinePlugin({
  CANVAS_RENDERER: JSON.stringify(true),
  WEBGL_RENDERER: JSON.stringify(true)
}),
new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "../index.html"
})
]
};
