<template>
  <div class="collection">
    <div class="card" style="height:80vh">
      <van-empty v-show="!cl_list.length" description="暂无收藏" style="height:60vh" />
      <table v-if="cl_list.length" class="p-tab">
        <tbody class="p-tab-body">
          <router-link
            :to="'/phone?number='+l.number"
            v-for="(l,item) in cl_list"
            :key="item"
          >
            <tr class="p-tab-tr">
              <td style="width:35%">{{l.number}}</td>
              <td style="width:32%">{{l.info.substring(0,l.info.length-2)}}</td>
              <td style="width:10%">{{l.info.substring(l.info.length-2, l.info.length)}}</td>
              <td style="width:23%" class="price">{{l.price}}</td>
            </tr>
          </router-link>
        </tbody>
      </table>
    </div>
    <navbar/>
  </div>
</template>
<script>
import { Dialog } from "vant";
import navbar from "../../components/navbar";
export default {
  components:{
    navbar
  },
  data() {
    return {
      collections: this.$store.state.collections,
      cl_list: [],
      sign: "awds12k0kj8jt6yjyjki888ij1s3e00d",
    };
  },
  created() {
    if (this.collections.length) {
      var param = {};
      this.$set(param, "type", 1);
      this.$set(param, "numbers", this.collections);
      this.$set(param, "domain", "sq.dslhao.com");
      this.npost(param);
    }
  },
  methods: {
    npost(param) {
      var date = require("silly-datetime");
      var aDate = date.format(new Date(), "YYYYMMDD");
      var aSign = this.sign;
      var aParam = JSON.stringify(param);
      var url = "http://api.dslhao.com/api/collection/list";
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
            _this.cl_list = response.data.data.list;
          } else if (response.data.flag == "1002") {
            _this.sign = response.data.data.substring(5, 37);
            _this.npost(param);
          } else {
            Dialog({ message: "数据好像出现了点小问题……" });
          }
        })
        .catch(function (error) {
          Dialog({ message: "数据好像出现了点小问题……" });
          console.log(error);
        });
    },
  },
};
</script>