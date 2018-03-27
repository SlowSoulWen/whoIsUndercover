// 服务端请求路径配置
import { CONFIG } from './setting'

const REQUEST_URL = {}

// 登录相关
REQUEST_URL['user-signin'] = '/user/signin'
REQUEST_URL['user-logout'] = '/user/signout'

let requestUrl = REQUEST_URL
for (let key in REQUEST_URL) {
  requestUrl[key] = CONFIG.apiPath + REQUEST_URL[key]
}

export { requestUrl }
