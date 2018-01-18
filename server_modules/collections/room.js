const db = require('../mongodb')

module.exports = async () => {
  db.createCollection('room', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [ 'id', 'ownerId', 'playerMaxNum', 'roomName', 'status', 'player' ],
        properties: {
          id: {
            bsonType: 'string',
            description: '房间Id号'
          },
          ownerId: {
            bsonType: 'string',
            description: '房主Id'
          },
          roomName: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 15,
            description: '房间名'
          },
          // roomChat: {
          //   bsonType: 'array',
          //   description: '房间聊天记录'
          // },
          player: {
            bsonType: 'array',
            description: '玩家列表'
          },
          playerMaxNum: {
            bsonType: 'number',
            description: '游戏人数'
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
  room.$createIndexes = async () => {
    await this.createIndexes([
      {
        key: {id: 1},
        unique: true,
        background: true,
        name: '_id'
      },
      {
        key: {ownerId: 1},
        name: '_ownerId'
      },
      {
        key: {roomName: 1},
        unique: true,
        background: true,
        name: '_roomName'
      }
    ])
  }
  room.$addRoom = async (room) => {
    await this.$createIndexes()
    const ErrMessage = {
      _id: '房间id重复',
      _roomName: '房间名已存在'
    }
    try {
      await this.insertOne(room)
    } catch (err) {
      console.log('新增房间出错：', err)
      let res = {error: 1, errMesage: ''}
      if (err.message) {
        for (let [key, value] of Object.entries(ErrMessage)) {
          if (err.message.match(key)) {
            res.errMesage = value
          }
        }
      }
      if (!res.errMesage) res.errMesage = err.message
      return res
    }
    return {
      error: 0
    }
  }
}
