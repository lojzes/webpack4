const path = require('path')

//js 压缩（已经集成到webpack 无需安装,如果webpack 为包含，则需自行安装）
const uglify = require('uglifyjs-webpack-plugin')
// html 插件：负责把生成的js自动插入html 
const htmlPlugin = require('html-webpack-plugin')
//css 分离插件
const extractTextPlugin = require('extract-text-webpack-plugin')

//这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口。
var website ={
   publicPath:"http://localhost:8888/"
  // publicPath:"http://192.168.1.103:8888/"
}

module.exports = {
    mode : 'development',
    //入口配置文件
    entry : {
        //里面的mian 是可以随便写的
        main : './src/main.js'
    },
    //出口文件的配置
    output : {
      //打包的路径
      path : path.resolve(__dirname,'../dist'),
      //打包的文件名
      filename : 'bundle.js',
      publicPath:website.publicPath  //publicPath：主要作用就是处理静态文件路径的。
    },
    //模块：例如解读css,图片如何转换，压缩
    module : {
        rules:[
            //css loader
            {
              test:/\.css$/,
              use: extractTextPlugin.extract({
                   fallback: "style-loader",
                   use: "css-loader"
                 }),
               // css分离后这里需要重新配置，下面就注释了
               // use:[
               //     {loader: "style-loader"},   
               //     {loader:"css-loader"}
               // ]
            },
            //图片 loader
            {
              test:/\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
              use:[{
                  loader:'url-loader', //是指定使用的loader和loader的配置参数
                  options:{
                      limit:500 , //是把小于500B的文件打成Base64的格式，写入JS
                      outputPath:'images/',  //打包后的图片放到images文件夹下
                  }
              }]
          },
          {
            test: /\.(htm|html)$/i,
             use:[ 'html-withimg-loader'] 
          } 
        ]
    },
    //插件，用于生产模板各项功能
    plugins:[
      //js 压缩插件
      new uglify(),
      new htmlPlugin({
        minify:{ //是对html文件进行压缩
            removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
        },
        hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
        template:'./src/index.html' //是要打包的html模版路径和文件名称。  
       }),
       // 效果是：原来的绝对路径改成了相对路径
       new extractTextPlugin("css/index.css")  //这里的/css/index.css 是分离后的路径
    ],
    //配置webpack 开发服务功能
    devServer:{
          //设置基本目录结构
          contentBase : path.resolve(__dirname,'../dist'),
          //服务器的IP地址，可以使用ip也可以使用localhost
          host : 'localhost',
          //服务端压缩是否开启
          compress : true,
          //配置服务端口号
          port : 8888
    }
 
}
















