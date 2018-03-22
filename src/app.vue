<template>
  <div id="app">
    <router-view></router-view>
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  export default {
    data () {
      return {
        isLoading: false
      }
    },
    created () {
      let _this = this
      this.$router.beforeEach((to, from, next) => {
        _this.isLoading = true
        next()
      })
      this.$router.afterEach((to) => {
        setTimeout(() => {
          _this.isLoading = false
        }, 200)
      })
    },
    components: {
      Loading
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~@src/styles/base.less';

  #app {
    height: 100%;
    width: 100%;
  }
</style>
 