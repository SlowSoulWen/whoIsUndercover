<template>
  <div class="c-chat-prompt">
    <span :class="[type === 1 ? 'success' : 'error']">{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: String,  // 聊天提示信息
    type: {           // 聊天提示类型 1、正常提示 2、出错提示
      type: 'number',
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
  .c-chat-prompt {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;

    & > span {
      display: inline-block;
      padding: 0.1em 0.5em;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.2em; 
      color: #666;
    }
  }
</style>
