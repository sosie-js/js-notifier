
module.exports = (env, argv) => {
  const path = require('path');
  const pkg = require('./package.json');

  /**
   * Environment
   *
   * @type {any}
   */
  const NODE_ENV = argv.mode || 'development';
  const VERSION = process.env.VERSION || pkg.version;

  /**
   * Plugins for bundle
   *
   * @type {webpack}
   */
  const webpack = require('webpack');

    return  {
    entry: './src/notifier.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            {
                loader: 'eslint-loader',
                options: {
                  formatter: require('eslint/lib/cli-engine/formatters/stylish') /*eslint 6.x+:*/
                /* formatter: require('eslint/lib/formatters/stylish') /*eslint 5.x*/
                },
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader"
          ]
        }
      ]
    },
     plugins: [
      /** Pass variables into modules */
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        VERSION: JSON.stringify(VERSION),
      }),

      new webpack.BannerPlugin({
        banner: `js-notifier with demo extension for SoSIE\n\n@version ${VERSION}\n\n@licence MIT\n@author CodeX <https://codex.so>\n@author SoSIE <https://sosie.sos-productions.com>`,
      }),
     ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js',
        library: 'notifier',
        libraryTarget: 'umd'
    }
  };
};
