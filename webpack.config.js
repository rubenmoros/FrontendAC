const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/app/App.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".png"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
            
        },
        hot: true
    },
    mode: "development"
};