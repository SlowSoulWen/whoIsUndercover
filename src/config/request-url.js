// 服务端请求路径配置
import { CONFIG } from './setting'

const REQUEST_URL = {}

// 登录相关
REQUEST_URL['user-signin'] = '/user/signin'
REQUEST_URL['user-logout'] = '/user/signout'
REQUEST_URL['check-login'] = '/checkLogin'
REQUEST_URL['register'] = '/register'

// 房间相关
REQUEST_URL['create-room'] = '/createRoom'
REQUEST_URL['get-room-detail'] = '/getRoomDetail'
REQUEST_URL['get-rooms-list'] = '/getRoomsList'
REQUEST_URL['join-room'] = '/joinRoom'
REQUEST_URL['search-room'] = '/searchRoom'

// 游戏相关
REQUEST_URL['create-game'] = '/createGame'
REQUEST_URL['get-game-detail'] = '/getGameDetail'
REQUEST_URL['update-record'] = '/updateRecord'
REQUEST_URL['get-keyword'] = '/keyWord'

let requestUrl = REQUEST_URL
for (let key in REQUEST_URL) {
  requestUrl[key] = CONFIG.apiPath + REQUEST_URL[key]
}

export { requestUrl }
