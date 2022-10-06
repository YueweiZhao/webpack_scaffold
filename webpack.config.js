const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

  mode: 'development',

  entry: {
    index: './src/js/index.js',
  },

  output: {
    // 打包时，在包中包含所属模块的信息的注释，在入口文件下层目录生成.map文件
    pathinfo: true,
    // 输出文件的路径
    path: path.resolve(__dirname, 'dist/'),
    // 输出的文件名，[name]代表输入文件名
    filename: 'assets/[name]-[chunkhash:6].js',
    // 静态bundle文件名称
    assetModuleFilename: 'static/image/[name][ext]',
  },

  // module，入口文件只能是js和json，其他类型文件需要loader解析
  module: {
    rules: [
      // css打包工具
      {
        test: /\.(sass|scss|less|css)$/,
        // use会按照从前向后的顺序执行loader
        use: [
          miniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },

      // js打包工具
      {
        test: /\.js$/,
        use: [{
          loader: "babel-loader",
          options: {},
        }]
      },

      // webPack5资源模块
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },

      // html-withimg-loader，打包html中的img文件
      {
        test: /\.html$/,
        use: [{
          loader: "html-withimg-loader",
          options: {},
        }],
      }
    ]
  },

  // plugins，webpack打包插件，没有顺序，在webpack打包过程中的各个钩子中执行
  plugins: [
    // html打包插件
    new htmlWebpackPlugin({
      // 要打包的html文件路径
      template: "./src/index.html",
      // 输出的文件名
      filename: "index.html",
      // html要引入的chunk名称（入口），对应entry中的key
      chunks: ["index"]
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
      ],
    }),

    new miniCssExtractPlugin({
      filename: "assets/[name]-[chunkhash:6].css"
    }),
  ],

  //webpack-dev-server配置
  devServer: {
    // 端口号
    port: 8866,
    // 是否自动打开浏览器
    open: true,
    // 本地跨域代理
    proxy: {
      // 本地请求"/api"的地址时会代理到"localhost:3000"进行请求
      '/api': {
        // 代理地址
        target: 'http://localhost:3000',
        // 重写路径（将/api替换为空）
        pathRewrite: { '^/api': '' },
        // 使用https
        secure: false,
        // 覆盖主机源
        changeOrigin: true,
      },
    }
  }
};