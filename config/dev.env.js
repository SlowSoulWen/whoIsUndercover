module.exports = {
  port: 8888,
  DBUrl: 'mongodb://localhost:27017',
  DBName: 'whoIsUndercover',
  session: {
    secret: 'whoIsUndercover',
    key: 'whoIsUndercover',
    maxAge: 2592000000
  }
}
