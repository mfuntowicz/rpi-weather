const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production')
};
const PROD = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './static/js',
    output: {
        path: 'D:\\Workspace\\Python\\rpi-weather\\weather-http\\static\\dist',
        filename: 'bundle.js',
    },
    node: {
        fs: "empty"
    },
    target: 'web',
    plugins: PROD ?
        [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
            new webpack.DefinePlugin(GLOBALS),
            new ExtractTextPlugin('bundle.css'),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
        ] :
        [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};