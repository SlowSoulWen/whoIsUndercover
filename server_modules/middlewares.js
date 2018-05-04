const User = require('./collections/user')
let userCollection = null

async function a () {
  userCollection = await User()
}

a()

module.exports = {
  /**
   * 检查登录状态中间件
  **/
  checkLogin: async (req, res, next) => {
    let userId = req.cookies.userId
    let user = null
    if (userId) user = await userCollection.$findOneUser({ id: userId })
    if (!user) {
      res.json({
        errno: 1,
        data: '尚未登录'
      })
    }
    next()
  },
  /**
   * 数据库查询结果错误检查
  **/
  checkDbData: (req, res, result, next) => {
    if (result && result.error) {
      res.json({
        errno: 1,
        data: result.errMessage
      })
      typeof next === 'function' && next()
    }
  }
}
