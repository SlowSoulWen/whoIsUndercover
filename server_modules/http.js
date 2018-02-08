const User = require('./collections/user')
const Room = require('./collections/room')
const Util = require('./util')
const middlewares = require('./middlewares')
const bodyParser = require('body-parser')

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  //  注册账号接口
  app.post('/user/register', async (req, res) => {
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
    user.password = Util.encryption(user.password)
    user.id = Util.getRandomNumber(20)
    let userCollection = await User()
    let result = await userCollection.$addUser(user)
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0
    })
  })

  // 登录接口
  app.post('/user/signin', async (req, res, next) => {
    const emptyMessage = {
      account: '账号不能为空',
      password: '密码不能为空'
    }
    let user = req.body
    let hasEmptyMes = Util.judgeEmpty(user, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let userCollection = await User()
    let result = await userCollection.$findOneUser({account: user.account})
    middlewares.checkDbData(req, res, result)
    if (!result) {
      res.json({
        errno: 1,
        data: '该账号不存在'
      })
    }
    if (Util.encryption(user.password) === result.password) {
      req.session.userId = result.id
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

  // 创建房间
  app.post('/createRoom', middlewares.checkLogin, async (req, res) => {
    const emptyMessage = {
      roomName: '房间名不能为空',
      playerMaxNum: '游戏人数不能为空'
    }
    let room = req.body
    let hasEmptyMes = Util.judgeEmpty(room, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    room.ownerId = req.session.userId
    room.id = Util.getRandomNumber(20)
    room.status = 1
    room.player = [].push(room.ownerId)
    let roomCollection = await Room()
    let result = await roomCollection.$addUser(room)
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: room
    })
  })

  // 获取房间数据
  app.get('/getRoomById', async (req, res) => {
    const roomId = req.body.id
    if (!roomId) {
      res.json({
        errno: 1,
        data: '房间id不能为空'
      })
    }
    let roomCollection = await Room()
    let result = await roomCollection.$findOneRoom({ id: roomId })
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: result
    })
  })
}
