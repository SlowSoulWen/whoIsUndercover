import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './modules/home'
import room from './modules/room'

Vue.use(VueRouter)

const routes = Array.prototype.concat.call(
  home,
  room
)

const router = new VueRouter({
  routes
})

export default router
