<template>
  <div class="c-chat-prompt">
    <span :class="[type === 1 ? 'success' : 'error']">{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: String, // 系统提示信息
    type: { // 系统提示类型 1、正常提示 2、出错提示
      type: Number,
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
      padding: 0 5px;
      background: rgba(0,0,0, 0.3);
      border-radius: 0.3em;
      color: #fff;
      line-height: 30px;
    }
  }
</style>
