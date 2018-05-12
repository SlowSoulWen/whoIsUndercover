import Vue from 'vue'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

/* eslint-disable */
/**
 * 请求微信JS-SDK授权，调用微信相关接口前必须授权
**/
let wechatConfig = async () => {
  let url = location.href.split('#')[0]
  let res = (await axios({
    url: '/getSignature',
    method: 'post',
    data: {
      url: url
    }
  })).data
  wx.config({
    debug: false,
    appId: res.appId,
    timestamp: res.timestamp,
    nonceStr: res.nonceStr,
    signature: res.signature,
    jsApiList: [
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'closeWindow',
      'chooseImage',
      'getLocalImgData',
      'startRecord',
      'stopRecord',
      'uploadVoice',
      'downloadVoice',
      'playVoice'
    ]
  })
  wx.ready(() => {
    console.log('ready')
  })
  wx.error(() => {
    Vue.$vux.toast.show({
      type: 'text',
      text: '初始化失败，微信相关功能受限'
    })
  })
}

/**
 * 判断当前客户端版本是否支持指定JS接口
 * @param {string} api 接口名
**/
const checkJsApi = (api) => {
  return new Promise((resolve, reject) => {
    wx.checkJsApi({
      jsApiList: [api], // 需要检测的JS接口列表
      success: (res) => {
        let result = res.errMsg.split(':')[1]
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        if (!res.checkResult[api] && result !== 'ok') {
          reject(0)
        }
        resolve(1)
      }
    })
  })
}

/**
 *  微信接口统一调用方法
 *  @param {string} api 要调用的接口名
 *  @param {object} option 接口的相关配置
**/
const callApi = window.callApi = async (api, option = {}) => {
  let status = await checkJsApi(api)
  if (!status) {
    Vue.$vux.toast.show({
      type: 'text',
      text: '微信接口调用失败'
    })
    return
  }
  return new Promise((resolve, reject) => {
    option.success = (res) => {
      console.log('调用成功', res)
      resolve(res)
    }
    option.fail = (err) => {
      Vue.$vux.toast.show({
        type: 'text',
        text: `微信接口调用失败: ${err.errMsg}`
      })
      reject(err)
    }
    wx[api](option)
  })
}

/**
 *  统一初始化分享接口的参数配置
 *  @param {object} option 接口参数配置
**/
let setOption = (option = {}) => {
  let opt = {
    title: '【谁是卧底】' + (option.title ? `${option.title}` : ''),
    desc: option.subTitle,
    link: option.link || window.location.href,
    imgUrl: option.imageUrl || 'http://pic.nipic.com/2007-11-09/2007119122519868_2.jpg',
    type: option.type || 'link',
    dataUrl: option.dataUrl,
    success: option.success,
    cancel: option.cancel
  }
  return opt
}

/**
 * 分享给微信好友
 * @param {object} shareInfo 相关配置
 * {
 *   title:     '分享标题',
 *   subTitle:  '分享描述',
 *   link:      '分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致',
 *   imageUrl:  '分享图标',
 *   type:      '分享类型,music、video或link，不填默认为link',
 *   dataUrl:   '如果type是music或video，则要提供数据链接，默认为空',
 *   success:   '用户确认分享后执行的回调函数',
 *   cancel:    '用户取消分享后执行的回调函数',
 * }
**/
let shareAppMessage = async (shareInfo) => {
  let opt = setOption(shareInfo)
  return await callApi('onMenuShareAppMessage', opt)
}

/**
 * 分享到微信朋友圈
 * @param {object} shareInfo 相关配置
 * {
 *   title:     '分享标题',
 *   link:      '分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致',
 *   imageUrl:  '分享图标',
 *   success:   '用户确认分享后执行的回调函数',
 *   cancel:    '用户取消分享后执行的回调函数',
 * }
**/
let shareTimeline = async (shareInfo) => {
  let opt = setOption(shareInfo)
  return await callApi('onMenuShareTimeline', opt)
}

/**
 * 统一配置分享信息
 * @param {object} shareInfo 相关配置
 * {
 *   title:     '分享标题',
 *   subTitle:  '分享描述',
 *   link:      '分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致',
 *   imageUrl:  '分享图标',
 *   type:      '分享类型,music、video或link，不填默认为link',
 *   dataUrl:   '如果type是music或video，则要提供数据链接，默认为空',
 *   success:   '用户确认分享后执行的回调函数',
 *   cancel:    '用户取消分享后执行的回调函数',
 * }
**/
let shareAll = async (shareInfo) => {
  shareAppMessage(shareInfo)
  shareTimeline(shareInfo)
}

/**
 *  关闭当前网页窗口
**/
const closeWindow = async () => {
  return await callApi('closeWindow')
}

/**
  * 选择照片,返回照片的base64数据
  * @param {object} opt 相关配置
  * {
  *   count: 照片数量,
  *   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  *   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  * }
**/
const chooseImageByBase64 = async (opt) => {
  let localIds = (await callApi('chooseImage', opt)).localIds
  let localData = (await callApi('getLocalImgData', {
    localId: localIds[0]
  })).localData
  return localData
}

/**
 * 开始录音
 **/
const startRecord = async () => {
  callApi('startRecord')
}

/**
 * 停止录音并上传，返回serverId
**/
const stopRecord = async () => {
  let localId = (await callApi('stopRecord')).localId
  return await callApi('uploadVoice', {
    localId,
    isShowProgressTips: 0
  })
}

/**
  * 播放语音
**/
const playVoice = async (localId) => {
  callApi('playVoice', {localId})
}

/**
  * 下载语音 
**/
const downloadVoice = async (serverId) => {
  return await callApi('downloadVoice', {
    serverId,
    isShowProgressTips: 0
  })
}

export {
  wechatConfig,
  shareAll,
  closeWindow,
  chooseImageByBase64,
  startRecord,
  stopRecord,
  playVoice,
  downloadVoice
}
