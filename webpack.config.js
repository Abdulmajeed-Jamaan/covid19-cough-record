const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: './js/index.js',
        'ios-support': './js/ios-support.js'
    },
    output: {
        path: path.resolve(__dirname, ''),
        filename: '[name].js'
    }
};