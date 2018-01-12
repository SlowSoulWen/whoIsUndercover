const MongoClient = require('mongodb').MongoClient
const Config = require('../config/dev.env')
const DB_URL = Config.DBUrl
const DD_NAME = Config.DBName
let db = ''

async function connection () {
  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(DB_URL)
    db = client.db(DD_NAME)
  } catch (err) {
    console.log(err.stack)
  }
  if (!db) {
    throw new Error('数据库链接出错了')
  }
}

connection()

module.exports = db
