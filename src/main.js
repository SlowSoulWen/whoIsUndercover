import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import store from './store/index'
import App from './app.vue'
import errorPage from '@src/components/error/error-page.vue'
import './config/rem'
import { LoadingPlugin, AlertPlugin, ToastPlugin, ConfirmPlugin } from 'vux'
import { userModel } from './config/request-map'
import Scroller from 'vue-scroller'

Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Scroller)

// 解决移动端点击延迟
FastClick.attach(document.body)
// 关闭Vue生产模式下给出的提示
Vue.config.productionTip = false

/* eslint-disable no-new */
userModel.getUserInfo().then((res) => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app_box')
  if (!res.errno) {
    store._mutations['User/storeUserDetail'][0](res.data)
  }
}).catch((e) => {
  new Vue({
    render: h => h(errorPage),
    store
  }).$mount('#app_box')
}).then(() => {
  Vue.$vux.loading.hide()
})
