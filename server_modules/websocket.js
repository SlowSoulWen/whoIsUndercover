function websocket (io) {
  // 游戏大厅
  const center = io.of('/home')
  center.on('connection', (socket) => {
    // 游戏大厅的广播
    socket.on('center broadcast', (data) => {
      center.emit('center broadcast', data)
    })
  })

  const ws = {
    // 新建房间
    createRoom: (id) => {
      try {
        let namespace = `/room-${id}`
        const room = io.of(namespace)
        room.on('connection', (socket) => {
          // 玩家在房间发言
          socket.on('message', (data) => {
            room.emit('message', data)
          })
          // 有玩家加入房间
          socket.on('join', (data) => {
            room.emit('join', data)
          })
          // 有玩家离开房间
          socket.on('disconnect', (data) => {
            room.clients((error, clients) => {
              if (error) console.log('clients Error:', error)
              if (!clients.length) {
                // TODO：如果房间没人了，更改房间状态
              }
            })
            // 广播有玩家离开房间
            room.emit('leave', data)
          })
        })
      } catch (err) {
        console.log('createRoom Err:', err)
        return false
      }
      return true
    },
    // 广播开始游戏
    startGame: (roomId, gameId) => {
      const room = io.of(`/room-${roomId}`)
      room.emit('startGame', {gameId})
    }
  }
  return ws
}

module.exports = websocket
