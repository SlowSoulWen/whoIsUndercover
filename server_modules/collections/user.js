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
const option = {
  unique: true,
  background: true
}
user.$createIndexes = async () => {
  await user.createIndexes([
    {
      key: {id: 1},
      option
    },
    {
      key: {account: 1},
      option
    },
    {
      key: {nickname: 1},
      option
    }
  ])
}
user.$addUser = async (user) => {
  const ErrMessage = {
    id_1: '用户Id有重复',
    account_1: '该账号已存在',
    nickname_1: '该昵称已存在'
  }
  try {
    await user.insertOne(user)
  } catch (err) {
    console.log('新增用户出错: ', err)
    let res = {error: 1, errMesage: ''}
    if (err.message) {
      for (let [key, value] of Object.entries(ErrMessage)) {
        if (key.test(err.message)) {
          res.errMesage = value
          return res
        }
      }
    }
    res.errMesage = err
    return res
  }
  return {
    error: 0
  }
}

user.$findOneUser = async (user) => {
  let res = ''
  try {
    res = await user.findOne(user)
  } catch (err) {
    console.log('user.$signin Error:', err)
    res = {
      error: 1,
      errMessage: err
    }
  }
  return res
}
module.exports = user
