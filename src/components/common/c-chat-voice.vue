<template>
  <div class="c-chat-voice">
    <c-avatar class="avatar" :src="user.avator"></c-avatar>
    <div class='dialog-content'>
      <h4>{{ user.nickname }}</h4>
      <div class="voice-box" @click="voicePlay">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shengyin"></use>
        </svg>
        <span>点击播放语音</span>
      </div>
    </div>
  </div>
</template>

<script>
  import cAvatar from '@common/c-avatar.vue'
  import { playVoice, downloadVoice } from '@src/config/wechat-api'

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
    methods: {
      async voicePlay () {
        let localId = (await downloadVoice(this.message)).localId
        playVoice(localId)
      }
    },
    components: {
      cAvatar
    }
  }
</script>

<style lang="less" scoped>
  .c-chat-voice {
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

      .voice-box {
        width: 180px;
        padding: 8px 10px;
        background: @global-blue;
        border-radius: 5px;

        .icon {
          color: #fff;
          font-size: 1.2rem;
        }

        & > span {
          color: #fff;
          font-weight: bold;
        }
      }

      & > h4 {
        color: @global-blue;
      }
    }
  }
</style>

