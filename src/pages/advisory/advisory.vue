<template>
  <div class="advisory">
    <div class="card">
      <div class="a-box">
        <van-image
          fit="cover"
          round
          width="10vw"
          height="10vw"
          :src="require('../../assets/phone.png')"
        />
        <div class="a-p">
          <p class="a-p-h">15779866669</p>
          <p class="a-p-p">手机客服</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="a-box">
        <van-image
          fit="cover"
          round
          width="10vw"
          height="10vw"
          src="https://img.yzcdn.cn/vant/share-icon-wechat.png"
        />
        <div class="a-p">
          <p class="a-p-h">15779866669</p>
          <p class="a-p-p">专享客服</p>
        </div>
      </div>
      <van-empty :image="img" description="长按二维码咨询您的专属客服" />
    </div>
    <navbar />
  </div>
</template>
<style>
.a-box {
  padding: 20px 10px;
  vertical-align: center;
}
.a-p{
  margin-left: 5vw;
  display: inline-block;
  vertical-align: center;
}
.a-p-h{
  margin: 0;
  color: #111;
}
.a-p-p{
  margin: 0;
  color: #555;
}
</style>
<script>
import navbar from "../../components/navbar";
export default {
  components: {
    navbar,
  },
  data() {
    return {
      img: require("../../assets/wx.jpg"),
    };
  },
};
</script>