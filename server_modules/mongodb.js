import { connect } from 'net';

const MongoClient = require('mongodb').MongoClient
const Config = require('../config/dev.env')
const DB_URL = Config.DBUrl
const DB_NAME = Config.DBName
async function connectDb () {
  let db = null
  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(DB_URL)
    db = client.db(DB_NAME)
  } catch (err) {
    console.log(err.stack)
  }
  if (!db) {
    throw new Error('数据库链接出错了')
  }
  return db
}

module.exports = connectDb
