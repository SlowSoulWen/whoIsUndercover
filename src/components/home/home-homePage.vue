<template>
  <div id="home-homePage">
    <div class="search-box">
      <input class="search-input" type="text" placeholder="输入房间名" v-model="roomName">
      <button class='search-btn btn' type="button" @click="searchRoom">加入房间</button>
    </div>
    <!-- <div class="fast-matching">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-renshu"></use>
      </svg>
      <span>快速匹配</span>
    </div> -->
    <create-game class="create-game-box"></create-game>
  </div>
</template>

<script>
  import createGame from '@components/home/create-home.vue'
  import { roomModel } from '@src/config/request-map'

  export default {
    data () {
      return {
        roomName: ''
      }
    },
    methods: {
      async searchRoom () {
        if (!this.roomName) {
          this.$vux.toast.show({
            type: 'warn',
            text: '房间名不能为空'
          })
          return false
        }
        let data = (await roomModel.searchRoom(this.roomName)).data
        this.roomName = ''
        if (data.errno) {
          this.$vux.alert.show({
            title: '出错了',
            content: data.data
          })
          return false
        } else if (!data.data) {
          this.$vux.alert.show({
            title: '提示',
            content: '未找到相关的房间'
          })
          return false
        }
        let roomId = data.data.id
        this.$router.push({
          name: 'room',
          params: { id: roomId }
        })
      }
    },
    components: {
      createGame
    }
  }
</script>

<style lang="less" scoped>
  @import '~@src/styles/mixin.less';

  #home-homePage {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    .bg-stripe(#FFAFAF, 45deg);
    font-weight: bolder;
    overflow: hidden;

    .fast-matching {
      width: 14em;
      height: 14em;
      background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
      box-shadow: 0 0 0 6px rgba(41, 178, 243, 0.6),
                  0 0 0 12px rgba(97, 198, 246, 0.3);
      border-radius: 50%;
      margin: 0 auto;
      margin-top: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;

      & > span {
        font-size: 1.5em;
        font-weight: bolder;
      }

      .icon {
        font-size: 2.5em;
        display: block;
      }
    }

    .search-box {
      margin-top: 10%;
      margin-bottom: 15%;
      display: flex;
      justify-content: center;

      .search-input {
        border-style: none;
        height: 43px;
        width: 60%;
        padding: 0.5em 1em;
        border-radius: 0.6em;
        font-size: 1.4em;
        border: 3px solid rgba(38, 168, 228, 1);
      }

      .search-btn {
        width: 25%;
        height: 43px;
        font-size: 1.2rem;
      }
    }

    .btn {
      margin-left: 1em;
      border-style: none;
      background-color: #1292CF;
      color: #ffffff;
      border-radius: 0.7em;
      background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
      font-weight: bolder;
    }
  }
</style>