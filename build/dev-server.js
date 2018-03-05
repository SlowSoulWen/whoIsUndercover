const express = require('express')
const app = express()
var path = require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const session = require('express-session')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
require('babel-register')
const webpackConfig = require('../config/webpack.dev.conf')
const config = require('../config/dev.env')
const websocket = require('../server_modules/websocket')
const httpRoute = require('../server_modules/http')
const compiler = webpack(webpackConfig)

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

var staticPath = path.posix.join('/', 'static')
app.use(staticPath, express.static('./static'))

app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  }
  // store: new MongoStore({  // 将 session 存储到 mongodb
  //   url: config.mongodb  // mongodb 地址
  // })
}))

app.use(require('body-parser')())

const ws = websocket(io)
httpRoute(app, ws)

server.listen(config.port, () => {
  console.log(`app listening on port ${config.port}!`)
})
