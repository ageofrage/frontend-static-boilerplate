/* -------------------------------------------------------------------------- */
/*                                   import                                   */
/* -------------------------------------------------------------------------- */
const path = require("path");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/* -------------------------------------------------------------------------- */
/*                            variables, functions                            */
/* -------------------------------------------------------------------------- */
let entry = {};
const srcDir = (e) => {
  return `./public/${e}`;
};
const entries = (dir, resolveKey, entryKey = resolveKey) => {
  entry[entryKey] = path.resolve(srcDir(dir), resolveKey);
  return entry;
};

/* ----------------------------------- js ----------------------------------- */
glob
  .sync("src/**/*.+(js|jsx|ts|tsx)", {
    ignore: ["_*/*", "**/_*.+(js|jsx|ts|tsx)"],
    cwd: srcDir("js"),
  })
  .map((key) => {
    const regKey = key.replace(/\.(jsx|js|ts|tsx)$/, ""); // 吐き出される拡張子に調整
    entries("js", key, regKey);
  });

/* ---------------------------------- style --------------------------------- */
glob
  .sync("src/**/*.+(sass|scss)", {
    ignore: "**/_*.+(sass|scss)",
    cwd: srcDir("sass"),
  })
  .map((key) => {
    const regKey = key.replace(/\.(sass|scss)$/, ""); // 吐き出される拡張子に調整
    entries("sass", key, regKey);
  });

/* ----------------------------------- img ---------------------------------- */
glob
  .sync("src/**/*.+(jpg|png|gif|svg)", {
    ignore: "**/_*.+(jpg|png|gif|svg)",
    cwd: srcDir("img"),
  })
  .map((key) => {
    entries("img", key);
  });

/* -------------------------------------------------------------------------- */
/*                                   config                                   */
/* -------------------------------------------------------------------------- */
module.exports = {
  entry: entry,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Production",
    }),
  ],
  resolve: {
    alias: {
      atoms: path.resolve(__dirname, "src/components/atoms/"),
      molecules: path.resolve(__dirname, "src/components/molecules/"),
      organisms: path.resolve(__dirname, "src/components/organisms/"),
      templates: path.resolve(__dirname, "src/components/templates/"),
      pages: path.resolve(__dirname, "src/components/pages/"),
      common: path.resolve(__dirname, "src/common/"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "entry",
                  corejs: 3, // or 2
                  targets: {
                    ie: "11",
                  },
                  modules: "cjs",
                },
              ],
              ["@babel/preset-react"],
            ],
            plugins: [
              [
                "@babel/plugin-proposal-decorators",
                {
                  legacy: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              plugins: [
                require("autoprefixer")({
                  grid: true,
                }),
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "import-glob-loader",
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "assets/img/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
