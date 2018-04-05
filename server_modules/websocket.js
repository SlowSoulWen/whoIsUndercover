const User = require('./collections/user')
const Room = require('./collections/room')
const Game = require('./collections/game')

async function websocket (io) {
  const roomCollection = await Room()

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

    // 有玩家离开房间
    socket.on('disconnect', async (data) => {
      //  更新数据库
      let room = await roomCollection.$findOneRoom({id: _roomId})
      let player = room.player
      let index = player.findIndex((player) => {
        return player.id === userId
      })
      player.splice(index, 1)
      await roomCollection.$updateOneRoom({ id: _roomId }, {
        player
      })
      socket.broadcast.to(_roomId).emit('leave', {
        userId: userId
      })
      ROOMS.clients((error, clients) => {
        if (error) console.log('clients Error:', error)
        if (!clients.length) {
          // TODO：如果房间没人了，更改房间状态
        }
      })
    })
  })

  // 初始化游戏namespace
  GAMES.on('connection', (socket) => {
    // 玩家发言
    socket.on('message', (data) => {
      // TODO 将玩家发言内容存储到数据库
    })
    // 玩家离开
    socket.on('disconnect', (data) => {
      // TODO
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
