<template>
  <div id="home">
    <div class="logo-box">
      <img class="logo" src="../../assets/logo.png">
    </div>
    <c-button class="btn js-onLine" text="联机模式" @onClick="toHomeList"></c-button>
    <c-button class="btn js-offLine" text="聚会模式" @onClick="toOfLineGame"></c-button>
    <c-button class="btn end" text="离开游戏" @onClick="over"></c-button>
  </div>
</template>

<script>
  import anime from 'animejs'
  import cButton from '@common/c-button.vue'
  import { closeWindow } from '@src/config/wechat-api'

  export default {
    mounted () {
      this.setLogoAnimation()
      this.setButtonAnimation('#home .js-offLine', 300, 2000)
      this.setButtonAnimation('#home .js-onLine', -300, 2300)
      this.setButtonAnimation('#home .end', 300, 2600)
    },
    methods: {
      setLogoAnimation () {
        anime({
          targets: '.logo',
          translateY: [
            { value: -200, duration: 200 },
            { value: 100, duration: 1000 },
            { value: 0, duration: 800 }
          ],
          opacity: 1,
          rotate: '1turn',
          duration: 2000,
          delay: 500
        })
      },
      setButtonAnimation (target, translate, delay) {
        anime({
          targets: target,
          translateX: [
            { value: translate, duration: 100 },
            { value: 0, duration: 800 }
          ],
          opacity: 1,
          delay: delay
        })
      },
      toHomeList () {
        this.$router.push({name: 'home-index'})
      },
      toOfLineGame () {
        this.$router.push({name: 'off-line-home'})
      },
      over () {
        this.$vux.confirm.show({
          title: '离开游戏',
          content: '确定要离开游戏吗?',
          onConfirm () {
            closeWindow()
          }
        })
      }
    },
    components: {
      cButton
    }
  }
</script>

<style lang="less" scoped>
  #home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(-45deg, #FF995E, #FECA5C 80%, #FF995E);
    text-align: center;
    .logo {
      width: 70%;
      opacity: 0;
    }
    .btn {
      display: block;
      margin: 0 auto;
      opacity: 0;
      box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.2);
      margin-top: 2rem;
    }
  }
</style>
