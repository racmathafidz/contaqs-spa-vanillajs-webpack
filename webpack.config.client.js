const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    target: "web",
    entry: "./dist-js/client/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist", "public"),
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        filename: path.resolve(__dirname, "dist", "public", "index.html"),
    })],
};