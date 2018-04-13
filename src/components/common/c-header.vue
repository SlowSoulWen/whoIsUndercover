<template>
  <div class="c-header">
    <svg class="icon" aria-hidden="true" @click="handleBack">
      <use xlink:href="#icon-solid-home"></use>
    </svg>
    <span class="home-name">{{roomName}}</span>
    <span class="home-id">{{ `（id: ${ id }）` }}</span>
  </div>
</template>


<script>
  export default {
    props: {
      roomName: String,
      id: String
    },
    methods: {
      handleBack () {
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要离开房间吗?',
          onConfirm () {
            _this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .c-header {
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: pink;

    .icon {
      font-size: 2rem;
      margin: 0 10px;
      color: #ffffff;
    }

    .home-name {
      font-size: 1.5rem;
      color: #ffffff;
      font-weight: bolder;
    }

    .home-id {
      font-size: 1rem;
      color: #ffffff;
      font-weight: bold;
      vertical-align: bottom;
    }
  }
</style>

