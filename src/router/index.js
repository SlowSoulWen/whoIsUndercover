import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './modules/home'

Vue.use(VueRouter)

const routes = Array.prototype.concat.call(home)

const router = new VueRouter({
  routes
})

export default router
