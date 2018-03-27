import Vue from 'vue'
import { AjaxPlugin, ToastPlugin, LoadingPlugin, AlertPlugin } from 'vux'
import { requestUrl } from '../config/request-url'
import querystring from 'querystring'

Vue.use(AjaxPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)

/* eslint-disable */
const service = Vue.http.create({
  timeout: 8000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  if (!config.withoutLoading) {
    Vue.$vux.loading.show()
  }
  // 对url进行格式化
  config.url = getURL(config.url)
  // post的时候对json进行transform
  if (config.method === 'post' && config.headers['Content-Type'] === undefined) {
    config.transformRequest = [function (data) {
      return querystring.stringify(data)
    }]
  }
  return config
}, (error) => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
(response) => {
  const res = response
  Vue.$vux.loading.hide()
  if (res.status !== 200) {
    if (res.status === 500 || res.status === 403 || res.status === 400) {
      Vue.$vux.toast.show(res.message)
    }
    return Promise.reject()
  } else {
    if (res.data.code) {
      res.data.code === 403 && window.location.reload()
      res.data.code === 500 && window.history.back()
    }
    return res
  }
}, (error) => {
  let res = error.response
  if (!res) {
    Vue.$vux.toast.show({
      text: '网络错误:' + error,
      type: 'text',
      onHide () {
        // window.location.reload()
      }
    })
  }
  if (res && res.data.status === 403) {
    Vue.$vux.toast.show({
      text: '登陆已失效',
      type: 'text',
      onHide () {
        window.location.reload()
      }
    })
  }
  if (res && res.data.status === 500) {
    Vue.$vux.alert.show({
      title: '系统错误',
      content: res.data.message,
      onHide () {
        window.history.back()
      }
    })
  }
  Vue.$vux.loading.hide()
  return Promise.reject(error)
})

function getURL (urlSet) {
  let url = ''
  if (urlSet) {
    // 如果urlSet为对象
    if (typeof urlSet === 'object') {
      // 获取url地址
      url = requestUrl[urlSet.path]
      delete urlSet.path
      // 替换url中的对应字符串
      let keys = Object.keys(urlSet)
      keys.forEach(function (key) {
        if (urlSet[key] === undefined || urlSet[key] === null) {
          return
        }
        url = url.replace('{' + key + '}', urlSet[key].toString())
      })
    } else if (typeof urlSet === 'string' && urlSet.indexOf('http') < 0) {
      // 如果urlSet为字符串则说明没有需要替换的字符串
      url = requestUrl[urlSet]
    } else {
      url = urlSet
    }
  }
  return url
}

export default service
