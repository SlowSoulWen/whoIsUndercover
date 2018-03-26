<template>
  <div id="room">
    <div>
      <c-header></c-header>
      <div class="gamer-content">
        <div v-for="(item, index) in 16" :key="index" class="gamer-box">
          <c-avatar class="avatar"></c-avatar>
          <span class="gamer-name">慢灵魂</span>
        </div>
      </div>
      <div class="option-box">
        <button class="btn ready-btn" @click="handleReady">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-iconfontyouxihudong"></use>
          </svg>
          准备
        </button>
        <button class="btn exit-btn">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tuichu"></use>
          </svg>
          退出
        </button>
      </div>
    </div>
    <div class='chat-content'>
      <c-chat-box></c-chat-box>
    </div>
  </div>
</template>

<script>
  import cHeader from '@common/c-header.vue'
  import cAvatar from '@common/c-avatar.vue'
  import cChatBox from '@common/c-chat-box.vue'

  export default {
    props: {
      id: {
        type: String
      }
    },
    methods: {
      handleReady () {
        this.$router.push({
          name: 'game',
          parmas: {
            id: '231313132'
          }
        })
      }
    },
    components: {
      cHeader,
      cAvatar,
      cChatBox
    }
  }
</script>

<style lang='less' scoped>
  @import '~@src/styles/mixin.less';

  #room {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #F6F3F7;

    .gamer-content {
      width: 100%;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      justify-content: space-between;

      .gamer-box {
        background: #ffffff;
        min-width: 20%;
        margin: 0.5em 0;
        border-radius: 1em;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        padding: 5px;

        .avatar {
          width: 60%;
          margin: 0 auto;
          display: block;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
    }

    .option-box {
      display: flex;
      justify-content: flex-start;

      .icon {
        font-size: 1.3em;
        color: #ffffff;
      }

      & > button {
        font-size: 1.5em;
        margin-top: 1em;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
      }

      .exit-btn {
        background-color: @global-pink;
        background: linear-gradient(-45deg, @global-pink, @global-pink - #111 70%);
        padding: 0.8em 1em;
      }

      .ready-btn {
        background-color: @global-blue;
        background: linear-gradient(-45deg, @global-blue, @global-blue - #111 70%);
        padding: 0.8em 2.5em;
      }
    }

    .chat-content {
      flex: 1;
      position: relative;
    }

    .no-ready {
      .addLabel('未准备', @global-pink, 0.8em);
    }

    .ready {
      .addLabel('已准备', @global-blue, 0.8em);
    }
  }
</style>


