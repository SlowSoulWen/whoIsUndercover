<template>
  <div class="c-header">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-solid-home"></use>
    </svg>
    <span class="home-name">一起来玩吧</span>
    <span class="home-id">（id: 123134123231）</span>
  </div>
</template>


<script>
  export default {

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

