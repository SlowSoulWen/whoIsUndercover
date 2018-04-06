const connectDb = require('../mongodb')

module.exports = async () => {
  const db = await connectDb()

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
  room.$createIndexes = async function () {
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
      }
    ])
  }
  room.$addRoom = async function (room) {
    await this.$createIndexes()
    const ErrMessage = {
      _id: '房间id重复'
    }
    // 检查是否有重名的房间
    let hasSameNameRoom = await this.find({
      roomName: room.roomName
    }).toArray()
    // 如果有且尚未逻辑删除
    if (hasSameNameRoom.length) {
      let index = hasSameNameRoom.findIndex((room) => {
        return room.status !== 3
      })
      if (index !== -1) {
        return {
          error: 1,
          errMessage: '房间名已存在'
        }
      }
    }
    try {
      await this.insertOne(room)
    } catch (err) {
      let res = {error: 1, errMessage: ''}
      if (err.message) {
        for (let [key, value] of Object.entries(ErrMessage)) {
          if (err.message.match(key)) {
            res.errMessage = value
          }
        }
      }
      if (!res.errMessage) res.errMessage = err.message
      return res
    }
    return {
      error: 0
    }
  }
  room.$findOneRoom = async function (query) {
    let res = null
    try {
      res = await this.findOne(query)
    } catch (err) {
      console.error('findOneRoom Error:', err.message)
      res = {
        error: 1,
        errMessage: err.message
      }
    }
    return res
  }
  room.$updateOneRoom = async function (query, content) {
    let res = null
    try {
      res = await this.updateOne(query, {$set: content})
    } catch (err) {
      console.error('updateOneRoom Error:', err.message)
      res = {
        error: 1,
        errMessage: err.message
      }
    }
    return res
  }
  room.$findRooms = async function (query, {skip = 0, limit = 100}) {
    let res = null
    try {
      res = await this.find(query).skip(skip).limit(limit).toArray()
    } catch (err) {
      console.error('findRooms Error', err)
      res = {
        error: 1,
        errMessage: err.message
      }
    }
    return res
  }  
  return room
}
