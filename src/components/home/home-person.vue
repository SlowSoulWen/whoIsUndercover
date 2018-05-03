<template>
  <div id="home-person">
    <scroller :on-infinite="infiniteCoursesList" ref="scroller">
      <div class="mime-msg-box">
          <div class="avatar-box">
            <c-avatar class="avatar" :src="avator"></c-avatar>
          </div>
          <div class="msg-content">
            <span class="name">{{nickname || '未登录'}}</span>
            <div class="record">
              <div class="win">
                <span class="title">胜场</span>
                <span class="count">{{winCount || 0}}</span>
              </div>
              <div class="lost">
                <span class="title">败场</span>
                <span class="count">{{failCount || 0}}</span>
              </div>
            </div>
          </div>
      </div>
      <div class="history" v-if="id">
        <h3 class="title">历史战绩</h3>
        <c-game-item v-for="(item, index) in record" :gameData="item" :key="index"></c-game-item>
        <div class="nothing" v-if="!record.length">暂无内容</div>
      </div>
      <button v-if="!id" class="login-btn btn" @click="toLogin">立即登录</button>
    </scroller>
  </div>
</template>

<script>
  import cGameItem from '@common/c-game-item'
  import { mapState } from 'vuex'
  import cAvatar from '@common/c-avatar'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState('User', [
        'id',
        'avator',
        'nickname',
        'winCount',
        'failCount',
        'record'
      ])
    },
    methods: {
      infiniteCoursesList (done) {
        done()
      },
      toLogin () {
        this.$router.push({
          name: 'login'
        })
      }
    },
    components: {
      cGameItem,
      cAvatar
    }
  }
</script>

<style lang="less" scoped>
  @import '~@src/styles/mixin.less';

  #home-person {
    flex: 1;

    .mime-msg-box, .history {
      position: relative;
      width: 80%;
      background: #ffffff;
      margin: 0 auto;
      padding-bottom: 20px;
      border-radius: 1em;
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
    }

    .mime-msg-box {

      .avatar-box {
        width: 6em;
        height: 6em;
        background: #ffffff;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-135deg);
        border-radius: 50%;
        box-shadow: 4px 4px 16px -1px rgba(0, 0, 0, 0.5);
        overflow: hidden;

        .avatar {
          width: 100%;
          transform: rotate(135deg)
        }
      }

      .msg-content {
        padding-top: 3.5em;
        text-align: center;

        span.name {
          font-size: 14px;
          font-weight: bolder;
        }

        .record {
          display: flex;
          width: 100%;
          justify-content: space-around;
          margin: 20px 0;

          & > div {
            position: relative;
            width: 35%;
            border-radius: 0.6em;
            transform: skewX(-35deg);
            text-align: left;
            overflow: hidden;

            &:first-child {
              background: #1FAEF2;
            }

            &:last-child {
              background: #F78CA7;
            }

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 60%;
              bottom: 0;
              background: hsla(0, 0%, 100%, .2)
            }
          }

          .title, .count {
            display: inline-block;
            transform: skewX(35deg);
            text-align: center;
            line-height: 40px;
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: bolder;
          }
          
          .title {
            width: 60%;

          }

          .count {
            width: 30%;
          }
        }
      }
    }

    .history {
      margin-top: 20px;

      .title {
        color: #1FAEF2;
        padding: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .nothing {
        height: 80px;
        text-align: center;
        line-height: 80px;
        color: #B8B8B8;
        font-size: 1.2rem;
      }
    }

    .login-btn {
      display: block;
      margin: 0 auto;
      margin-top: 50px;
      padding: 1.5rem 4rem;
      font-size: 1.5rem;
      background: @global-blue;
      box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.4);
    }
  }
</style>

<style lang="less">
  #home-person {
    @import '~@src/styles/mixin.less';
    ._v-container {
      padding-top: 80px;
      .bg-stripe(#3CCFC4, 45deg);

      & > ._v-content {
        padding-bottom: 80px;
      }
    }
  }
</style>