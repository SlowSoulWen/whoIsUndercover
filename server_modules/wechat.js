/*
 *  处理微信授权的相关流程
*/
const axios = require('axios')
const crypto = require('crypto')

const APPID = 'wx3ded421b0ed63e02'
const APPSECRET = 'e41e2a8cc9a93cfa2e587661bd51b17e'
var ACCESSTOKEN = ''
var JSAPITICKET = ''
//  TIME 记录上次请求授权的时间，未超过2h则返回之前的请求结果，控制请求频率
var TIME = ''
//  获取 access_token
function getAccessToken () {
  return axios({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid: APPID,
      secret: APPSECRET
    }
  })
}
//  获取 jsapi_ticket
function getJsapiTicket () {
  return axios({
    url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    params: {
      type: 'jsapi',
      access_token: ACCESSTOKEN
    }
  })
}
// sha1加密
function sha1 (str) {
  let shasum = crypto.createHash('sha1')
  shasum.update(str)
  str = shasum.digest('hex')
  return str
}
/**
 * 对参数对象进行字典排序
 * @param {对象} args 签名所需参数对象
 * @return {字符串}  排序后生成字符串
*/
function raw (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })
  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}
/**
 * 生成签名的时间戳
 * @return {字符串}
*/
function createTimestamp () {
  return parseInt(new Date().getTime() / 1000) + ''
}
/**
  * 生成签名的随机串
  * @return {字符串}
*/
function createNonceStr () {
  return Math.random().toString(36).substr(2, 15)
}

module.exports = function (app) {
  // 微信验证开发者服务器
  // app.get('/oauthResponse', function (request, response, next) {
  //   console.log('有人进来了！')
  //   let data = request.body
  //   console.log(data)
  //   response.json(data.echostr)
  // })

  // 获取 JS-SDK 权限
  app.post('/getSignature', function (request, response, next) {
    let url = request.body.url
    if (TIME && JSAPITICKET && ((new Date()).getTime() - TIME) < 7200000) {
      let ret = {
        jsapi_ticket: JSAPITICKET,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
      }
      let str = raw(ret)
      ret.signature = sha1(str)
      ret.appId = APPID
      response.json(ret)
      return
    }
    console.log('请求了一次SDK权限接口')
    getAccessToken()
      .then((res) => {
        ACCESSTOKEN = res.data.access_token
        return getJsapiTicket()
      })
      .then((res) => {
        JSAPITICKET = res.data.ticket
        TIME = (new Date()).getTime()
        let ret = {
          jsapi_ticket: JSAPITICKET,
          nonceStr: createNonceStr(),
          timestamp: createTimestamp(),
          url: url
        }
        let str = raw(ret)
        ret.signature = sha1(str)
        ret.appId = APPID
        response.json(ret)
      })
      .catch((err) => {
        console.error('获取 JS-SDK 权限出错：', err)
        next()
      })
  })
}
