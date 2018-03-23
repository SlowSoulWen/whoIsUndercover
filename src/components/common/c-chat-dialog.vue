<template>
  <div class="c-chat-dialog">
    <c-avatar class="avatar"></c-avatar>
    <div class='dialog-content'>
      <h4>慢灵魂</h4>
      <span>测试的对的户外回</span>
    </div>
  </div>
</template>

<script>
  import cAvatar from '@common/c-avatar.vue'

  export default {
    components: {
      cAvatar
    }
  }
</script>

<style lang="less" scoped>
  .c-chat-dialog {
    width: 100%;
    min-height: 50px;
    line-height: 50px;
    display: flex;
    padding: 2px 3px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .dialog-content {
      flex: 1;
      padding: 5px;
      line-height: normal;

      & > h4 {
        color: @global-blue;
      }

      & > span {
        display: inline-block;
        background: @global-blue - #111;
        color: #ffffff;
        max-width: 90%;
        padding: 5px 6px;
        border-radius: 0.5em;
      }
    }
  }
</style>

