<template>
  <div class="c-chat-box">
    <div class="comment">
      <scroller :on-infinite="infiniteChatDialog" ref="scroller">
        <template v-for="item in chatData">
          <c-chat-dialog v-if="item.chatType == 2 && item.msgType == 1" :key="item.userId" :message="item.data" :user="item.user"></c-chat-dialog>
          <c-chat-voice v-else-if="item.chatType == 2 && item.msgType == 2" :key="item.userId" :message="item.data" :user="item.user"></c-chat-voice>
          <c-chat-prompt v-else-if="item.chatType == 1" :key="item.userId" :message="item.data" :type="item.type"></c-chat-prompt>
        </template>
      </scroller>
    </div>
    <div class="input-box">
      <input class="chat-input" type="text" v-model="message">
      <svg class="icon tape" aria-hidden="true" @click="startRecord">
        <use xlink:href="#icon-luyin"></use>
      </svg>
      <button class="btn submit" @click="send">发送</button>
    </div>
    <div class="tape-mark" v-show="tape">
      <div class="tape-box">
        <svg class="icon voice" aria-hidden="true">
          <use xlink:href="#icon-shengyinright"></use>
        </svg>
        <svg class="icon taping" aria-hidden="true">
          <use xlink:href="#icon-luyin"></use>
        </svg>
        <svg class="icon voice" aria-hidden="true">
          <use xlink:href="#icon-135"></use>
        </svg>
        <h4>正在录音...</h4>
        <button class="btn confirm-btn" @click="tapeSend">确认发送</button>
        <button class="btn cancel-btn" @click="tapeCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  import cChatDialog from '@common/c-chat-dialog.vue'
  import cChatPrompt from '@common/c-chat-prompt.vue'
  import cChatVoice from '@common/c-chat-voice.vue'
  import { startRecord, stopRecord } from '@src/config/wechat-api'

  export default {
    data () {
      return {
        message: '',
        tape: false
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
      async startRecord () {
        if (!this.sendable) {
          this.$vux.toast.show({
            text: '您还不能发言',
            type: 'warn'
          })
          return false
        }
        await startRecord()
        this.tape = true
      },
      async tapeSend () {
        let serverId = (await stopRecord()).serverId
        this.$emit('msgSend', {
          message: serverId,
          msgType: 2
        })
        this.tape = false
      },
      async tapeCancel () {
        await stopRecord()
        this.tape = false
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
          msgType: 1,
          message: this.message
        })
        this.message = ''
      }
    },
    components: {
      cChatDialog,
      cChatPrompt,
      cChatVoice
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
      display: flex;
      align-items: center;
      padding: 0 5px;

      .chat-input {
        margin: 0 5px;
        flex: 1;
        font-size: 1.2rem;
        padding: 0.5em;
        border-radius: 0.2em;
        border-style: none;
      }

      .tape {
        font-size: 2.5rem;
        color: @global-blue;
      }

      .submit {
        width: 60px;
        text-align: center;
        color: #ffffff;
        background: @global-blue;
        padding: 0.6em 0.5em;
        font-size: 1rem;
      }
    }

    .tape-mark {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 996;
    }

    .tape-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
      width: 200px;
      background: #fff;
      z-index: 997;
      border-radius: 10px;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
      text-align: center;
      color: @global-blue;

      .taping {
        display: inline-block;
        margin: 10px 0;
        font-size: 5rem;
      }

      .voice {
        font-size: 3rem;
        vertical-align: super;
      }

      & > h4 {
        font-size: 1.5rem;
        padding: 10px 0;
      }

      & > .btn {
        position: absolute;
        padding: 10px 20px;
        bottom: -65px;
        font-size: 1.2rem;
        margin-left: 0;
        box-shadow: 0 0 5px 4px rgba(0, 0, 0, 0.1);
      }

      & > .confirm-btn {
        background: @global-blue;
        left: 0;
      }

      & > .cancel-btn {
        background: @global-pink;
        right: 0;
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
