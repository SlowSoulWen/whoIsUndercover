<template>
  <div id="home-homePage">
    <div class="fast-matching">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-renshu"></use>
      </svg>
      <span>快速匹配</span>
    </div>
    <div class="search-box">
      <input class="search-input" type="text">
      <input class='search-btn' type="button" value="加入房间">
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less" scoped>
  #home-homePage {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #FED681;
    background-image: repeating-linear-gradient(40deg, hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .1) 20px, transparent 0, transparent 40px);

    .fast-matching {
      width: 14em;
      height: 14em;
      background: linear-gradient(-45deg, #0C95D6, #43BCF4 70%);
      box-shadow: 0 0 0 6px rgba(41, 178, 243, 0.6),
                  0 0 0 12px rgba(97, 198, 246, 0.3);
      border-radius: 50%;
      margin: 0 auto;
      margin-top: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;

      & > span {
        font-size: 1.5em;
        font-weight: bolder;
      }

      .icon {
        font-size: 2.5em;
        display: block;
      }
    }

    .search-box {
      margin-top: 20%;

      .search-input {
        border-style: none;
        height: 20px;
        width: 50%;
        padding: 0.8em 2em;
        border-radius: 0.6em;
        font-size: 1em;
        border: 3px solid rgba(38, 168, 228, 1);
      }

      .search-btn {
        width: 25%;
        font-size: 1.2rem;
        height: 48px;
        border-style: none;
        background-color: #1292CF;
        color: #ffffff;
      }
    }
  }
</style>