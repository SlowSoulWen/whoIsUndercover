<template>
  <div id="home-list">
    <scroller :on-infinite="infiniteCoursesList" ref="scroller">
      <c-rooms-list-item class="room-item" v-for="(item, index) in roomList" :key="index" :roomData="item"></c-rooms-list-item>
    </scroller>
  </div>
</template>

<script>
  import cRoomsListItem from '@common/c-rooms-list-item'
  import { roomModel } from '@src/config/request-map'

  export default {
    data () {
      return {
        pageIndex: 1,
        noMoreData: false,
        roomList: []
      }
    },
    async created () {
      let data = (await roomModel.getRoomsList({pageIndex: this.pageIndex})).data
      this.roomList = data.data
    },
    methods: {
      async infiniteCoursesList (done) {
        if (this.noMoreData) {
          this.$refs.scroller.finishInfinite()
          return
        }
        this.$refs.scroller.finishInfinite()
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