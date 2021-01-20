const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const assert = require("assert");

assert(process.env.NODE_ENV === 'development');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true,
    },
});
