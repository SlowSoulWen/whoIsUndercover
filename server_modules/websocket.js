const WebSocketServer = require('websocket').server

function originIsAllowed (origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

function websocket (server) {
  const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  })

  wsServer.on('request', (request) => {
    if (!originIsAllowed(origin)) {
      // 请求源检查
      request.reject()
    }
  })
}

module.exports = websocket
