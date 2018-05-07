const connectDb = require('../mongodb')

module.exports = async () => {
  const db = await connectDb()

  db.createCollection('key', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        properties: {
          keyWord: {
            bsonType: 'array',
            description: '关键字'
          }
        }
      }
    }
  })

  const key = db.collection('key')
  key.$randomOneKeyWord = async function () {
    let keys = await this.find({}).toArray()
    let count = keys.length
    let rint = Math.floor((count - 1) * Math.random())
    let keyRes = keys[rint]
    return keyRes
  }

  return key
}
