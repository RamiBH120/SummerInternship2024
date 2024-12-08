const nodeExternals = require("webpack-node-externals");

const path = require("path");

module.exports = {
  entry: "./index.js",
  mode: "development",

  target: "node",
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "final.js",
  },
  plugins: [],
};
