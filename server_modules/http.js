const User = require('./collections/user')
const Util = require('./util')
const crypto = require('crypto')

module.exports = (app) => {
  //  注册账号接口
  app.post('/user/register', (req, res) => {
    const emptyMessage = {
      account: '账号不能为空',
      password: '密码不能为空',
      nickname: '昵称不能为空'
    }
    let user = req.body
    let hasEmptyMes = Util.judgeEmpty(user, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let md5 = crypto.createHash('md5')
    user.password = md5.update(user.password).digest('base64')
    let result = User.$addUser(user)
    if (result.error) {
      res.json({
        errno: 1,
        data: result.errMesage
      })
    } else {
      res.json({
        errno: 0
      })
    }
  })

  // 登录接口
  app.post('user/signin', (req, res) => {
    const emptyMessage = {
      account: '账号不能为空',
      password: '密码不能为空'
    }
    let user = req.body
    let hasEmptyMes = Util.judgeEmpty(user, emptyMessage)
    if (!hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let result = User.$findOneUser({account: user.account})
    if (result.error) {
      res.json({
        errno: 1,
        data: result.error
      })
    } else if (!result) {
      res.json({
        errno: 1,
        data: '该账号不存在'
      })
    }
    let md5 = crypto.createHash('md5')
    if (md5.update(req.password).digest('base64') === result.password) {
      res.json({
        errno: 0
      })
    } else {
      res.json({
        errno: 1,
        data: '密码错误'
      })
    }
  })
}
