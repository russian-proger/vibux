const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        client: './client/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, './server/static/dest'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(.yarn|node_modules)/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource'
            },
        ]
    },
};