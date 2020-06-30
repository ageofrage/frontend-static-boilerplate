const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./public",
  },
  watch: true,
  watchOptions: {
    ignored: [
      "dist/**",
      "node_modules/**",
      "public/**",
      "package.json",
      "package-lock.json",
    ],
  },
  cache: true,
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["public"] },
    }),
  ],
});
