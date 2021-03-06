const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ThreadsPlugin = require('threads-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'index_bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif|woff2?)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.module\.s[ac]ss$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "@teamsupercell/typings-for-css-modules-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    {loader: "sass-loader", options: {sourceMap: isDevelopment}}
                ]
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /\.module.s[ac]ss$/,
                loader: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss', '.sass'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: "FreeSpace Open Scripting documentation",
            publicPath: "/",
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
        }),
        new ThreadsPlugin({
            globalObject: 'this' // <-- this is the default value
        }),
        gitRevisionPlugin,
        new webpack.DefinePlugin({
          '__VERSION__': JSON.stringify(gitRevisionPlugin.version()),
          '__COMMITHASH__': JSON.stringify(gitRevisionPlugin.commithash()),
          '__BRANCH__': JSON.stringify(gitRevisionPlugin.branch()),
        }),
    ],
};
