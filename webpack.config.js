const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]',
  },
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    targets: {
                      node: 'current',
                    },
                  },

                ],
              ],
            },
          },
          // {
          //   loader: 'eslint-loader',
          // },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  devtool: 'sourcemap',
  resolve: {
    extensions: ['.json', '.ts', '.js'],
  },
};
