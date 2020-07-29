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
            <td style="width:60%">{{l.content}}</td>
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
      <van-steps active="-1" style="padding:0 20px">
        <van-step>
          <van-icon name="completed" size="6vw" />
        </van-step>
        <van-step>
          <van-icon name="service-o" size="6vw" />
        </van-step>
        <van-step>
          <van-icon name="description" size="6vw" />
        </van-step>
        <van-step>
          <van-icon name="passed" size="6vw" />
        </van-step>
      </van-steps>
      <div class="step">
        <span>选好下单</span>
        <span>客服联系</span>
        <span>确认细节</span>
        <span>安排过户</span>
      </div>
      <br />
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
  background-size: 60px 60px;
  background: linear-gradient(
    135deg,
    #fa7952 0%,
    #fa7952 25%,
    #faa352 25%,
    #faa352 50%,
    #fa7952 50%,
    #fa7952 75%,
    #faa352 75%,
    #faa352 100%
  );
  text-align: center;
  animation: lg 4s ease-in-out infinite;
}
@keyframes lg {
  0% {
  }
  50% {
    background-position: 60px 0;
  }
  100% {
    background-position: 0px 0;
  }
}
.step {
  padding: 10px;
  position: absolute;
  top: 70px;
  font-size: 4vw;
}
.step span {
  padding-right: 6vw;
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
        this.$copyText(window.location.href).then(
          function () {
            alert("Copied");
          },
          function () {
            alert("Can not copy");
          }
        );
      }
    },
    onGo() {
      this.$router.push("/advisory");
    },
  },
};
</script>