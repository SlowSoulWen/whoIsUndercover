const user = {
  namespaced: true,
  state: {
    id: '', // 用户id
    account: '', // 用户账号
    avator: '', // 用户头像
    nickname: '', // 用户昵称
    status: 0, // 用户状态, 0、在线 1、等待中 2、游戏中 3、离线
    winCount: 0, // 胜场数
    failCount: 0, // 败场数
    record: [] // 游戏记录
  },
  mutations: {
    storeUserDetail (state, data) {
      state.id = data.id
      state.account = data.account
      state.avator = data.avator
      state.nickname = data.nickname
      state.status = data.playing
      state.winCount = data.winCount
      state.failCount = data.failCount
      state.record = data.record
    }
  }
}

export default user
