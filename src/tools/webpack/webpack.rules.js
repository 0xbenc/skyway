module.exports = [
  {
    test: /native_modules\/.+\.node$/,
    use: "node-loader",
  },
  {
    test: /\.jsx?$/,
    use: {
      loader: "babel-loader",
      options: {
        exclude: /node_modules/,
        presets: ["@babel/preset-react"],
      },
    },
  },
  {
    test: /\.(jpg)$/,
    use: [
      {
        loader: "file-loader",
        options: {},
      },
    ],
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: "svg-url-loader",
        options: {
          limit: 10000,
        },
      },
    ],
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
];
