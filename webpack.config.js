const path = require('path');
const webpack = require("webpack")
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'), // 输出路径，就是上步骤中新建的dist目录
        publicPath: '/dist/', // webpack-dev-server 也会默认从 publicPath 为基准 资源路径
        filename: "rule.min.js",// 打包后的文件名
        libraryTarget: 'umd', // 为了支持多种使用场景，我们需要选择合适的打包格式。libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项
        umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test:/\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "scss-loader"
                    },
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
              },
              {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]?[hash]'
                }
            }
        ]
    }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}