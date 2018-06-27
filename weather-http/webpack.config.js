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
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'React': 'react'
        }),
        new CleanWebpackPlugin(['static/dist/'])
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },{
                test: /\.css$/,
                use: {
                    loader: "css-loader"
                }
            }
        ]
    }
};