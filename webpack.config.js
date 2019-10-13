const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.js'],
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
        test: /\.tsx?/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
        ],
      },
      {
        test: /\.m?js$/,
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
          {
            loader: 'source-map-loader',
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
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.json', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
};
