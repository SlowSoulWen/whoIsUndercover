<template>
  <div id="game">
    <div class="gamer-content">
      <scroller :on-infinite="infiniteGamer" ref="scroller">
        <c-avatar class="avatar" v-for="(item, index) in 18" :key="index"></c-avatar>
      </scroller>
    </div>
    <div class="game-content">
      <div class="game-message">
        <span>您的身份</span>
        <span>诸葛亮</span>
      </div>
      <div class="chat">
        <c-chat-box></c-chat-box>
      </div>
    </div>
  </div>
</template>

<script>
  import cAvatar from '@common/c-avatar.vue'
  import cChatBox from '@common/c-chat-box.vue'

  export default {
    methods: {
      infiniteGamer (done) {
        done()
      }
    },
    props: {
      id: {
        type: String
      }
    },
    components: {
      cAvatar,
      cChatBox
    }
  }
</script>

<style lang="less" scoped>
  #game {
    width: 100%;
    height: 100%;
    display: flex;
    background: #F6F3F7;

    .gamer-content {
      width: 70px;
      position: relative;

      .avatar {
        width: 50px;
        display: block;
        margin: 0 auto;
        margin: 10px;
      }
    }

    .game-content {
      flex: 1;
      display: flex;
      flex-direction: column;

      .game-message {
        width: 90%;
        margin: 10px auto;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: @global-blue;
        border-radius: 1em;
      }

      .chat {
        flex: 1;
        position: relative;
      }
    }
  }
</style>
