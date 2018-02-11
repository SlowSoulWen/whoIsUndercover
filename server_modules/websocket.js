function websocket (io) {
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
    // 当有请求连接时，获取参数roomId并连接到具体的房间
    let _roomId = socket.handshake.query.roomId
    ROOMS.join(_roomId)

    // 玩家在房间发言
    socket.on('message', (data) => {
      ROOMS.emit('message', data)
    })
    // 有玩家加入房间
    socket.on('join', (data) => {
      ROOMS.emit('join', data)
    })
    // 有玩家离开房间
    socket.on('disconnect', (data) => {
      ROOMS.clients((error, clients) => {
        if (error) console.log('clients Error:', error)
        if (!clients.length) {
          // TODO：如果房间没人了，更改房间状态
        }
      })
      // 广播有玩家离开房间
      ROOMS.emit('leave', data)
    })
  })

  // 初始化游戏namespace
  GAMES.on('connection', (socket) => {
    // 玩家发言
    socket.on('message', (data) => {
      // TODO
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
