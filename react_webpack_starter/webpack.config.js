const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isDevMode = true;
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssRegex = /\.css$/;

// common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss'
          //sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    // if (preProcessor) {
    //   loaders.push({
    //     loader: require.resolve(preProcessor),
    //     options: {
    //       sourceMap: isEnvProduction && shouldUseSourceMap,
    //     },
    //   });
    // }
    return loaders;
  };

function MyExampleWebpackPlugin() {

};

// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function(compiler) {

  // compiler.plugin('compile', function(compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
  //     console.log("This compile compile example00ppp plugin!!!");
  // });
  // // 指定一个挂载到 webpack 自身的事件钩子。
  // compiler.plugin('entryOption', function(compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
  //     console.log("This is an example plugin!!!");
  // });
  //  compiler.plugin('afterPlugins', function(compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
  //     console.log("This is an example00ppp plugin!!!");
  // });
  for(var hook of Object.keys(compiler.hooks)){
            //console.log(hook);
        }
  compiler.hooks.emit.tap('MyPlugin', function(compilation) {
    
    // 在生成文件中，创建一个头部字符串：
    var filelist = 'In this build:\n\n';
    //console.log(compilation.assets);
    // 遍历所有编译过的资源文件，
    // 对于每个文件名称，都添加一行内容。
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n');
    }

    // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist;
      },
      size: function() {
        return filelist.length;
      }
    };

  });

   // 同步钩子
    compiler.hooks.compilation.tap('MyPlugin', compilation => {
      // compilation.hooks.succeedModule.tap('MyPlugin', (htmlData, callback) => {
      //     console.log('车呵呵呵呵好的都看了你的看了看');
      // })

        console.log('以同步方式触及 compilation 钩子。');
    })

  
  compiler.hooks.entryOption.tap('MyPlllugin', params => {
     console.log('entryOption entryOption 钩子。')
  })

  compiler.hooks.compile.tap('MyPlugin', params => {
     console.log('以同步方式触及 compile 钩子。')
  })
};


module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
        chunks: 'all',
        cacheGroups: {
            vendors: {
                test: /react/,
                name: 'axiba'
            },
            // commons: {
            //     name: 'commonddds',
            //     chunks: 'all',
            //     minChunks: 1
            // }
        }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules",
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react',], // 也可以写成presets:['babel-preset-env']
            plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader
          // },
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")()],
              sourceMap: isDevMode
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
          test: cssRegex,
          use: [
          // {
          //   loader: MiniCssExtractPlugin.loader
          // },
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")()],
              sourceMap: isDevMode
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new Webpack.ProvidePlugin({
            '$': 'jquery'
    }),
    new MiniCssExtractPlugin({
          filename:'[name].css',
          chunkFilename: '[id].css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false }
    }),
    new MyExampleWebpackPlugin()
  ],
  devServer: { 
    host:'192.168.254.100', 
    port:8088,
    historyApiFallback: true
  }
};
