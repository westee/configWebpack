const path = require('path')
const uglify = require('uglifyjs-webpack-plugin');
var htmlPlugin = require('html-webpack-plugin');
var extractTextplugin = require('extract-text-webpack-plugin')
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
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: '/\.js$/',
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.scss$/,
        use: extractTextplugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
        use: [{
          loader: 'url-loader', //是指定使用的loader和loader的配置参数
          options: {
            limit: 500 //是把小于500B的文件打成Base64的格式，写入JS
          }
        }]
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
    new extractTextplugin("css/index.css")
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
}