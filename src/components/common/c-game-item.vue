<template>
  <div class="c-game-item">
    <div class="game-content">
      <span class="name">{{ gameData.name }}</span>
      <span class="time">{{ gameData.time }}</span>
      <span class="role">{{ gameData.role }}</span>
    </div>
    <span class='result-icon'>{{ gameData.result }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      gameData: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@src/styles/mixin.less';
  
  .c-game-item {
    
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px 5px;

    &::after {
      display: block;
      content: '';
      clear: both;
      visibility: hidden;
      overflow: hidden;
      height: 0;
    }

    .game-content {
      float: left;

      .name {
          display: block;            
          padding: 5px 3px;
        .addLabel('房间名', #1FAEF2);
      }

      .time {          
        display: inline-block;
        padding: 5px 3px;
        .addLabel('时间', #2DB5AB);
      }

      .role {
        display: inline-block;
        padding: 10px 3px;
        .addLabel('角色', #F78CA7);
      }
    }

    .result-icon {
      float: right;
      display: inline-block;
      width: 3.5em;
      height: 3.5em;
      border-radius: 50%;
      background: #1FAEF2;
      text-align: center;
      line-height: 3.5em;
      color: #ffffff;
      font-weight: bolder;
      transform: rotate(45deg);
    }

  }
</style>

