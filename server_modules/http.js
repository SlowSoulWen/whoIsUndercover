const User = require('./collections/user')
const Room = require('./collections/room')
const Game = require('./collections/game')
const Util = require('./util')
const middlewares = require('./middlewares')
const bodyParser = require('body-parser')

module.exports = (app, ws) => {
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

  // 获取房间列表

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
    let result = await roomCollection.$addRoom(room)
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: room
    })
  })

  // 加入房间
  app.post('/joinRoom', middlewares.checkLogin, async (req, res, next) => {
    const emptyMessage = {
      roomId: '房间id不能为空',
      id: '用户id不能为空'
    }
    let user = req.body
    user.id = req.session.userId
    let hasEmptyMes = Util.judgeEmpty(user, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let roomCollection = await Room()
    let query = {id: user.roomId}
    let room = await roomCollection.$findOneRoom(query)
    middlewares.checkDbData(req, res, room)
    room.player.push(user.id)
    let result = await roomCollection.$updateOneRoom(query, {player: room.player})
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: room
    })
  })

  // 获取房间数据
  app.get('/room/:id', middlewares.checkLogin, async (req, res) => {
    const roomId = req.params.id
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

  // 开始游戏
  app.post('/startGame', middlewares.checkLogin, async (req, res, next) => {
    const emptyMessage = {
      roomId: '房间id不能为空',
      keywrod: '游戏关键字不能为空',
      id: '游戏id不能为空'
    }
    const game = req.body
    let gameCollection = await Game()
    let roomCollection = await Room()
    // 获取相应房间信息
    let room = await roomCollection.$findOneRoom({ id: game.roomId })
    middlewares.checkDbData(req, res, room)
    if (room.player.length < room.playerMaxNum) {
      res.json({
        errno: 1,
        data: '玩家数量不足，无法开始'
      })
      next()
    }
    game.player = room.player.map((item) => {
      item.vote = 0 // 投票数
      item.isVoted = false // 是否已投票
      return item
    })
    game.id = Util.getRandomNumber(20)
    game.keywrod = ['诸葛亮', '庞统']
    let hasEmptyMes = Util.judgeEmpty(game, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let result = gameCollection.$newGame(game)
    middlewares.checkDbData(req, res, result)
    ws.startGame(room.id, game.id)
    res.json({
      errno: 0,
      data: game
    })
  })

  // 获取游戏内容
  app.get('/game/:id', middlewares.checkLogin, async (req, res) => {
    let gameId = req.params.id
    let gameCollection = await Game()
    let result = await gameCollection.$findGame({id: gameId})
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: result
    })
  })

  // 游戏投票
  app.post('/vote/:gameId', middlewares.checkLogin, async (req, res, next) => {
    const emptyMessage = {
      gameId: '游戏id不能为空',
      userId: '用户id不能为空',
      voteId: '投票id不能为空'
    }
    let vote = req.body
    vote.gameId = req.params.gameId
    vote.userId = req.session.userId
    let hasEmptyMes = Util.judgeEmpty(vote, emptyMessage)
    if (hasEmptyMes) {
      res.json({
        errno: 1,
        data: hasEmptyMes
      })
    }
    let gameCollection = await Game()
    let game = gameCollection.$findGame({id: vote.gameId})
    middlewares.checkDbData(req, res, game)
    // 获得投票玩家数据，判断是否已投过票
    let player = game.player.find((player) => {
      return player.id === vote.userId
    })
    if (player.isVote) {
      res.json({
        errno: 1,
        data: '已经投过票了'
      })
      next()
    }
    let votePlayer = game.player.find((player) => {
      return player.id === vote.voteId
    })
    // 给投票玩家的isVoted（是否投票）字段置true，被投票玩家的vote字段（票数）加一
    player.isVoted = true
    votePlayer.vote++
    let updateRes = await gameCollection.$updateGame({id: vote.gameId}, {player: game.player})
    middlewares.checkDbData(req, res, updateRes)
    // 如果所有玩家都已投票，则得出投票结果
    let isAllVoted = game.player.every((item) => {
      return item.isVoted
    })
    if (isAllVoted) {
      let outer = null
      game.player.forEach(player => {
        if (!outer) outer = player
        else {
          outer = outer.vote > player.vote ? outer : player
        }
      })
      // 广播淘汰玩家
      ws.broadcastVoteResult(vote.gameId, outer)
    }
  })
}
