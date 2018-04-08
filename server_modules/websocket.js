const User = require('./collections/user')
const Room = require('./collections/room')
const Game = require('./collections/game')

async function websocket (io) {
  const roomCollection = await Room()
  const gameCollection = await Game()

  // namespaces
  // 游戏大厅
  const HOME = io.of('/home')
  // 房间
  const ROOMS = io.of('/rooms')
  // 游戏
  const GAMES = io.of('/games')

  // 初始化大厅namespace
  HOME.on('connection', (socket) => {
    // 游戏大厅的广播
    socket.on('center broadcast', (data) => {
      HOME.emit('center broadcast', data)
    })
  })

  // 初始化房间namespace
  ROOMS.on('connection', (socket) => {
    let query = socket.handshake.query
    // 当有请求连接时，获取参数roomId并连接到具体的房间
    let _roomId = query.roomId
    let nickName = query.nickName
    let userId = query.userId

    socket.join(_roomId, () => {
      // 当有新玩家进入游戏时，广播通知
      socket.broadcast.to(_roomId).emit('join', { nickName, userId })
    })

    // 玩家在房间发言
    socket.on('message', (data) => {
      ROOMS.to(_roomId).emit('message', {
        message: data.message,
        userId: userId
      })
    })

    // 玩家状态改变
    socket.on('changeReadyStatus', async (data) => {
      // 找到更改状态的玩家，更新数据库
      let room = await roomCollection.$findOneRoom({
        id: _roomId,
        status: 1 
      })
      let index = room.player.findIndex((player) => {
        return player.id === data.userId
      })
      room.player[index].isReady = data.status
      roomCollection.$updateOneRoom({ id: _roomId }, {
        player: room.player
      })
      ROOMS.to(_roomId).emit('changeReadyStatus', room)
    })

    // 有玩家离开房间
    socket.on('disconnect', async (data) => {
      //  更新数据库
      let room = await roomCollection.$findOneRoom({id: _roomId})
      let index = room.player.findIndex((player) => {
        return player.id === userId
      })
      room.player.splice(index, 1)
      if (room.ownerId === userId && room.player.length) {
        // 如果房主离开， 变更房主
        room.ownerId = room.player[0].id
      }
      roomCollection.$updateOneRoom({ id: _roomId }, {
        player: room.player,
        ownerId: room.ownerId
      })
      socket.broadcast.to(_roomId).emit('leave', {
        userId: userId,
        roomDetail: room
      })
      ROOMS.clients(async (error, clients) => {
        if (error) console.log('clients Error:', error)
        if (!clients.length) {
          // 如果房间没人了，且不是游戏中的状态，将房间废弃
          let room = await roomCollection.$findOneRoom({id: _roomId})
          if (room.status === 2) return
          roomCollection.$updateOneRoom({ id: _roomId }, {
            status: 3
          })
        }
      })
    })

    // 房主开始游戏
    socket.on('joinGame', async (data) => {
      let room = await roomCollection.$updateOneRoom({
        id: _roomId
      }, {
        status: 2
      })
      ROOMS.to(_roomId).emit('joinGame', data)
    })
  })

  // 初始化游戏namespace
  GAMES.on('connection', (socket) => {
    let query = socket.handshake.query
    let _userId = query.userId
    let _gameId = query.gameId
    let _nickName = query.nickName
    let gamer = []
    let rounds = 0 // 回合数
    let currentSpeakGamer = 0 // 当前发言的玩家
    let time = 90
    
    // 玩家准备
    socket.on('ready', async (data) => {
      let game = await gameCollection.$findOneGame({ id: _gameId })
      let allReady = true
      game.player.forEach((player) => {
        if (player.id === _userId) player.isReady = true
        if (!player.isReady) allReady = false
      })
      gamer = game.player
      gameCollection.$updateOneGame({ id: _gameId }, {
        player: gamer
      })
      // 如果所有玩家都准备完毕
      if (allReady) {
        GAMES.to(_gameId).emit('newRound', { rounds: ++rounds })
        GAMES.to(_gameId).emit('speak', {
          userId: gamer[currentSpeakGamer].id,
          time
        })
      }
    })

    // 玩家停止发言
    socket.on('stopSpeak', () => {
      let userId = null
      for (let i = currentSpeakGamer + 1; i < gamer.length; i++) {
        if (!gamer[i].isOut) {
          currentSpeakGamer = i
          userId = gamer[i].id
          break
        }
      }
      if (!userId) {
        // userId为null说明所有玩家已经发言完毕，该轮发言已经结束
        // 发起投票环节
        GAMES.to(_gameId).emit('vote')
        return
      }
      GAMES.to(_gameId).emit('speak', {
        userId,
        time
      })
    })

    // 玩家发言
    socket.on('message', (data) => {
      GAMES.to(_roomId).emit('message', {
        message: data.message,
        userId: userId
      })
    })
    // 玩家离开
    socket.on('disconnect', (data) => {
      // TODO 玩家离开游戏，即认定为出局
    })
  })

  // methods
  const ws = {
    // 广播开始游戏
    startGame: (roomId, gameId) => {
      const room = io.of(`/room-${roomId}`)
      room.emit('startGame', {gameId})
    }
  }
  return ws
}

module.exports = websocket
