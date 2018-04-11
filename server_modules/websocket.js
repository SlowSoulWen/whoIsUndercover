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
      roomCollection.$updateOneRoom({
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
    let _roomId = query.roomId
    let _userId = query.userId
    let _gameId = query.gameId
    let _nickName = query.nickName
    let _time = 90

    socket.join(_gameId, () => {})
    
    // 玩家准备
    socket.on('ready', async (data) => {
      let game = await gameCollection.$findOneGame({ id: _gameId })
      let allReady = true
      game.player.forEach((player) => {
        if (player.id === _userId) player.isReady = true
        if (!player.isReady) allReady = false
      })
      gameCollection.$updateOneGame({ id: _gameId }, {
        player: game.player
      })
      // 如果所有玩家都准备完毕
      if (allReady) {
        GAMES.to(_gameId).emit('newRound')
        GAMES.to(_gameId).emit('speak', {
          userId: game.player[0].id,
          time: _time
        })
      }
    })

    // 玩家停止发言
    socket.on('stopSpeak', async () => {
      let userId = null
      let game = await gameCollection.$findOneGame({ id: _gameId })
      let players = game.player
      let index = players.findIndex((player) => {
        return player.id === _userId
      })
      for (let i = index + 1; i < players.length; i++) {
        if (!players[i].isOut) {
          userId = players[i].id
          break
        }
      }
      if (!userId) {
        // userId为null说明所有玩家已经发言完毕，该轮发言已经结束
        // 发起投票环节
        GAMES.to(_gameId).emit('vote', {
          time: _time
        })
        return
      }
      GAMES.to(_gameId).emit('speak', {
        userId,
        time: _time
      })
    })

    // 玩家发言
    socket.on('message', (data) => {
      GAMES.to(_gameId).emit('message', {
        message: data.message,
        userId: _userId
      })
    })

    // 玩家投票
    socket.on('vote', async (data) => {
      let voteId = data.userId
      let game = await gameCollection.$findOneGame({ id: _gameId })
      let players = game.player
      let noOutNum = 0 // 剩余玩家数量
      let allVoted = true
      let maxPollPlayer = {
        polls: -1,
        index: -1,
        userId: '',
        identity: -1
      }
      let hasSame = false // 是否有不止一个最高票
      players.forEach((player, index) => {
        if (player.isOut) return
        noOutNum++
        if (player.id === _userId) player.isVoted = true
        if (player.id === voteId) player.poll++
        if (!player.isVoted) allVoted = false
        if (player.poll > maxPollPlayer.polls) {
          hasSame = false
          maxPollPlayer.polls = player.poll
          maxPollPlayer.index = index
          maxPollPlayer.userId = player.id
          maxPollPlayer.identity = player.identity
        } else if (player.poll === maxPollPlayer.polls) {
          hasSame = true
        }
      })
      if (allVoted) { // 如果所有玩家都投票完毕，计算投票结果
        if (hasSame) { // 1、最高票有重复，本轮投票不淘汰玩家
          GAMES.to(_gameId).emit('out', {})
        } else { // 2、淘汰最高票玩家，检查游戏是否结束
          players[maxPollPlayer.index].isOut = true
          GAMES.to(_gameId).emit('out', {
            userId: maxPollPlayer.userId,
            identity: maxPollPlayer.identity
          })
          let hasUndercover = players.some((player) => {
            return !player.isOut && player.identity === 1
          })
          if (!hasUndercover) { // 卧底全部被淘汰，平民胜利
            GAMES.to(_gameId).emit('gameOver', {
              winer: 0, // 0、平民胜利 1、卧底胜利
              keywrod: game.keywrod
            })
            gameCollection.$updateOneGame({ id: _gameId }, { result: 0 })
            roomCollection.$findOneRoom({ id: _roomId }, { status: 1 })
            return
          } else {
            if (noOutNum <= 3) { // 卧底撑到最后三人，卧底胜利
              GAMES.to(_gameId).emit('gameOver', {
                winer: 1, // 0、平民胜利 1、卧底胜利
                keywrod: game.keywrod
              })
              gameCollection.$updateOneGame({ id: _gameId }, { result: 1 })
              roomCollection.$findOneRoom({ id: _roomId }, { status: 1 })
              return
            }
          }
        }
        players.forEach((player) => { // 该轮投票结束，重置玩家状态
          if (player.isOut) return
          player.isVoted = false
          player.poll = 0
        })

        // 进行下一轮发言
        let index = players.findIndex((player) => {
          return !player.isOut
        })
        GAMES.to(_gameId).emit('newRound')
        GAMES.to(_gameId).emit('speak', {
          userId: players[index].id,
          time: _time
        })
      }

      gameCollection.$updateOneGame({ id: _gameId }, {
        player: players
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
