import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    isLogin: false
  },
  mutations: {
    SET_LOGIN_SUCC (state) {
      state.isLogin = true
    }
  },
  modules: {
    User
  }
})
