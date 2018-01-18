const express = require('express')
const app = express()
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

app.use(middleware(compiler, {
  publicPath: webpackConfig.output.path,
  index: 'index.html'
}))

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

httpRoute(app)
websocket(io)

server.listen(config.port, () => {
  console.log(`app listening on port ${config.port}!`)
})
