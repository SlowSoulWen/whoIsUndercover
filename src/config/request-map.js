import $http from '@src/utility/fetch'
// import querystring from 'querystring'
import { ENVIRONMENT, PAGE_SIZE_DEFAULT } from '@src/config/setting'

let accounts = [
  {
    account: 'wenguang',
    password: '123'
  },
  {
    account: 'wenguang1',
    password: '123'
  },
  {
    account: 'wenguang2',
    password: '123'
  },
  {
    account: 'wenguang3',
    password: '123'
  }
]

/* eslint-disable */

// 登录注册模块

let devLogin = async () => {
  let random = Math.floor(Math.random() * 4)
  let account = accounts[random]
  return await $http({
    method: 'post',
    url: {
      path: 'user-signin'
    },
    data: {
      account: account.account,
      password: account.password
    }
  }).then((res) => {
    return res.data
  })
}

let login = async ({account, password}) => {
  return await $http({
    method: 'post',
    url: {
      path: 'user-signin'
    },
    data: {
      password,
      account
    }
  })
}

let checkLogin = async () => {
  return await $http({
    method: 'post',
    url: {
      path: 'check-login'
    }
  })
}

let getUserInfo = async () => {
  if (ENVIRONMENT === 'DEV') {
    // 测试环境通过模拟账号登录
    let res = await checkLogin()
    return res.data
  } else if (ENVIRONMENT === 'PRO') {
    // TODO
  }
}

let register = async ({account, nickname, password, avator}) => {
  return await $http({
    method: 'post',
    url: {
      path: 'register'
    },
    data: {
      account,
      nickname,
      password,
      avator
    }
  })
}

export const userModel = {
  getUserInfo,
  register,
  login
}

// 房间模块

let createRoom = async (room) => {
  return await $http({
    method: 'post',
    url: {
      path: 'create-room'
    },
    data: {
      roomName: room.roomName,
      playerMaxNum: room.playerMaxNum,
      roomPwd: room.roomPwd
    }
  }).then((res) => {
    return res.data
  })
}

let getRoomDeatil = async (id) => {
  return await $http({
    method: 'get',
    url: {
      path: 'get-room-detail'
    },
    params: {
      roomId: id
    }
  })
}

let getRoomsList = async ({ pageIndex, pageSize = PAGE_SIZE_DEFAULT }) => {
  return await $http({
    method: 'get',
    url: {
      path: 'get-rooms-list'
    },
    params: {
      pageIndex,
      pageSize
    }
  })
}

let joinRoom = async (roomId) => {
  return await $http({
    method: 'post',
    url: {
      path: 'join-room'
    },
    data: {
      roomId
    }
  })
}

let searchRoom = async (roomName) => {
  return await $http({
    method: 'get',
    url: {
      path: 'search-room'
    },
    params: {
      roomName
    }
  })
}

export const roomModel = {
  createRoom,
  getRoomDeatil,
  getRoomsList,
  joinRoom,
  searchRoom
}

// 游戏模块
let createGame = async (roomId) => {
  return await $http({
    method: 'post',
    url: {
      path: 'create-game'
    },
    data: {
      roomId
    }
  })
}

let getGameDetail = async ({gameId, userId}) => {
  return await $http({
    method: 'get',
    url: {
      path: 'get-game-detail'
    },
    params: {
      gameId,
      userId
    }
  })
}

let updateRecord = async (record) => {
  return await $http({
    method: 'post',
    url: {
      path: 'update-record'
    },
    data: record
  })
}

let getKeyWord = async () => {
  return await $http({
    method: 'get',
    url: {
      path: 'get-keyword'
    }
  })
}

export const gameModel = {
  createGame,
  getGameDetail,
  updateRecord,
  getKeyWord
}
