const connectDb = require('../mongodb')

module.exports = async () => {
  const db = await connectDb()

  db.createCollection('user', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [ 'id', 'account', 'password', 'nickname' ],
        properties: {
          id: {
            bsonType: 'string',
            description: '用户id'
          },
          account: {
            bsonType: 'string',
            maxLength: 20,
            minLength: 6,
            description: '用户账号'
          },
          password: {
            bsonType: 'string',
            description: '用户密码'
          },
          nickname: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 12,
            description: '用户昵称'
          },
          playing: {
            bsonType: 'number',
            description: '用户当前游戏状态: 1.游戏中, 2.离线中'
          },
          avator: {
            bsonType: 'string',
            description: '用户头像'
          },
          record: {
            bsonType: 'Array',
            description: '玩家游戏记录'
          },
          winCount: {
            bsonType: 'number',
            description: '胜场数'
          },
          failCount: {
            bsonType: 'number',
            description: '败场数'
          }
        }
      }
    }
  })
  let user = db.collection('user')
  user.$createIndexes = async function () {
    await this.createIndexes([
      {
        key: {id: 1},
        unique: true,
        background: true,
        name: '_id'
      },
      {
        key: {account: 1},
        unique: true,
        background: true,
        name: '_account'
      },
      {
        key: {nickname: 1},
        unique: true,
        background: true,
        name: '_nickname'
      }
    ])
  }
  user.$addUser = async function (user) {
    await this.$createIndexes()
    const ErrMessage = {
      _id: '用户Id有重复',
      _account: '该账号已存在',
      _nickname: '该昵称已存在'
    }
    try {
      await this.insertOne(user)
    } catch (err) {
      console.log('新增用户出错: ', err.message)
      let res = {error: 1, errMesage: ''}
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
  user.$findOneUser = async function (query) {
    let res = null
    try {
      res = await this.findOne(query)
    } catch (err) {
      console.log('findOneUser Error:', err.message)
      res = {
        error: 1,
        errMessage: err.message
      }
    }
    return res
  }
  return user
}
