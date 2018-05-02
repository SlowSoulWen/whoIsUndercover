<template>
  <div id="off-line-game-2">
    <scroller ref="scroller">
      <div class="gamer-content">
        <div class="gamer-box" v-for="(item, index) in players" :key="index" @click="select(index)">
          <img class="avatar" src="../../assets/underCover.jpg" alt="">
          <span>{{ index + 1 }}号玩家</span>
          <span class="indenty" v-show="item.isOut">身份: {{ item.indenty === 0 ? '平民' : '卧底' }}</span>
          <div class="mask" v-show="item.show">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gou1"></use>
            </svg>
          </div>
          <svg class="icon" aria-hidden="true" v-show="item.isOut">
            <use xlink:href="#icon-chacha"></use>
          </svg>
        </div>
      </div>
      <button class="btn eliminate-btn" @click="eliminate" :class="{ 'disable-btn': !isSelect }">确认淘汰</button>
    </scroller>
  </div>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      default: function () {
        return [
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '庞统',
            indenty: 1
          },
          {
            keyword: '庞统',
            indenty: 1
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          },
          {
            keyword: '庞统',
            indenty: 1
          },
          {
            keyword: '庞统',
            indenty: 1
          },
          {
            keyword: '诸葛亮',
            indenty: 0
          }
        ]
      }
    },
    indenty: {
      type: Array,
      default: function () {
        return ['诸葛亮', '庞统']
      }
    }
  },
  data () {
    return {
      isSelect: false,
      selectIndex: -1
    }
  },
  mounted () {
    this.$vux.alert.show({
      title: '环节二',
      content: '玩家轮流发言，每轮投票选出要淘汰的玩家'
    })
  },
  methods: {
    select (index) {
      if (this.players[index].isOut) return false
      this.players.forEach((player) => {
        if (player.show) player.show = false
      })
      this.$set(this.players[index], 'show', true)
      this.isSelect = true
      this.selectIndex = index
    },
    eliminate () {
      if (!this.isSelect) {
        this.$vux.alert.show({
          title: '提示',
          content: '请先选择要淘汰的玩家'
        })
        return false
      }
      this.players[this.selectIndex].show = false
      this.isSelect = false
      this.$set(this.players[this.selectIndex], 'isOut', true)
      let noOutNum = 0
      this.players.forEach((player) => {
        if (!player.isOut) noOutNum++
      })
      let hasUndercover = this.players.some((player) => {
        return !player.isOut && player.indenty === 1
      })
      if (!hasUndercover) { // 卧底全部被淘汰，平民胜利
        this.$vux.alert.show({
          title: '平民胜利',
          content: `平民身份：${this.indenty[0]}  卧底身份：${this.indenty[1]}`
        })
      } else if (noOutNum <= 3) { // 卧底撑到最后三人，卧底胜利
        this.$vux.alert.show({
          title: '卧底胜利',
          content: `平民身份：${this.indenty[0]}  卧底身份：${this.indenty[1]}`
        })
      } else {
        this.$vux.alert.show({
          title: `${this.selectIndex + 1}号玩家被淘汰了`,
          content: `Ta的身份是：${this.players[this.selectIndex].indenty === 0 ? '平民' : '卧底'}`
        })
        this.selectIndex = -1
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #off-line-game-2 {
    width: 100%;
    height: 100%;
    background: @global-blue;
    position: relative;

    .gamer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .gamer-box {
        width: 22%;
        margin: 10px 2px;
        height: 100px;
        background: #fff;
        text-align: center;
        border-radius: 1em;
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;

        & > .icon {
          font-size: 40px;
          color: @global-pink;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translate(-50%, 0);
        }

        .avatar {
          display: block;
          width: 50%;
          margin: 5px auto;
        }

        .indenty {
          display: block;
          margin: 5px auto;
        }

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);

          & > .icon {
            font-size: 40px;
            color: @global-green;
            margin-top: 20px;
          }
        }
      }
    }

    .eliminate-btn {
      width: 40%;
      height: 60px;
      line-height: 60px;
      font-size: 1.5rem;
      color: #fff;
      background: @global-green;
      display: block;
      margin: 20px auto;
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
    }

    .disable-btn {
      background: #666;
    }
  }
</style>

