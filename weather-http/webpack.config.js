const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    entry: './front/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'static/dist/')
    },
    node: { fs: "empty" },
    target: 'web',
    plugins:  [
        new CleanWebpackPlugin(['static/dist/']),
        new webpack.ProvidePlugin({ 'React': 'react' }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }, {
                test: /\.css$/,
                use: {
                    loader: "css-loader"
                }
            }
        ]
    }
};