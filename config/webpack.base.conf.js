const path = require('path')
const vuxLoader = require('vux-loader')

function resolve (src) {
  return path.resolve(__dirname, '..', src)
}

const webpackConfig = {
  entry: {
    app: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: ['src', 'node_modules'],
    alias: {
      '$config': resolve('config'),
      '$src': resolve('src'),
      '$components': resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true', // 加上缓存机制
        include: [resolve('src'), resolve('server_modules')],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
        // options: {
        //   limit: 10000,
        //   name: utils.assetsPath('img/[name].[hash:7].[ext]')
        // }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
        // options: {
        //   limit: 10000,
        //   name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        // }
      }
    ]
  }
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui']
})
