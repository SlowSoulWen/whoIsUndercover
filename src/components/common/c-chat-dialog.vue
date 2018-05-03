<template>
  <div class="c-chat-dialog">
    <c-avatar class="avatar" :src="user.avator"></c-avatar>
    <div class='dialog-content'>
      <h4>{{ user.nickname }}</h4>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
  import cAvatar from '@common/c-avatar.vue'

  export default {
    props: {
      user: {
        type: Object,
        default: function () {
          return {}
        }
      },
      message: {
        type: String,
        default: ''
      }
    },
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
    text-align: left;

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

