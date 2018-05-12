<template>
  <div id="room">
    <div>
      <c-header :roomName="roomName" :id="id"></c-header>
      <div class="gamer-content">
        <div v-for="item in player" :key="item.id" class="gamer-box">
          <c-avatar class="avatar" :src="item.avator"></c-avatar>
          <span class="gamer-name">{{ item.nickname }}</span>
          <div class="isOwner" v-if="ownerId === item.id">房主</div>
          <div class="isReady" v-else-if="item.isReady">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gou1"></use>
            </svg>
          </div>
        </div>
        <div v-for="(item, index) in playerMaxNum - player.length" :key="index" class="gamer-box">
          <c-avatar class="avatar"></c-avatar>
          <span class="gamer-name">虚位以待</span>
        </div>
      </div>
      <div class="option-box">
        <button class="btn ready-btn" @click="handleBegin" v-if="ownerId === $store.state.User.id ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-iconfontyouxihudong"></use>
          </svg>
          开始游戏
        </button>
        <button class="btn ready-btn" :class="{'cancel-ready': isReady}" @click="handleReady" v-else>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-iconfontyouxihudong"></use>
          </svg>
          {{ isReady ? '取消准备' : '准备' }}
        </button>
        <button class="btn exit-btn" @click="handleExit">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tuichu"></use>
          </svg>
          退出
        </button>
      </div>
    </div>
    <div class='chat-content'>
      <c-chat-box :chatData="chatData" @msgSend="handleMsgSend"></c-chat-box>
    </div>
    <x-dialog class="pwd-box" v-model="showPwdBox">
      <h4>请输入房间密码：</h4>
      <input type="text" v-model="pwd">
      <button class="btn pwd-btn" @click="checkPwd">确认</button>
      <button class="btn cancel-btn" @click="handleExit">离开</button>
    </x-dialog>
  </div>
</template>

