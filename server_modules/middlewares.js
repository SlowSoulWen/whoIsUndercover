module.exports = {
  /**
   * 检查登录状态中间件
  **/
  checkLogin: (req, res, next) => {
    if (!req.session.userId) {
      res.status(401).json({
        errno: 1,
        data: '未登录'
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
        data: result.errMesage
      })
      typeof next === 'function' && next()
    }
  }
}
