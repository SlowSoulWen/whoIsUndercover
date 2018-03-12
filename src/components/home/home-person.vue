<template>
  <div id="home-person">
    <scroller :on-infinite="infiniteCoursesList" ref="scroller">
      <div class="mime-msg-box">
          <div class="avatar-box">
            <img class="avatar" src="http://oo917ps5l.bkt.clouddn.com/user.jpg" alt="">
          </div>
          <div class="msg-content">
            <span class="name">hhhhh</span>
            <div class="record">
              <div class="win">
                <span class="title">胜场</span>
                <span class="count">0</span>
              </div>
              <div class="lost">
                <span class="title">败场</span>
                <span class="count">0</span>
              </div>
            </div>
          </div>
      </div>
      <div class="history">
        <h3 class="title">历史战绩</h3>
        <div class="history-game-item" v-for="(item, index) in data" :key="index">
          <div class="game-content">
            <span class="name">测试测试测试的房间</span>
            <span class="time">2018-3-12</span>
            <span class="role">卧底</span>
          </div>
          <span class='result-icon'>获胜</span>
        </div>
        <div class="nothing" v-if="!data.length">暂无内容</div>
      </div>
    </scroller>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 8]
      }
    },
    methods: {
      infiniteCoursesList (done) {
        done()
      }
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

      .history-game-item {
        
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: 10px 5px;

        &::after {
          display: block;
          content: '';
          clear: both;
          visibility: hidden;
          overflow: hidden;
          height: 0;
        }

        .game-content {
          float: left;

          .name {
             display: block;            
             padding: 5px 3px;
            .addLabel('房间名', #1FAEF2);
          }

          .time {          
            display: inline-block;
            padding: 5px 3px;
            .addLabel('时间', #2DB5AB);
          }

          .role {
            display: inline-block;
            padding: 10px 3px;
            .addLabel('角色', #F78CA7);
          }
        }

        .result-icon {
          float: right;
          display: inline-block;
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          background: #1FAEF2;
          text-align: center;
          line-height: 3.5em;
          color: #ffffff;
          font-weight: bolder;
          transform: rotate(45deg);
        }

      }
    }
  }
</style>

<style lang="less">
  #home-person {
    @import '~@src/styles/mixin.less';
    ._v-container {
      padding-top: 80px;
      .bg-stripe(#3CCFC4, 45deg);
    }
  }
</style>