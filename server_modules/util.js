module.exports = {
  /**
   * 判断空值
   * @param {Object} obj 要判空的对象
   * @param {Object} emptyMes 包含要判空的规则以及对应的判空信息
   * */
  judgeEmpty: (obj, emptyMes) => {
    let keys = Object.keys(emptyMes)
    let current = keys.find(element => {
      return !obj[element]
    })
    return current ? emptyMes[current] : null
  }
}
