import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import store from './vuex/index'
import App from './app.vue'
import './config/rem'
import { LoadingPlugin, AlertPlugin, ToastPlugin } from 'vux'
import Scroller from 'vue-scroller'

Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Scroller)
// 解决移动端点击延迟
FastClick.attach(document.body)
// 关闭Vue生产模式下给出的提示
Vue.config.productionTip = false

Vue.$vux.loading.show()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
