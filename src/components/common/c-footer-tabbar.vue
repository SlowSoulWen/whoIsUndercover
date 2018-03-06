<template>
  <div id="c-footer-tabbar">
    <div v-for="(item, index) in tabbarItems"
         class="tabbar-item" 
         :class="{ active: active === item.name }"
         @click="to(item.name)">
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="item.icon"></use>
      </svg>
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>

<script>
  const tabbarItems = [
    {
      title: '首页',
      icon: '#icon-iconfontyouxihudong',
      name: 'home-page' // vue-router的name属性，用于路由跳转
    }, {
      title: '房间',
      icon: '#icon-solid-home',
      name: 'rooms-list'
    }, {
      title: '个人',
      icon: '#icon-solid-person',
      name: 'home-person'
    }
  ]
  export default {
    data () {
      return {
        tabbarItems,
        active: ''
      }
    },
    created () {
      this.active = this.$route.name
    },
    watch: {
      $route (newRoute) {
        this.active = newRoute.name
      }
    },
    methods: {
      to (name) {
        if (name) this.$router.replace({name})
      }
    }
  }
</script>

<style lang="less" scoped>
  #c-footer-tabbar {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    height: 5rem;
    background: #FECA5C;
    & > div {
      flex: 1;
      text-align: center;
      color: #ffffff;
      .icon {
        display: block;
        margin: 0 auto;
        margin-top: 5px;
        font-size: 2.8rem;
      }
    }
    .active {
      color: #1FAEF2;
    }
  }
</style>