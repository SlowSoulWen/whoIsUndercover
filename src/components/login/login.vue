<template>
  <div id="login">
    <div class="login-box">
      <div class="content-box">
        <div class="title">
          <h3>登录</h3>
        </div>
        <div class="form-item">
          <span class="name">账号</span>
          <input class="input name-input" type="text" v-model="form.account">
        </div>
        <div class="form-item">
          <span class="password">密码</span>
          <input class="input pwd-input" type="password" v-model="form.password">
        </div>
      </div>
      <button class='login-btn btn' type="button" @click="login">登录</button>
      <button class='register-btn btn' type="button" @click="register">我要注册</button>
    </div>
  </div>
</template>

<script>
import { userModel } from '@src/config/request-map'

export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      let res = (await userModel.login(this.form)).data
      if (res.errno) {
        this.$vux.alert.show({
          title: '提示',
          content: res.data
        })
        return false
      }
      this.$store._mutations['User/storeUserDetail'][0](res.data)
      this.$vux.toast.show({
        text: '登录成功'
      })
      this.$router.replace({
        name: 'home-person'
      })
    },
    register () {
      this.$router.push({
        name: 'register'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #login {
    height: 100%;
    width: 100%;
    background: @global-green;
    padding-top: 8rem;

      .login-box {
        width: 100%;

        .content-box {
          width: 80%;
          margin: 0 auto;
          padding: 4rem 0;
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

        .login-btn, .register-btn {
          width: 60%;
          display: block;
          margin: 0 auto;
          height: 55px;
          font-size: 1.5em;
          margin-top: 1em;
          box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3); 
          border-radius: 0.7em;
        }

        .login-btn {
          background-color: #1292CF;
          background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
        }

        .register-btn {
          background-color: @global-pink;
          background: linear-gradient(-45deg, @global-pink, @global-pink - #333 70%);
        }
      }
  }
</style>
