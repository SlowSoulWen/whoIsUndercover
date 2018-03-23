<template>
  <x-img :class='{"b-lazy":isLazy}' :src="srcPath" error-class="error-avatar" :container="container" :scroller="scroller" :offset='9999' />
</template>

<script>
  import { XImg } from 'vux'

  export default {
    props: {
      src: [String, Object],
      container: String,
      scroller: String,
      isLazy: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      srcPath () {
        return this.src || require('@src/assets/default_avatar.png')
      }
    },
    components: {
      XImg
    }
  }
</script>

<style lang="less" scoped>
  .error-avatar {
    background:url('~@src/assets/default_avatar.png') center center no-repeat;
    background-size: 100% 100%;
  }
</style>

