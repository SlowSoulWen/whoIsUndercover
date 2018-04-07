const User = require('./collections/user')
const Room = require('./collections/room')
const Game = require('./collections/game')
const Util = require('./util')
const middlewares = require('./middlewares')
const bodyParser = require('body-parser')

module.exports = async (app, ws) => {
  let userCollection = await User()
  let roomCollection = await Room()
  let gameCollection = await Game()

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
    if (Util.judgeEmpty(user, emptyMessage, res)) return false
    user.password = Util.encryption(user.password)
    user.id = Util.getRandomNumber(20)
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
    if (Util.judgeEmpty(user, emptyMessage, res)) return false
    let result = await userCollection.$findOneUser({account: user.account})
    middlewares.checkDbData(req, res, result)
    if (!result) {
      res.json({
        errno: 1,
        data: '该账号不存在'
      })
    }
    if (user.password === result.password) {
      // req.session.userId[result.id] = true
      res.cookie('userId', result.id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 48,
      })
      res.json({
        errno: 0,
        data: result
      })
    } else {
      res.json({
        errno: 1,
        data: '密码错误'
      })
    }
  })

  // 获取房间列表
  app.get('/getRoomsList', async (req, res) => {
    const emptyMessage = {
      pageIndex: '页码不能为空',
      pageSize: '每页条数不能为空'
    }
    let query = req.query
    if (Util.judgeEmpty(query, emptyMessage, res)) return false
    let roomsList = await roomCollection.$findRooms({status: 1}, {
      skip: (query.pageIndex - 1) * query.pageSize,
      limit: Number(query.pageSize)
    })
    middlewares.checkDbData(req, res, roomsList)
    res.json({
      errno: 0,
      data: roomsList
    })
  })

  // 创建房间
  app.post('/createRoom', middlewares.checkLogin, async (req, res) => {
    const emptyMessage = {
      roomName: '房间名不能为空',
      playerMaxNum: '游戏人数不能为空'
    }
    let room = req.body
    if (Util.judgeEmpty(room, emptyMessage, res)) return false
    room.playerMaxNum = Number(room.playerMaxNum)
    room.ownerId = ''
    room.id = Util.getRandomNumber(14)
    room.status = 1
    room.player = []
    let result = await roomCollection.$addRoom(room)
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: {
        roomId: room.id
      }
    })
  })

  // 获取房间信息
  app.get('/getRoomDetail', async (req, res) => {
    const emptyMessage = {
      roomId: '房间id不能为空'
    }
    let query = req.query
    if (Util.judgeEmpty(query, emptyMessage, res)) return false
    let result = await roomCollection.$findOneRoom({ 
      id: query.roomId,
      status: 1
    })
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: result
    })
  })

  // 加入房间
  app.post('/joinRoom', middlewares.checkLogin, async (req, res, next) => {
    const emptyMessage = {
      roomId: '房间id不能为空'    
    }
    let query = req.body
    let userId = req.cookies.userId
    if (Util.judgeEmpty(query, emptyMessage, res)) return false
    // ----- 查找对应房间，看相应的房间状态是否符合加入要求 ---- //
    let room = await roomCollection.$findOneRoom({
      id: query.roomId,
      status: 1
    })
    middlewares.checkDbData(req, res, room)
    if (room.player.length === room.playerMaxNum) {
      res.json({
        errno: 1,
        data: '房间人数已满'
      })
      return false
    } else if (room.status === 2) {
      res.josn({
        errno: 1,
        data: '该房间已经开始游戏了'
      })
      return false
    } else if (room.status === 3) {
      res.json({
        errno: 1,
        data: '该房间已经废弃'
      })
      return false
    }
    // ---- 添加房间成员，更改房间状态 ----
    let userMsg = await userCollection.$findOneUser({id: userId})
    userMsg.isReady = false // 给玩家添加一个准备状态
    room.player.push(userMsg)
    if (!room.ownerId) room.ownerId = userId // 如果是第一个进的，将成为房主
    let result = await roomCollection.$updateOneRoom({id: query.roomId}, {
      player: room.player,
      ownerId: room.ownerId
    })
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: 'success'
    })
  })

  // 搜索房间
  app.get('/searchRoom', async (req, res) => {
    const emptyMessage = {
      roomName: '房间名不能为空'
    }
    let query = req.query
    if (Util.judgeEmpty(query, emptyMessage, res)) return false
    let room = await roomCollection.$findOneRoom({ 
      roomName: query.roomName,
      status: 1
    })
    middlewares.checkDbData(req, res, room)
    res.json({
      errno: 0,
      data: room
    })
  })

  // 创建游戏
  app.post('/createGame', middlewares.checkLogin, async (req, res) => {
    const emptyMessage = {
      roomId: '房间id不能为空'
    }
    let params = req.body
    if(Util.judgeEmpty(params, emptyMessage, res)) return false
    let room = await roomCollection.$findOneRoom({ 
      id: params.roomId,
      status: 1
    })
    // 后端判断是否满足游戏开始条件
    if (room.player.length < room.playerMaxNum) {
      res.json({
        errno: 1,
        data: '房间尚未满员'
      })
      return false
    } else if (!room.player.every((player) => {
      return player.id === room.ownerId || player.isReady
    })) {
      res.json({
        errno: 1,
        data: '有玩家尚未准备'
      })
      return false
    }
    // 创建游戏房间
    let game = {}
    game.id = Util.getRandomNumber(10)
    game.roomId = room.id
    game.number = room.playerMaxNum
    game.player = room.player.map((player) => {
      return {
        id: player.id,
        account: player.account,
        nickname: player.nickname,
        isReady: false,
        poll: 0, // 投票数
        isOut: false, // 淘汰标志
        identity: 0 // 身份 0、平民 1、卧底
      }
    })
    // 随机分配1/3玩家为卧底身份
    for (let i = 0; i < Math.floor(game.player.length/3); i++) {
      let index = Math.floor(Math.random() * game.player.length)
      if (game.player[index].identity) {
        i--
        continue
      }
      game.player[index].identity = 1
    }
    game.result = 0
    game.keywrod = ['诸葛亮', '庞统']
    let result = await gameCollection.$newGame(game)
    middlewares.checkDbData(req, res, result)
    res.json({
      errno: 0,
      data: {
        gameId: game.id
      }
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
    if (Util.judgeEmpty(game, emptyMessage, res)) return false
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
