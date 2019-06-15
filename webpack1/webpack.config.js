const path = require('path');
var ExtractTextWebpackPlugin = require("extract-text-webpack-plugin")
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const Webpack = require('webpack')

module.exports = {
    entry: './src/main.js', //入口文件，src下的index.js
    output: {
        path: path.join(__dirname, 'dist'), // 出口目录，dist文件 打包出来的都是在内存中  不是磁盘中
        filename: '[name].[hash].js', //这里name就是打包出来的文件名，因为是单入口，就是main，多入口下回分解
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: path.join(__dirname, 'src'), //限制范围，提高打包速度
                exclude: /node_modules/
            },
            {
                test: /\.css$/, // 转换文件的匹配正则
                use: ExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                use: ['css-loader']
                })
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    // query: {
                    //     presets: ['env'] // env转换es6 stage-0转es7 react转react
                    // }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/', // 图片输出的路径
                        limit: .1 * 24
                    }
                }
            }
        ]
    },
     resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: {
        'bootstrap': 'bootstrap/dist/css/bootstrap.css'
    }
  },
    plugins: [
         new ExtractTextWebpackPlugin({
            filename: 'css/[name].[hash].css' //放到dist/css/下
         }),
         new UglifyjsWebpackPlugin(),
         new Webpack.ProvidePlugin({
            '$': 'jquery'
         }),
         new Webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"), //静态文件根目录
        port: 9090, // 端口
        host: 'localhost',
        overlay: true,
        hot: true,
        compress: true // 服务器返回浏览器的时候是否启动gzip压缩
    }
}