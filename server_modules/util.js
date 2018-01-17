const crypto = require('crypto')

module.exports = {
  /**
   * 判断空值
   * @param {Object} obj 要判空的对象
   * @param {Object} emptyMes {key(要判空的字段): value(出错信息)}
   * */
  judgeEmpty: (obj, emptyMes) => {
    let keys = Object.keys(emptyMes)
    let current = keys.find(element => {
      return !obj[element]
    })
    return current ? emptyMes[current] : null
  },
  /**
   * 密码加密
   * @param {String} pwd 要加密的原始密码
  **/
  encryption: (pwd) => {
    let md5 = crypto.createHash('md5')
    return md5.update(pwd).digest('base64')
  }
}
