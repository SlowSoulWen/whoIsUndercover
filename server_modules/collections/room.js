const db = require('../mongodb')

db.createCollection('room', {
  ignoreUndefined: true,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [ 'id', 'roomName', 'playerNum', 'status', 'player' ],
      properties: {
        id: {
          bsonType: 'string',
          description: '房间Id号'
        },
        roomChat: {
          bsonType: 'array',
          description: '房间聊天记录'
        },
        player: {
          bsonType: 'array',
          description: '玩家列表'
        },
        status: {
          enum: [ 1, 2, 3 ],
          description: '房间状态: 1.等待中, 2.游戏中, 3.已废弃'
        }
      }
    }
  }
})

const room = db.collection('room')
module.exports = room
