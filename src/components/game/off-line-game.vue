<template>
  <div id="off-line-game">
    <div class="keyword-box" ref="keywordBox">
      <img class="undercover-img" src="../../assets/underCover.jpg" alt="">
      <span class="title">{{ current + 1 }}号玩家身份</span>
      <button class="btn show-identity" v-show="!showKey" @click="showKeyword">点击查看</button>
      <span class="keyword" v-show="showKey">{{ keyword }}</span>
    </div>
    <div class="btn know-btn" v-show="showKey && !isLast" @click="next">我知道了</div>
    <div class="btn know-btn" v-show="showKey && isLast" @click="game">开始游戏</div>
  </div>
</template>

<script>
import anime from 'animejs'
import { gameModel } from '@src/config/request-map'

export default {
  props: {
    gamersNum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      current: 0,
      keyword: '',
      indenty: [],
      showKey: false,
      isLast: false,
      players: Array(this.gamersNum).fill({})
    }
  },
  async created () {
    let keyword = (await gameModel.getKeyWord()).data.data
    // 随机分配1/3玩家为卧底身份
    for (let i = 0; i < Math.floor(this.gamersNum / 3); i++) {
      let index = Math.floor(Math.random() * this.gamersNum)
      if (this.players[index].identity) {
        i--
        continue
      }
      this.players[index] = {
        keyword: keyword[1],
        identity: 1
      }
    }
    for (let i = 0; i < this.gamersNum; i++) {
      if (this.players[i].identity) continue
      this.players[i] = {
        keyword: keyword[0],
        identity: 0
      }
    }
    this.indenty = keyword
    this.keyword = this.players[this.current].keyword
  },
  mounted () {
    this.$vux.alert.show({
      title: '环节一',
      content: '给在座的玩家依次编号，传递手机，每个玩家查看并记住自己的关键字'
    })
  },
  methods: {
    showKeyword () {
      this.showKey = true
    },
    next () {
      let animes = anime({
        targets: '.keyword-box',
        translateX: -400,
        easing: 'linear',
        duration: 800
      })
      animes.complete = () => {
        this.$refs.keywordBox.style.transform = 'translateX(400px)'
        this.showKey = false
        this.current++
        this.keyword = this.players[this.current].keyword
        if (this.current === this.players.length - 1) this.isLast = true
        anime({
          targets: '.keyword-box',
          translateX: 0,
          duration: 2500
        })
      }
    },
    game () {
      this.$router.replace({
        name: 'off-line-game-2',
        params: {
          players: this.players,
          identity: this.indenty
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#off-line-game {
  width: 100%;
  height: 100%;
  background: @global-green;
  padding-top: 100px;

  .keyword-box {
    width: 70%;
    height: 350px;
    border-radius: 1em;
    background: #fff;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
    margin: 0 auto;
    text-align: center;
    padding-top: 50px;
  }

  .undercover-img {
    display: block;
    width: 50%;
    margin: 0 auto;
    margin-bottom: 20px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .show-identity {
    display: block;
    width: 50%;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    margin-top: 30px;
    background: @global-green;
    color: #fff;
  }

  .keyword {
    font-size: 1.6rem;
    display: block;
    margin: 18px auto;
  }

  .know-btn {
    width: 40%;
    height: 50px;
    line-height: 50px;
    display: block;
    margin: 30px auto;
    font-size: 1.2rem;
    color: #fff;
    background: @global-blue;
    text-align: center;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
  }
}
</style>