<script>
  import cHeader from '@common/c-header.vue'
  import cAvatar from '@common/c-avatar.vue'
  import cChatBox from '@common/c-chat-box.vue'
  import { XDialog } from 'vux'
  import { roomModel, gameModel } from '@src/config/request-map'
  import io from 'socket.io-client'
  import { shareAll } from '@src/config/wechat-api'
  import parser from 'socket.io-json-parser'

  export default {
    data () {
      return {
        ownerId: '',
        roomName: '',
        player: [],
        playerMaxNum: 0,
        status: 0,
        roomSocket: {},
        chatData: [],
        isOwner: false,
        isReady: false,
        roomPwd: '',
        showPwdBox: false,
        pwd: ''
      }
    },
    props: {
      id: { // 房间id
        type: String
      }
    },
    async created () {
      if (!(await this.joinRoom())) return false
      if (!(await this.initRoomDeatil())) return false
      if (this.roomPwd && this.ownerId !== this.$store.state.User.id) {
        this.showPwdBox = true
      }
      this.roomSocket = io('/rooms', {
        parser,
        query: {
          roomId: this.id,
          nickName: this.$store.state.User.nickname,
          userId: this.$store.state.User.id
        }
      })
      this.initSocketHandlers()
    },
    updated () {
      let shareInfo = {
        title: '就差你了，来一局紧张刺激的小游戏吧！',
        subTitle: `${this.$store.state.User.nickname}邀请你加入${this.roomName}房间`,
        imageUrl: 'http://oo917ps5l.bkt.clouddn.com/u=1569065380,2610568000&fm=27&gp=0.jpg',
        widgetExtra: {
          type: '1',
          ids: {
            courseId: this.courseId
          }
        }
      }
      shareAll(shareInfo)
    },
    methods: {
      async joinRoom () { // 请求加入房间
        let res = (await roomModel.joinRoom(this.id)).data
        if (res.errno) {
          let _this = this
          this.$vux.alert.show({
            title: '出错了',
            content: res.data,
            onHide () {
              _this.$router.replace({
                name: 'home-index'
              })
            }
          })
          return false
        }
        return true
      },
      async initRoomDeatil () { // 获取房间数据
        let roomDetail = (await roomModel.getRoomDeatil(this.id)).data
        if (roomDetail.errno) {
          let _this = this
          this.$vux.alert.show({
            title: '出错了',
            content: roomDetail.data,
            onHide () {
              _this.$router.go(-1)
            }
          })
          return false
        }
        this.updateRoomDetail(roomDetail.data)
        return true
      },
      async initSocketHandlers () {
        // 玩家加入
        this.roomSocket.on('join', (data) => {
          this.chatData.push({
            chatType: 1, // 1、系统消息 2、玩家发言
            data: `欢迎${data.nickName}加入房间`,
            type: 1, // 系统消息类型, 1、正常提示 2、出错提示
            userId: data.userId
          })
          this.initRoomDeatil()
        })
        // 有玩家离开
        this.roomSocket.on('leave', (data) => {
          let userId = data.userId
          let player = this.player.find((player) => {
            return player.id === userId
          })
          this.chatData.push({
            chatType: 1,
            data: `玩家${player.nickname}离开了房间`,
            type: 1
          })
          this.updateRoomDetail(data.roomDetail)
        })
        // 接受其他玩家发言
        this.roomSocket.on('message', async (data) => {
          let userId = data.userId
          let message = data.message
          let msgType = data.msgType
          let user = this.player.find((player) => {
            return player.id === userId
          })
          this.chatData.push({
            chatType: 2, // 1、系统消息 2、玩家发言
            data: message,
            msgType: msgType,
            user
          })
        })
        // 玩家改变准备状态
        this.roomSocket.on('changeReadyStatus', (data) => {
          let userId = data.userId
          let current = this.player.findIndex((player) => {
            return player.id === userId
          })
          this.player[current].isReady = data.status
        })
        // 房主开始游戏
        this.roomSocket.on('joinGame', (data) => {
          this.joinGame(data.gameId)
        })
      },
      // 玩家发言
      handleMsgSend (data) {
        this.roomSocket.send({
          message: data.message,
          msgType: data.msgType
        })
      },
      handleReady () {
        // 玩家准备
        this.isReady = !this.isReady
        this.roomSocket.emit('changeReadyStatus', {
          userId: this.$store.state.User.id,
          status: this.isReady
        })
      },
      async handleBegin () {
        // 开始游戏
        if (this.player.length < this.playerMaxNum) {
          this.$vux.alert.show({
            title: '无法开始',
            content: '房间尚未满员'
          })
          return false
        } else if (!this.player.every((player) => {
          return player.id === this.ownerId || player.isReady
        })) {
          this.$vux.alert.show({
            title: '无法开始',
            content: '有玩家尚未准备'
          })
          return false
        }
        // 请求创建游戏
        let game = (await gameModel.createGame(this.id)).data
        if (game.errno) {
          this.$vux.alert.show({
            title: '出错了',
            content: game.data
          })
          return false
        }
        this.roomSocket.emit('joinGame', {
          gameId: game.data.gameId
        })
      },
      joinGame (gameId) { // 加入游戏
        this.$router.push({
          name: 'game',
          params: {
            id: gameId
          }
        })
      },
      handleExit () {
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要离开房间吗?',
          onConfirm () {
            _this.$router.replace({
              name: 'home-page'
            })
          }
        })
      },
      updateRoomDetail ({ownerId, roomName, player, playerMaxNum, status, roomPwd}) {
        this.ownerId = ownerId
        this.roomName = roomName
        this.player = player
        this.playerMaxNum = playerMaxNum
        this.status = status
        this.isOwner = ownerId === this.$store.state.User.id
        this.roomPwd = roomPwd
      },
      checkPwd () {
        if (this.pwd === this.roomPwd) {
          this.$vux.toast.show({
            text: '密码正确'
          })
          this.showPwdBox = false
        } else {
          this.$vux.toast.show({
            type: 'cancel',
            text: '密码错误'
          })
        }
      }
    },
    beforeDestroy () {
      typeof this.roomSocket.close === 'function' && this.roomSocket.close()
    },
    components: {
      cHeader,
      cAvatar,
      cChatBox,
      XDialog
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
        position: relative;
        width: 23%;
        // max-width: 60px;
        margin: 0.5em 3px;
        border-radius: 1em;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        padding: 5px;
        overflow: hidden;

        .isOwner, .isReady {
          width: 43px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background-color: @global-blue;
          color: #fff;
          transform: rotate(45deg);
          position: absolute;
          right: -13px;
          top: 0;
          font-size: 12px;
        }

        .isReady > .icon {
          color: #fff;
          transform: rotate(-45deg);
        }

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

      .cancel-ready {
        background: #666;
      }
    }

    .chat-content {
      flex: 1;
      position: relative;
    }

    .pwd-box {
      h4 {
        padding: 10px 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: @global-blue;
      }

      input {
        border-style: none;
        border-bottom: 2px solid @global-blue;
        padding: 5px 10px;
        font-size: 1.4rem;
        text-align: center;
        display: block;
        margin: 0 auto;
      }

      .btn {
        display: inline-block;
        padding: 8px 10px;
        background: @global-blue;
        color: #fff;
        margin: 20px auto;
        font-size: 1.4rem;
      }

      .cancel-btn {
        background: @global-pink;
      }
    }
  }
</style>


