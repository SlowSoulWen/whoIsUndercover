<template>
  <div id="game">
    <div class="gamer-content">
      <scroller :on-infinite="infiniteGamer" ref="scroller">
        <div class="avatar-box" v-for="(item, index) in player" @click="showVoteHandler(index)" :key="index">
          <div class="avatar-content">
            <c-avatar class="avatar"></c-avatar>
            <div class="out-box" v-show="item.isOut">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-chacha"></use>
              </svg>
            </div>
          </div>
          <span class="nick-name">{{ item.nickname }}</span>
          <span class="order-num">{{ index + 1 }}</span>
          <div class="vote-btn" v-if="item.id !== $store.state.User.id" v-show="!item.isOut && item.showVoteBtn">
            <span>认为Ta是卧底？</span>
            <div class="btn" @click="voteHandler(item.id)">确认投他</div>
          </div>
        </div>
      </scroller>
    </div>
    <div class="game-content">
      <div class="game-message">
        <div class="keyWrod-box">
          <span class="title">您的关键字</span>
          <span class="key">{{ keywrod }}</span>
        </div>
        <div class="time-box">
          <div class="time-content">
            <span class="title">计时</span>
            <span class="time">{{ time }}</span>
            <div class="speak-over-box" @click="stopSpeakHandler" v-show="isSpeak">
              <span>点我结束发言</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat">
        <c-chat-box :chatData="chatData" :sendable="isSpeak" @msgSend="msgSendHandler"></c-chat-box>
      </div>
    </div>
    <transition name="fade">
      <div class="mask" v-show="isMark" @click="hideMask"></div>
    </transition>
  </div>
</template>

