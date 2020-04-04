const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const assert = require("assert");

assert(process.env.NODE_ENV === 'production');

module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: "/scripting-doc/",
    },
});
