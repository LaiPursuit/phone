<template>
  <div>
    <div class="card">
      <div class="phone-box">{{detail.number}}</div>
      <table class="p-tab">
        <tbody class="p-tab-body">
          <tr class="p-tab-tr">
            <td style="width:40%">归属地</td>
            <td style="width:60%">{{detail.regional}}</td>
          </tr>
          <tr class="p-tab-tr">
            <td style="width:40%">运营商</td>
            <td style="width:60%">{{detail.operator}}</td>
          </tr>
          <tr class="p-tab-tr" v-for="(l,item) in detail.info" :key="item">
            <td style="width:40%">{{l.name}}</td>
            <td :class="l.name=='价格'?'price':''" style="width:60%;text-align: left;">{{l.content}}</td>
          </tr>
          <tr class="p-tab-tr">
            <td style="width:40%">详细介绍</td>
            <td style="width:60%">{{detail.detail}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <p class="p-p">交易流程</p>
      <div class="step">
        <div class="step-item">
          <van-icon name="completed" size="6vw" />
          <p>选好下单</p>
          <div class="step-line"></div>
        </div>
        <div class="step-item">
          <van-icon name="service-o" size="6vw" />
          <p>客服联系</p>
          <div class="step-line"></div>
        </div>
        <div class="step-item">
          <van-icon name="description" size="6vw" />
          <p>确认细节</p>
          <div class="step-line"></div>
        </div>
        <div class="step-item">
          <van-icon name="passed" size="6vw" />
          <p>安排过户</p>
        </div>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon icon="home-o" text="首页" @click="toHome" />
      <van-goods-action-icon
        :color="$store.state.collections.includes(detail.number)?'#ff5000':''"
        icon="star-o"
        :text="$store.state.collections.includes(detail.number)?'已收藏':'收藏'"
        @click="toCollection"
      />
      <van-goods-action-icon icon="circle" text="分享" @click="toShare" />
      <van-goods-action-button type="danger" text="咨询优惠" @click="onGo" />
    </van-goods-action>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="share_op" @select="Share" />
  </div>
</template>
<style>
.phone-box {
  padding: 20px 30px;
  color: #ffffff;
  font-size: 30px;
  font-weight: 600;
  background-size: 100vw 100%;
  background-image: linear-gradient(90deg, #ff8c40, #ff4040, #ff8c40);
  text-align: center;
  animation: lg 2s ease-in-out infinite;
}
@keyframes lg {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100vw 0;
  }
}
.step {
  position: relative;
  padding: 10px;
  font-size: 4vw;
  margin-bottom: 10px;
}
.step-item {
  position: relative;
  width: 25%;
  text-align: center;
  display: inline-block;
}
.step p {
  margin: 0;
  font-size: 3vw;
}
.step-line {
  position: absolute;
  top: 25%;
  left: 75%;
  width: 50%;
  height: 0.4vw;
  border-radius: 0.4vw;
  background: #dedede;
}
</style>
<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      detail: {},
      sign: "adwx892jsnajwadask21sjnkkja9012s",
      showShare: false,
      share_op: [
        { name: "微信", icon: "wechat" },
        { name: "复制链接", icon: "link" },
      ],
    };
  },
  created() {
    var param = { number: this.$route.query.number, domain: "sq.dslhao.com" };
    this.npost(param);
    this.$store.commit("getCollection");
    this.$store.state.title = "靓号详情";
  },
  methods: {
    npost(param) {
      var date = require("silly-datetime");
      var aDate = date.format(new Date(), "YYYYMMDD");
      var aSign = this.sign;
      var aParam = JSON.stringify(param);
      var url = "http://api.dslhao.com/api/mobile/detail";
      var _this = this;
      this.$axios({
        method: "post",
        url: url,
        data: { date: aDate, sign: aSign, param: aParam },
        transformRequest: [
          function (data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            ret = ret.substring(0, ret.lastIndexOf("&"));
            return ret;
          },
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
        .then(function (response) {
          if (response.data.flag == "0") {
            _this.detail = response.data.data;
          } else if (response.data.flag == "1002") {
            _this.sign = response.data.data.substring(5, 37);
            _this.npost(param);
          } else {
            console.log(response);
            Dialog({ message: "数据好像出现了点小问题……" });
          }
        })
        .catch(function (error) {
          Dialog({ message: "数据好像出现了点小问题……" });
          console.log(error);
        });
    },
    toCollection() {
      this.$store.commit("setCollection", this.detail.number);
    },
    toHome() {
      this.$router.push("/");
    },
    toShare() {
      this.showShare = true;
    },
    Share(option) {
      this.showShare = false;
      var o = option;
      console.log(option);
      if (o.name == "微信") {
        Dialog({ message: "请点击微信右上角进行分享~" });
      } else {
        this.$copyText(window.location.href);
      }
    },
    onGo() {
      this.$router.push("/advisory");
    },
  },
};
</script>