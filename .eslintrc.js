module.exports = {
  root: true, // 停止在父目录中继续寻找.eslintrc文件
  parser: 'babel-eslint',  //	指定解析器
  parserOptions: {
    sourceType: 'module' // ECMAScript 模块
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard', // 继承基础配置，新配置会覆盖基础配置
  plugins: [
    'html' // required to lint *.vue files
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}