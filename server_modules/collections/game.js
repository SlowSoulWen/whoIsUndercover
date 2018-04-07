const connectDb = require('../mongodb')

module.exports = async () => {
  const db = await connectDb()

  db.createCollection('game', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [ 'id', 'roomId', 'player', 'keywrod', 'result', 'number' ],
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
          number: {
            bsonType: 'number',
            description: '玩家人数'
          },
          result: {
            enum: [ 0, 1, 2 ],
            description: '游戏结果: 0.无结果 1.平民胜利, 2.卧底胜利'
          }
        }
      }
    }
  })
  const game = db.collection('game')
  game.$createIndexes = async function () {
    await this.createIndexes([
      {
        key: {id: 1},
        unique: true,
        background: true,
        name: '_id'
      }
    ])
  }
  game.$newGame = async function (game) {
    await this.$createIndexes()
    const ErrMessage = {
      _id: '游戏id重复'
    }
    try {
      await this.insertOne(game)
    } catch (err) {
      console.log('addGame Error：', err)
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
  game.$findGame = async function (query) {
    let res = null
    try {
      res = await this.findOne(query)
    } catch (err) {
      console.error('findGame Error', err)
      res = {
        error: 1,
        errMessage: err.message
      }
    }
    return res
  }
  game.$updateGame = async function (query, content) {
    let res = null
    try {
      res = await this.updateOne(query, {$set: content})
    } catch (err) {
      console.error('updateGame Error', err)
      res = {
        error: 1,
        errMessage: err
      }
    }
    return res
  }
  return game
}
