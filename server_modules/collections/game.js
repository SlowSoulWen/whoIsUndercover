const db = require('../mongodb')

module.export = async function () {
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
  game.$createIndexes = async () => {
    await this.createIndexes([
      {
        key: {id: 1},
        unique: true,
        background: true,
        name: '_id'
      }
    ])
  }
  game.$newGame = async (game) => {
    await this.$createIndexes()
    const ErrMessage = {
      _id: '游戏id重复'
    }
    try {
      await this.insertOne(game)
    } catch (err) {
      console.log('addGame Error：', err)
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
