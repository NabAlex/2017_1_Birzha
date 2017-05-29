let path = require('path');

module.exports = {
    entry: './public/js/main.js',
    output: {
        filename: 'bin/bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    watch: false,
    cache: false
};