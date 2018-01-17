const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
require('babel-register')
const webpackConfig = require('../config/webpack.dev.conf')
const config = require('../config/dev.env')
const websocket = require('../server_modules/websocket')
const httpRoute = require('../server_modules/http')

const app = express()
const compiler = webpack(webpackConfig)

app.use(middleware(compiler, {
  publicPath: webpackConfig.output.path,
  index: 'index.html'
}))

httpRoute(app)
websocket(app)

app.listen(config.port, () => {
  console.log(`app listening on port ${config.port}!`)
})
