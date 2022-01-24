/**
 * Webpack config for both development and production.
 * 
 * @author: Sofie Wallin
 */

const path = require('path');

module.exports = {
    entry: {
        index: '/src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: './images/[name].[hash][ext][query]',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-transform-runtime']
                  }
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    }
};