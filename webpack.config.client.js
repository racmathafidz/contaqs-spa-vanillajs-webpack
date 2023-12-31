const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    target: "web",
    entry: "./src/client/index.ts",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist", "public"),
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        filename: path.resolve(__dirname, "dist", "public", "index.html"),
    })],
};