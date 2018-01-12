const db = require('../mongodb')
db.createCollection('user', {
  ignoreUndefined: true,
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
          minLength: 8,
          maxLength: 20,
          description: '用户密码'
        },
        nickname: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 12,
          description: '用户昵称'
        },
        playing: {
          bsonType: 'boolean',
          description: '用户当前游戏状态: true.游戏中, false.离线中'
        },
        avator: {
          bsonType: 'string',
          description: '用户头像'
        }
      }
    }
  }
})

const user = db.collection('user')
module.exports = user
