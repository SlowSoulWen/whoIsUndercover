<template>
  <div id="home-list">
    <scroller :on-infinite="infiniteCoursesList" ref="scroller">
      <c-rooms-list-item class="room-item" v-for="(item, index) in testData" :key="index" :roomData="item"></c-rooms-list-item>
    </scroller>
  </div>
</template>

<script>
  import cRoomsListItem from '@common/c-rooms-list-item'
  export default {
    data () {
      return {
        testData: [
          {
            roomName: '这是测试用的房间名',
            status: 1, // 1.等待中, 2.游戏中, 3.已废弃
            playersNum: 3,
            playerMaxNum: 5
          },
          {
            roomName: '这是测试用的房间名2',
            status: 2, // 1.等待中, 2.游戏中, 3.已废弃
            playersNum: 5,
            playerMaxNum: 5
          }
        ]
      }
    },
    methods: {
      infiniteCoursesList (done) {
        done()
      }
    },
    components: {
      cRoomsListItem
    }
  }
</script>

<style lang="less" scoped>
  #home-list {
    .room-item {
      margin: 25px auto;
    }
  }
</style>

<style lang="less">
  @import '~@src/styles/mixin.less';
  #home-list {
    ._v-container {
      .bg-stripe(#58C2F5, 45deg);
    }
  }
</style>