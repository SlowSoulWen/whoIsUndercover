function websocket (io) {
  // 大厅
  io.on('connection', function (socket) {
    socket.on('message from client', function (data) {
      console.log('message from client:', data)
      io.emit('message from server', data)
    })
  })
}

module.exports = websocket
