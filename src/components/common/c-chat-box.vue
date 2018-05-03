<template>
  <div class="c-chat-box">
    <div class="comment">
      <scroller :on-infinite="infiniteChatDialog" ref="scroller">
        <template v-for="item in chatData">
          <c-chat-dialog v-if="item.chatType == 2" :key="item.userId" :message="item.data" :user="item.user"></c-chat-dialog>
          <c-chat-prompt v-else-if="item.chatType == 1" :key="item.userId" :message="item.data" :type="item.type"></c-chat-prompt>
        </template>
      </scroller>
    </div>
    <div class="input-box">
      <input class="chat-input" type="text" v-model="message">
      <button class="btn submit" @click="send">发送</button>
    </div>
  </div>
</template>

<script>
  import cChatDialog from '@common/c-chat-dialog.vue'
  import cChatPrompt from '@common/c-chat-prompt.vue'

  export default {
    data () {
      return {
        message: ''
      }
    },
    props: {
      chatData: {
        type: Array,
        default: function () {
          return []
        }
      },
      sendable: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      chatData () {
        this.$nextTick(() => {
          this.$refs.scroller.scrollTo(0, this.$refs.scroller.$el.firstChild.clientHeight)
        })
      }
    },
    methods: {
      infiniteChatDialog (done) {
        done()
      },
      send () {
        if (!this.sendable) {
          this.$vux.toast.show({
            text: '您还不能发言',
            type: 'warn'
          })
          return false
        }
        if (!this.message) {
          this.$vux.toast.show({
            text: '发送内容不能为空',
            type: 'warn'
          })
          return false
        }
        this.$emit('msgSend', {
          message: this.message
        })
        this.message = ''
      }
    },
    components: {
      cChatDialog,
      cChatPrompt
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

<style lang="less">
  .c-chat-box {
    ._v-container {
      & > ._v-content {
        padding-bottom: 5px;
      }
    }
  }
</style>