<script>
  import cAvatar from '@common/c-avatar.vue'
  import cChatBox from '@common/c-chat-box.vue'
  import { gameModel } from '@src/config/request-map'
  import io from 'socket.io-client'

  export default {
    data () {
      return {
        gameSocket: {},
        roomId: '', // 等待房间的id
        player: [], // 玩家列表
        keywrod: '', // 关键字
        number: 0, // 玩家人数
        isMark: false, // 是否显示遮罩层
        isOut: false, // 是否出局
        isSpeak: false, // 是否轮到发言
        voteable: false, // 是否可以投票
        isVoted: false, // 是否已投过票
        time: 0, // 倒计时
        timer: null,
        chatData: [],
        roundsNum: 0
      }
    },
    created () {
      this.gameSocket = io('/games', {
        query: {
          gameId: this.id,
          nickName: this.$store.state.User.nickname,
          userId: this.$store.state.User.id,
          roomId: this.roomId
        }
      })
      this.initSocketHandlers()
    },
    async mounted () {
      let _this = this
      await this.initGameDetail()
      this.$vux.alert.show({
        title: '您的关键字',
        content: this.keywrod,
        onHide () {
          // 向后台发送确认请求
          _this.ready()
          _this.chatData.push({
            chatType: 1,
            data: '等待其他玩家加入',
            type: 1
          })
        }
      })
    },
    props: {
      id: { // 游戏房间id
        type: String
      }
    },
    methods: {
      infiniteGamer (done) {
        done()
      },
      async initGameDetail () {
        let gameData = (await gameModel.getGameDetail({
          userId: this.$store.state.User.id,
          gameId: this.id
        })).data.data
        this.player = gameData.player.map((player) => {
          player.showVoteBtn = false
          return player
        })
        this.keywrod = gameData.keywrod
        this.number = gameData.number
        this.isOut = gameData.isOut
        this.roomId = gameData.roomId
      },
      async initSocketHandlers () {
        // 新的回合数
        this.gameSocket.on('newRound', () => {
          this.roundsNum++
          this.chatData.push({
            chatType: 1,
            data: `第${this.roundsNum}轮发言开始`,
            type: 1
          })
        })
        // 轮到某玩家开始发言
        this.gameSocket.on('speak', (data) => {
          let player = this.player.find((player) => {
            return player.id === data.userId
          })
          this.chatData.push({
            chatType: 1,
            data: `玩家${player.nickname}开始发言，计时${data.time}秒`,
            type: 1
          })
          this.isSpeak = false
          // 如果是轮到自己
          if (data.userId === this.$store.state.User.id) {
            this.isSpeak = true
            this.$vux.alert.show({
              title: '轮到你发言啦',
              content: `你有${data.time}秒的自由发言时间，你也可以点击右上角的【结束发言】提前结束,请注意不要在发言中出现你的关键字`
            })
            this.setTimer(data.time, this.stopSpeak) // 开始计时
          }
        })
        // 玩家投票
        this.gameSocket.on('vote', (data) => {
          this.chatData.push({
            chatType: 1,
            data: '玩家投票环节',
            type: 1
          })
          if (this.isOut) return false
          this.$vux.alert.show({
            title: '投票环节',
            content: `根据这一轮的发言选出一个你认为是卧底的玩家，点击左边的头像进行投票，计时${this.time}秒`
          })
          this.voteable = true
          this.setTimer(data.time, this.overVote)
        })
        // 玩家发言
        this.gameSocket.on('message', (data) => {
          let userId = data.userId
          let message = data.message
          let user = this.player.find((player) => {
            return player.id === userId
          })
          this.chatData.push({
            chatType: 2, // 1、系统消息 2、玩家发言
            data: message,
            user
          })
        })
        // 游戏结束
        this.gameSocket.on('gameOver', (data) => {
          this.$vux.alert.show({
            title: `${data.winer === 1 ? '卧底' : '平民'}获胜`,
            content: `平民身份：${data.keywrod[0]}  卧底身份：${data.keywrod[1]}`,
            onHide: () => {
              this.$router.go(-1)
            }
          })
        })
        // 玩家淘汰
        this.gameSocket.on('out', (data) => {
          if (!data.userId) {
            this.chatData.push({
              chatType: 1,
              data: '由于最高票存在多位玩家，该轮发言不淘汰玩家',
              type: 1
            })
            return
          }
          let player = this.player.find((player) => { return player.id === data.userId })
          this.chatData.push({
            chatType: 1,
            data: `玩家${player.nickname}被淘汰了,Ta的身份是: ${data.identity === 0 ? '平民' : '卧底'}`,
            type: 1
          })
          if (data.userId === this.$store.state.User.id) {
            this.$vux.alert.show({
              title: '你被淘汰了',
              content: `你的身份是${data.identity === 0 ? '平民' : '卧底'}，你可以留下来继续观看比赛`
            })
            this.isOut = true
          } else {
            this.initGameDetail()
          }
        })
      },
      ready () {
        this.gameSocket.emit('ready')
      },
      setTimer (time, fn) {
        this.time = time
        this.timer = setInterval(() => {
          this.time--
          if (this.time === 0) {
            typeof fn === 'function' && fn()
          }
        }, 1000)
      },
      stopSpeak () {
        clearInterval(this.timer)
        this.time = 0
        this.isSpeak = false
        this.$vux.toast.show({
          text: '发言结束'
        })
        this.gameSocket.emit('stopSpeak')
      },
      showVoteHandler (index) {
        if (!this.voteable) return false
        this.player.forEach((player) => {
          player.showVoteBtn = false
        })
        this.player[index].showVoteBtn = true
        this.isMark = true
      },
      voteHandler (userId) {
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要投票给Ta吗?',
          onConfirm () {
            _this.overVote(userId)
            _this.$vux.toast.show({
              text: '投票成功'
            })
          }
        })
      },
      overVote (userId) {
        clearInterval(this.timer)
        this.time = 0
        this.gameSocket.emit('vote', {
          userId
        })
        this.chatData.push({
          chatType: 1,
          data: '等待其他玩家投票',
          type: 1
        })
        this.voteable = false
        this.hideMask()
      },
      msgSendHandler (data) {
        let re = new RegExp(this.keywrod, 'ig')
        let message = data.message.replace(re, () => {
          return '***'
        })
        this.gameSocket.emit('message', {
          message
        })
      },
      stopSpeakHandler () {
        let _this = this
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要结束发言吗?',
          onConfirm () {
            _this.stopSpeak()
          }
        })
      },
      hideMask () {
        this.player.forEach((player) => {
          player.showVoteBtn = false
        })
        this.isMark = false
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
      typeof this.gameSocket.close === 'function' && this.gameSocket.close()
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
    text-align: center;

    .gamer-content {
      width: 70px;
      position: relative;
      z-index: 999;

      .avatar-box {
        position: relative;

        .avatar-content {
          position: relative;

          .out-box {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 0;
            left: 50%;
            border-radius: 50%;
            transform: translate(-50%, 0);
            background: rgba(0, 0, 0, 0.3);

            .icon {
              font-size: 50px;
              color: rgba(247, 140, 167, 1);
            }
          }

          .avatar {
            width: 50px;
            display: block;
            margin: 0 auto;
            margin-top: 10px;
            margin-bottom: 5px;
          }
        }

        .nick-name {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
        }

        .order-num {
          position: absolute;
          line-height: 10px;
          bottom: 20px;
          right: 5px;
          display: inline-block;
          padding: 1px 3px;
          border-radius: 2px;
          background: @global-blue;
          color: #fff;
          border: 3px solid @global-green;
        }

        .vote-btn {
          position: absolute;
          right: -150px;
          top: 0;
          width: 150px;
          height: 100px;
          text-align: center;
          line-height: 40px;
          color: @global-blue;
          font-weight: bolder;
          background: #fff;
          border-radius: 10px;
          z-index: 99;

          &::before {
            content: '';
            display: block;
            width: 14px;
            height: 14px;
            background: inherit;
            position: absolute;
            top: 23px;
            left: -7px;
            transform: rotate(45deg);
          }

          .btn {
            margin: 0 auto;
            border-style: none;
            background-color: @global-green;
            color: #ffffff;
            border-radius: 0.7em;
            background: linear-gradient(-45deg, @global-green, @global-green - #666, 70%);
            font-weight: bolder;
            width: 60%;
            padding: 2px 10px;
          }
        }
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
        display: flex;

        .keyWrod-box {
          flex: 3;
          display: flex;
          background: @global-blue;
          border-radius: 1em;
          line-height: 50px;
          text-align: center;
          overflow: hidden;

          & > span {
            flex: 1;
          }

          .title {
            background: @global-green;
            color: #fff;
            font-size: 14px;
            font-weight: bolder;
          }

          .key {
            color: #fff;
            font-size: 14px;
            font-weight: bolder;
          }
        }

        .time-box {
          flex: 1;

          .time-content {
            background: #fff;
            width: 50px;
            height: 50px;
            border: 2px solid @global-pink;
            margin: 0 auto;
            text-align: center;
            position: relative;

            span.title {
              display: block;
              color: #666;
            }

            span.time {
              line-height: 25px;
              color: @global-pink;
              font-size: 20px;
              font-weight: bolder;
            }

            .speak-over-box {
              position: absolute;
              bottom: -50px;
              right: 0;
              width: 100px;
              height: 30px;
              border-radius: 5px;
              text-align: center;
              line-height: 30px;
              color: #fff;
              background: @global-pink;
              z-index: 990;

              &::before {
                content: '';
                display: block;
                position: absolute;
                width: 10px;
                height: 10px;
                background: inherit;
                top: -5px;
                right: 10px;
                transform: rotate(45deg);
              }
            }
          }
        }
      }

      .chat {
        flex: 1;
        position: relative;
      }
    }

    .mask {
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 998;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>

<style lang="less">
  #game {
    .gamer-content {
      ._v-container {
        overflow: visible;
      }
    }
  }
</style>
