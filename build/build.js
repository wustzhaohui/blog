
var webpackConfig = require('../webpack.config.js');
var webpack = require('webpack');

webpack(webpackConfig, function(err, state) {
    console.log(2333);
});