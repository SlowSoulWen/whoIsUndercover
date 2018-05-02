<template>
  <div id="off-line-home">
    <h4 class="title">选择玩家人数</h4>
    <div class="select-box">
      <svg class="icon" aria-hidden="true" @click="reduceNum" :class="{ 'disable-btn': disableReduce }">
        <use xlink:href="#icon-jianhao"></use>
      </svg>
      <span class="gamer-num">{{ playerMaxNum }}</span>
      <svg class="icon" aria-hidden="true" @click="addNum" :class="{ 'disable-btn': disableAdd }">
        <use xlink:href="#icon-jiahao2"></use>
      </svg>
    </div>
    <div class="btn back-btn" @click="back">返回</div>
    <div class="btn submit-btn" @click="begin">开始游戏</div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      playerMaxNum: 4
    }
  },
  computed: {
    disableReduce () {
      return this.playerMaxNum <= 4
    },
    disableAdd () {
      return this.playerMaxNum >= 12
    }
  },
  methods: {
    reduceNum () {
      if (this.disableReduce) return false
      this.playerMaxNum--
    },
    addNum () {
      if (this.disableAdd) return false
      this.playerMaxNum++
    },
    back () {
      this.$router.go(-1)
    },
    begin () {
      this.$router.push({
        name: 'off-line-game',
        params: {
          gamersNum: this.playerMaxNum
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #off-line-home {
    width: 100%;
    height: 100%;
    background: pink;
    text-align: center;
    padding-top: 150px;

    .title {
      font-size: 2.5em;
      color: #fff;
      line-height: 50px;
    }

    .select-box {
      width: 70%;
      height: 100px;
      border-radius: 0.5em;
      background: #fff;
      margin: 0 auto;
      margin-top: 20px;
      margin-bottom: 40px;
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
      line-height: 100px;

      .icon {
        font-size: 3em;
        color: @global-green;
      }

      .gamer-num {
        font-size: 2.5em;
        padding: 0 40px;
        color: @global-green;
        font-weight: bolder;
      }

      .disable-btn {
        color: #666 !important;
      }
    }

    .btn {
      display: inline-block;
      width: 30%;
      height: 60px;
      text-align: center;
      border-radius: 0.8em;
      line-height: 60px;
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
      font-size: 1.5em;
      margin-left: 0;
    }

    .submit-btn {
      background: @global-blue;
      margin-left: 10px;
    }

    .back-btn {
      background: #666;
      margin-right: 10px;
    }
  }
</style>
