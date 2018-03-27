import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    SET_LOGIN_SUCC (state) {
      state.isLogin = true
    }
  }
})
