const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'ios-support': './js/ios-support.js'
    },
    output: {
        path: path.resolve(__dirname, ''),
        filename: '[name].js'
    }
};