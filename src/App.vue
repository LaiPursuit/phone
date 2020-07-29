<template>
  <div id="app">
    <van-sticky>
      <van-nav-bar
        :title="this.$store.state.title"
        :left-text="istitile.includes(this.$store.state.title)?'':'返回'"
        :left-arrow="!(istitile.includes(this.$store.state.title))"
        @click-left="onClickLeft"
      />
    </van-sticky>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.commit("getCollection");
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
  data(){
    return{
      istitile:[
        "靓号(标题)","在线咨询","收藏夹"
      ]
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.card {
  border-radius: 10px;
  background: #fff;
  margin: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 12px #ebedf0;
}
.p-tab {
  width: 100%;
}
.p-tab-body {
  display: block;
  position: relative;
  padding: 10px;
}
.p-tab-tr {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}
.p-tab-tr td {
  display: inline-block;
  color: #555;
  font-size: 4vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  padding: 0;
}
.p-tab-tr .price {
  font-size: 5vw;
  color: #f52346;
  text-align: right;
}
.p-tab-tr .price::before {
  content: "￥";
  font-size: 3vw;
}
</style>
