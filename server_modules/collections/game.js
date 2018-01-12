const db = require('../mongodb')

db.createCollection('game', {
  ignoreUndefined: true,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [ 'id', 'roomId', 'player', 'keywrod', 'gameResult' ],
      properties: {
        id: {
          bsonType: 'string',
          description: '游戏id'
        },
        roomId: {
          bsonType: 'string',
          description: '对应的房间id'
        },
        player: {
          bsonType: 'array',
          description: '游戏玩家列表'
        },
        keywrod: {
          bsonType: 'array',
          description: '游戏关键字'
        },
        gameResult: {
          enum: [ 1, 2 ],
          description: '游戏结果: 1.平民胜利, 2.卧底胜利'
        },
        gameChat: {
          bsonType: 'array',
          description: '游戏聊天记录'
        }
      }
    }
  }
})

const game = db.collection('game')
module.exports = game
