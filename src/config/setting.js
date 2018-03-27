// ENVIRONMENT 当前开发环境（DEV/PRO) 基于开发环境层面的一个配置项
// 开发环境
let ENVIRONMENT = 'DEV'
switch (process.env.NODE_ENV) {
  case 'development': {
    ENVIRONMENT = 'DEV'
    break
  }
  case 'production': {
    ENVIRONMENT = 'PRO'
    break
  }
}

const CONFIG = {
  originPath: '',
  apiPath: '',
  isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

// 默认列表页每页显示条目数
const PAGE_SIZE_DEFAULT = 10

export {
  ENVIRONMENT,
  CONFIG,
  PAGE_SIZE_DEFAULT
}
