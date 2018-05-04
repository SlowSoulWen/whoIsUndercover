const express = require('express')
const app = express()
var path = require('path')
const server = require('http').Server(app)
const customParser = require('socket.io-json-parser')
const io = require('socket.io')(server, {
  parser: customParser,
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000
})
const session = require('express-session')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
require('babel-register')
const config = require('../config')
const websocket = require('../server_modules/websocket')
const httpRoute = require('../server_modules/http')
const wechatRouter = require('./wechat')

const webpackConfig = process.env.NODE_ENV === 'test'
? require('./webpack.prod.conf')
: require('./webpack.dev.conf')
const compiler = webpack(webpackConfig)

var port = process.env.PORT || config.dev.port

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  reload: true,
  log: () => {}
})
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.use(middleware(compiler, {
  publicPath: webpackConfig.output.path,
  quiet: true
}))

app.use(hotMiddleware)

app.use(devMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// app.use(session({
//   name: config.dev.session.key, // 设置 cookie 中保存 session id 的字段名称
//   secret: config.dev.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//   cookie: {
//     maxAge: config.dev.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
//   }
//   // store: new MongoStore({  // 将 session 存储到 mongodb
//   //   url: config.mongodb  // mongodb 地址
//   // })
// }))

app.use(require('cookie-parser')())
app.use(require('body-parser')())

websocket(io)
httpRoute(app)
wechatRouter(app)

server.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})
