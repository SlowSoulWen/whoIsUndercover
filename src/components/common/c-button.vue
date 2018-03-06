<template>
  <button class="c-button" :class="[size, isRadius ? 'border-radius' : '']" :type="type" @click="handleClick">{{ text }}</button>
</template>

<script>
  export default {
    props: {
      text: { // 按钮文字
        type: String,
        default: ''
      },
      type: { // 按钮类型
        type: String,
        default: 'button'
      },
      size: { // 按钮大小(可选：lg, md, ms)
        type: String,
        default: 'lg'
      },
      isRadius: { // 是否圆角边框
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleClick (e) {
        this.$emit('onClick', e)
      }
    }
  }
</script>

<style lang="less" scoped>
  .c-button {
    font-size: 1em;
    color: #ffffff;
    background: linear-gradient(to top, #FD6B12, #FE9A5B 80%, #FD6B12);
  }
  .lg {
    padding: 1.8rem 4.8rem;
    font-weight: bold;
  }
  .md {
    padding: 1.5rem 2.8rem;
    font-weight: bold;
  }
  .sm {
    padding: 1rem 2rem;
  }
  .border-radius {
    border-radius: 1em;
    border-style: none;
  }
</style>