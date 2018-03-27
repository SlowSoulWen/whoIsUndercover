import $http from '@src/utility/fetch'
// import querystring from 'querystring'
import { ENVIRONMENT } from '@src/config/setting'

/* eslint-disable */
let devLogin = async () => {
  return await $http({
    method: 'post',
    url: {
      path: 'user-signin'
    },
    data: {
      account: 'wenguang',
      password: '123456789'
    }
  }).then((res) => {
    console.log('signin-res', res)
    return res.data
  })
}

let getUserInfo = async () => {
  if (ENVIRONMENT === 'DEV') {
    // 测试环境通过模拟账号登录
    await devLogin()
  } else if (ENVIRONMENT === 'PRO') {
    // TODO 正式环境通过微信授权登录
  }
}

export const userModel = {
  getUserInfo
}
