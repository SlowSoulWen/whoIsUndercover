<template>
  <div id="create-home">
    <div class="content-box">
      <div class="title">
        <h3>创建房间</h3>
      </div>
      <div class="form-item">
        <span class="name">房名</span>
        <input class="input name-input" type="text" v-model="roomName">
      </div>
      <div class="form-item">
        <span class="numbers">人数</span>
        <inline-x-number :min="4" :max="6" button-style="round" v-model="playerMaxNum"></inline-x-number>
      </div>
      <div class="form-item">
        <span class="password">密码</span>
        <input class="input pwd-input" type="password" v-model="roomPwd">
      </div>
    </div>
    <button class='create-room-btn btn' type="button" @click="createRoom">创建房间</button>
  </div>
</template>

<script>
  import { InlineXNumber } from 'vux'
  import { roomModel } from '@src/config/request-map'

  export default {
    data () {
      return {
        roomName: '',
        playerMaxNum: 4,
        roomPwd: ''
      }
    },
    methods: {
      async createRoom () {
        if (!this.roomName || !this.playerMaxNum) {
          this.$vux.toast.show({
            text: '请先完善房间信息',
            type: 'warn'
          })
          return false
        }
        let res = await roomModel.createRoom({
          roomName: this.roomName,
          playerMaxNum: this.playerMaxNum,
          roomPwd: this.roomPwd
        })
        if (res.errno) {
          this.$vux.alert.show({
            title: '提示',
            content: res.data
          })
          return false
        }
        this.$router.push({name: 'room', params: { id: res.data.roomId }})
      }
    },
    components: {
      InlineXNumber
    }
  }
</script>

<style lang="less" scoped>
#create-home {
  width: 100%;

  .content-box {
    width: 90%;
    margin: 0 auto;
    padding: 1.5rem 0;
    border-radius: 1em;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
    background: #ffffff;

    .title {
      text-align: center;
      font-size: 1.8rem;
      color: #1292CF;
      text-shadow: 0 0 0.1em #F78CA7, 0 0 0.3em #F78CA7;
    }

    .form-item {
      padding: 10px;
      font-size: 1.2rem;
      
      & > span {
        display: inline-block;
        position: relative;
        padding: 0.5em 1em;
        color: #ffffff;
        border-radius: 0.4em;

        &::after {
          display: inline-block;
          position: absolute;
          right: -0.4em;
          top: 50%;
          transform: translate(0, -50%) rotate(45deg);
          content: '';
          width: 0.8em;
          height: 0.8em;
          background: inherit;
        }

      }
      
      .name {
        background: #49B6EA;
      }

      .numbers {
        background: #2DB5AB;
      }

      .password {
        background: #F78CA7;
      }

      & > .input {
        width: 75%;
        border-style: none;
        outline: none;
        vertical-align: bottom;
        padding: 0.5rem 1rem;
        font-weight: bolder;
        font-size: 1em;

        &.name-input {
          color: #49B6EA;
          border-bottom: 2px solid #49B6EA;
        }

        &.pwd-input {
          color: #F78CA7;
          border-bottom: 2px solid #F78CA7;
        }
      }
    }
  }

  .create-room-btn {
    width: 90%;
    height: 55px;
    font-size: 1.3em;
    margin-top: 1em;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3); 
    border-radius: 0.7em;
    background-color: #1292CF;
    background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
  }
}
</style>

<style lang="less">
  #create-home {
    .vux-inline-x-number {
      padding-left: 20px;
      vertical-align: middle;

      .vux-number-selector {
        padding: 0;
        border: none;
      }

      .vux-number-input {
        height: 25px;
      }
    }
  }
</style>

