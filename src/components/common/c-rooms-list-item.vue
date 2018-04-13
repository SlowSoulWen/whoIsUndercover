<template>
  <div class="c-rooms-list-item">
    <div class="room-name-box">
      <span class="name">{{ roomData.roomName }}</span>
    </div>
    <div class="room-content-box">
      <ul>
        <li class="status">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-kaishi"></use>
          </svg>
          <span>房间状态：{{ roomData.status }}</span>
        </li>
        <li class="player-number">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-renshu"></use>
          </svg>
          <span>房间人数：{{ roomData.player.length }} / {{ roomData.playerMaxNum }}</span>
        </li>
      </ul>
      <div class="join-box">
        <c-button class="join-btn" text="进入房间" size="sm" bgColor="#2DB5AB" @onClick="joinRoom"></c-button>
      </div>
    </div>
  </div>
</template>

<script>
  import cButton from '@common/c-button'
  export default {
    props: {
      roomData: {
        type: Object,
        default: {}
      }
    },
    methods: {
      joinRoom () {
        this.$router.push({
          name: 'room',
          params: {
            id: this.roomData.id
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
  .c-rooms-list-item {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.2);
    width: 85%;
    height: 110px;
    border-radius: 1em;
    background-color: #ffffff;
    overflow: hidden;

    .room-name-box {
      box-sizing: border-box;
      width: 100%;
      padding: 0.2em 1em;
      background: #F78CA7;

      & > span {
        color: #ffffff;
        font-size: 1.2rem;
      }
    }

    .room-content-box {
      flex: 1;
      width: 100%;
      display: flex;
      & > ul {
        width: 50%;
        padding: 0 1em;
        li {
          font-size: 1.2rem;
          color: #5FC5F6;
          padding: 0.3em;
        }
      }
      .join-box {
        flex: 1;
        text-align: center;
        .join-btn {
          margin-top: 1.3em;
        }
      }
    }
  }
</style>