<template>
  <div id="home-index">
    <div class="content-view">
      <router-view></router-view>
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
  import cFooter from '@common/c-footer-tabbar'
  export default {
    components: {
      cFooter
    }
  }
</script>

<style lang="less" scoped>
  #home-index {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .content-view {
      flex: 1;
      position: relative;
    }
  }
</style>