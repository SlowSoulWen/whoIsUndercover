<template>
  <div class="c-chat-box">
    <div class="comment">
      <scroller :on-infinite="infiniteChatDialog" ref="scroller">
        <c-chat-dialog v-for="(item, index) in 5" :key="index"></c-chat-dialog>
      </scroller>
    </div>
    <div class="input-box">
      <input class="chat-input" type="text">
      <button class="btn submit">发送</button>
    </div>
  </div>
</template>

<script>
  import cChatDialog from '@common/c-chat-dialog.vue'

  export default {
    methods: {
      infiniteChatDialog (done) {
        done()
      }
    },
    components: {
      cChatDialog
    }
  }
</script>

<style lang="less" scoped>
  .c-chat-box {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;

    .comment {
      flex: 1;
      background: #ffffff;
      position: relative;
      border: 1px solid @global-blue;
      margin:0 1em 1em 1em;
      border-radius: 1em;
    }

    .input-box {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: @global-pink;

      .chat-input {
        margin: 0 5px;
        width: 70%;
        font-size: 1.2rem;
        padding: 0.5em;
        border-radius: 0.2em;
        border-style: none;
      }

      .submit {
        width: 20%;
        text-align: center;
        color: #ffffff;
        background: @global-blue;
        padding: 0.6em 0.5em;
        font-size: 1rem;
      }
    }
  }
</style>


