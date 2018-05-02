<template>
  <div id="register">
    <div class="form-item" @click="chooseImage">
      <c-avatar class="avatar" :src="form.avator"></c-avatar>
    </div>
    <div class="form-item">
      <span class="name">你的账号</span>
      <input class="input name-input" type="text" v-model="form.account">
    </div>
    <div class="form-item">
      <span class="name">你的昵称</span>
      <input class="input name-input" type="text" v-model="form.nickname">
    </div>
    <div class="form-item">
      <span class="name">你的密码</span>
      <input class="input name-input" type="password" v-model="form.password">
    </div>
    <div class="form-item">
      <span class="name">确认密码</span>
      <input class="input name-input" type="password" v-model="repassword">
    </div>
    <button class='register-btn btn' type="button" @click="register">注册</button>
  </div>
</template>

<script>
import cAvatar from '@common/c-avatar'
import { userModel } from '@src/config/request-map'
import { chooseImageByBase64 } from '@src/config/wechat-api'

export default {
  data () {
    return {
      form: {
        nickname: '',
        account: '',
        password: '',
        avator: ''
      },
      repassword: ''
    }
  },
  methods: {
    async chooseImage () {
      let url = await chooseImageByBase64({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      if (url) this.form.avator = url
    },
    async register () {
      if (!this.form.nickname || !this.form.account || !this.form.password || !this.repassword) {
        this.$vux.toast.show({
          text: '请完善注册表单',
          type: 'warn'
        })
        return false
      } else if (this.form.password !== this.repassword) {
        this.$vux.toast.show({
          text: '两次密码输入不一致',
          type: 'warn'
        })
        return false
      }
      let res = (await userModel.register(this.form)).data
      if (res.errno) {
        this.$vux.alert.show({
          title: '提示',
          content: res.data
        })
        return false
      }
      let user = res.data
      this.$store._mutations['User/storeUserDetail'][0](user)
      this.$vux.toast.show({
        text: '注册成功！'
      })
      setTimeout(() => {
        this.$router.push({
          name: 'home-person'
        }, 1500)
      })
    }
  },
  components: {
    cAvatar
  }
}
</script>

<style lang="less" scoped>
  #register {
    width: 100%;
    height: 100%;
    background: @global-green;
    padding-top: 50px;

    .form-item {
      padding: 10px;
      font-size: 1.2rem;
    }

    .avatar {
      display: block;
      margin: 0 auto;
      overflow: hidden;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      border: 1px solid @global-pink;
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
        background: @global-pink;

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

      & > .input {
        width: 70%;
        border-style: none;
        outline: none;
        vertical-align: bottom;
        padding: 0.5rem 1rem;
        font-weight: bolder;
        font-size: 1em;
        border-bottom: 2px solid #F78CA7;
        background: @global-green;
        color: #fff;
      }
    }

    .register-btn {
      width: 60%;
      display: block;
      margin: 0 auto;
      height: 55px;
      font-size: 1.5em;
      margin-top: 2em;
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3); 
      border-radius: 0.7em;
      background-color: #1292CF;
      background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
    }
  }
</style>
