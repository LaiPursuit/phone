<template>
  <div class="navbar">
    <div style="height:50px"></div>
    <van-tabbar v-model="active" @change="onChange" route>
      <van-tabbar-item v-for="(n,item) in navs" :to="n.path" :key="item" :icon="n.icon">{{n.content}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: this.$route.path,
      navs: [
        {
          icon: "home-o",
          content: "主页",
          title: "靓号(标题)",
          path:"/"
        },
        {
          icon: "star-o",
          content: "收藏夹",
          title: "收藏夹",
          path:"/collection"
        },
        {
          icon: "phone",
          content: "咨询",
          title: "在线咨询",
          path:"/advisory"
        },
      ],
    };
  },
  methods:{
    onChange(){
      this.$store.state.title=this.navs[this.active].title;
    }
  }
};
</script>

<style>
</style>
