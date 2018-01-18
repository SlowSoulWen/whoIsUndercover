function websocket (io) {
  // 游戏大厅
  const center = io.of('/home')
  center.on('connection', (socket) => {
    // 游戏大厅的广播
    socket.on('center broadcast', (data) => {
      center.emit('center broadcast', data)
    })
  })

  const option = {
    // 新建房间
    createRoom: (id) => {
      try {
        let namespace = `/room-${id}`
        const room = io.of(namespace)
        room.on('connection', (socket) => {
          // 玩家发言
          socket.on('message', (data) => {
            room.emit('message', data)
          })
          // 有玩家加入
          socket.on('join', (data) => {
            room.emit('join', data)
          })
          // 有玩家离开
          socket.on('leave', (data) => {
            room.emit('join', data)
          })
        })
      } catch (err) {
        console.log('createRoom Err:', err)
        return false
      }
      return true
    }
  }

  return option
}

module.exports = websocket
