const path = require('path')
const uglify = require('uglifyjs-webpack-plugin');
var htmlPlugin = require('html-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin')

//消除未使用的CSS
const glob = require('glob');   
const PurifyCSSPlugin = require("purifycss-webpack");

var website = {
  publicPath: "http://localhost:8888/"
  // publicPath:"http://192.168.1.103:8888/"
}
//把CSS从JavasScript代码中分离出来，还有一个是如何处理分离出来后CSS中的图片路径不对问题
// let base = {
//   index = 
// }
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    mian2: './src/main2.js',
    // style:'./src/style/index.scss'
  },
  output: {
    path: path.resolve(__dirname, '../dist'), //相对于本文件目录。
    filename: '[name]_[chunkhash].js',
    publicPath: website.publicPath,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
      {
        test: /\.scss$/, //将生成的css文件单独提取出放到一个目录下。
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'sass-loader', 'postcss-loader']
        })
      },
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
            },
          ]
        })
      },
      //   test:/\.scss$/,
      //   use:[
      //     {loader:'style-loader'},
      //     {loader:'css-loader'},
      //     {loader:'sass-loader'}
      //   ]
      // }
      
      {
        test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
        use: [{
          loader: 'url-loader', //是指定使用的loader和loader的配置参数
          options: {
            limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
            outputPath: 'img/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      }
    ]
  },
  plugins: [
    new uglify(), //压缩打包后的文件
    new htmlPlugin({
      minify: { //是对html文件进行压缩
        removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。
      },
      hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
      template: './src/index.html' //是要打包的html模版路径和文件名称。
    }),
    new extractTextPlugin({
      filename: "css/[name].css",
      disable: false,
      allChunks: true,
      
    }),
    new PurifyCSSPlugin({ 
      //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
      }),

  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
}