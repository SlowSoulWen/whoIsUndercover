const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackConfig = require('../config/webpack.dev.conf')
const config = require('../config/dev.env')

const app = express()
const compiler = webpack(webpackConfig)

app.use(middleware(compiler, {
  publicPath: webpackConfig.output.path,
  index: 'index.html'
}))

app.listen(config.port, () => {
  console.log(`app listening on port ${config.port}!`)
})
