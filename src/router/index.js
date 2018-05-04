import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './modules/home'
import room from './modules/room'
import game from './modules/game'
import login from './modules/login'

Vue.use(VueRouter)

const routes = Array.prototype.concat.call(
  home,
  room,
  game,
  login
)

const router = new VueRouter({
  routes
})

export default router
