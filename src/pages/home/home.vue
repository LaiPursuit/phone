<template>
  <div class="home">
    <div class="card">
      <van-tabs v-model="pnc_active" color="#1989fa">
        <van-tab title="精准搜号">
          <p class="p-p">*请在指定位置上填写数字，无要求的位置可留空</p>
          <div class="p-box">
            <input
              type="number"
              maxlength="1"
              class="p-input"
              v-for="(i,t) in 11"
              :key="t"
              v-model="phoneNumber[t]"
              :disabled="t==0 ? true : false"
            />
          </div>
          <van-button style="width:40%;margin:5%" @click="pn_r">重置</van-button>
          <van-button style="width:40%;margin:5%;" type="info" @click="post">搜索</van-button>
        </van-tab>
        <van-tab title="任意搜号">
          <p class="p-p">*11位手机号码任意位置匹配数字搜索</p>
          <van-search type="number" v-model="phoneNumber2" placeholder="请输入喜欢的数字" />
          <van-button style="width:40%;margin:5%" @click="pn2_r">重置</van-button>
          <van-button style="width:40%;margin:5%;" type="info" @click="post">搜索</van-button>
        </van-tab>
        <van-tab title="末位搜号">
          <p class="p-p">*11位手机号码末尾数字匹配搜索</p>
          <van-search type="number" v-model="phoneNumber3" placeholder="请输入喜欢的数字" />
          <van-button style="width:40%;margin:5%" @click="pn3_r">重置</van-button>
          <van-button style="width:40%;margin:5%;" type="info" @click="post">搜索</van-button>
        </van-tab>
      </van-tabs>
    </div>

    <div class="card">
      <van-sticky :offset-top="44">
        <van-dropdown-menu>
          <van-dropdown-item title="运营商" v-model="ope_v" @close="post" :options="operators" />
          <van-dropdown-item title="归属地" @close="post" ref="aread">
            <van-area
              :area-list="areaList"
              :columns-num="2"
              @change="changeArea"
              @confirm="$refs.aread.toggle()"
              :value="area"
              :columns-placeholder="['请选择', '请选择']"
              cancel-button-text=" "
            />
          </van-dropdown-item>
          <van-dropdown-item title="规则" v-model="mR_v" @close="post" :options="mRules" />
          <van-dropdown-item title="更多" ref="more" @close="post">
            <van-cell-group title="价格">
              <van-checkbox-group class="p-box" direction="horizontal" ref="pay" v-model="pay_v">
                <van-checkbox v-for="(p,item) in pays" :key="item" :name="p.id">{{p.name}}</van-checkbox>
              </van-checkbox-group>
            </van-cell-group>
            <van-cell-group title="偏好">
              <van-checkbox-group direction="horizontal" ref="like" v-model="like_v">
                <van-checkbox v-for="(l,item) in likes" :key="item" :name="l.id">{{l.name}}</van-checkbox>
              </van-checkbox-group>
              <van-checkbox-group direction="horizontal" ref="f" v-model="f_v">
                <van-checkbox v-for="(f,item) in f" :key="item" :name="f.id">{{f.name}}</van-checkbox>
              </van-checkbox-group>
              <input
                type="number"
                style="width:85%;margin:5px 15px;border:1px solid #ddd;padding:5px 10px;border-radius:3px;"
                v-model="exclude"
                placeholder="输入不想要的数字"
              />
              <br />
            </van-cell-group>
            <van-button style="width:40%;margin:5%" @click="more_r">重置</van-button>
            <van-button style="width:40%;margin:5%;" type="info" @click="more_over">确认</van-button>
          </van-dropdown-item>
          <van-dropdown-item title="排序" v-model="sort_v" @close="post" :options="sorts" />
        </van-dropdown-menu>
      </van-sticky>
      <van-empty v-show="!this.pn_list.length" description="抱歉，未找到您想要的号码" />
      <van-list
        v-show="this.pn_list.length"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="lpost"
      >
        <table class="p-tab">
          <tbody class="p-tab-body">
            <router-link :to="'/phone?number='+p.number" animationType='pop-in' v-for="(p,item) in pn_list" :key="item">
              <tr class="p-tab-tr">
                <td style="width:35%">{{p.number}}</td>
                <td style="width:32%">{{p.info}}</td>
                <td style="width:10%">{{p.operator}}</td>
                <td style="width:23%" class="price">{{p.price}}</td>
              </tr>
            </router-link>
          </tbody>
        </table>
      </van-list>
    </div>

    <navbar/>
  </div>
</template>
<style>
.p-box {
  display: flex;
  justify-content: space-around;
  padding: 2vw 0;
}
.p-input {
  border: 1px solid #ddd;
  border-radius: 0.533vw;
  color: #403f3f;
  font-size: 5.333vw;
  height: 7vw;
  text-align: center;
  width: 7vw;
  display: inline-block;
}
.p-p {
  color: #767676;
  font-size: 4vw;
  padding: 0 3vw;
}
</style>
<script>
import { Dialog } from "vant";
import navbar from "../../components/navbar";
export default {
  components:{
    navbar
  },
  data() {
    return {
      pnc_active: 0,
      phoneNumber: ["1", "", "", "", "", "", "", "", "", "", ""],
      phoneNumber2: "",
      phoneNumber3: "",
      showKeyboard: false,
      errorInfo: "",
      ope_v: 0,
      area: "",
      mR_v: 0,
      pay_v: [],
      like_v: [],
      f_v: [],
      exclude: "",
      sort_v: "1",
      pn_list: [],
      loading: false,
      finished: false,
      start: 0,
      sign: "asdasdfad42wdaw3aee32addj7tsdw1",
      param: {},
    };
  },
  methods: {
    post() {
      let param = {};
      let rule = [];
      //归属地
      if (this.area) {
        let regional = this.area;
        this.$set(param, "regional", regional);
      }
      //运营商
      if (this.ope_v) {
        let operator = ["1", this.ope_v];
        rule.push(operator);
      }
      //规则
      if (this.mR_v != 0) {
        let mRs = ["2", this.mR_v];
        rule.push(mRs);
      }
      //价格
      if (this.pay_v.length >= 1) {
        let i = this.pay_v.length;
        while (i >= 1) {
          let pay = ["3", this.pay_v[i - 1]];
          rule.push(pay);
          i--;
        }
      }
      //偏好
      if (this.like_v.length >= 1) {
        let i = this.like_v.length;
        while (i >= 1) {
          let lik = ["4", this.like_v[i - 1]];
          rule.push(lik);
          i--;
        }
      }
      //风水号
      if (this.f_v.length >= 1) {
        let i = this.f_v.length;
        while (i >= 1) {
          let f = ["5", this.f_v[i - 1]];
          rule.push(f);
          i--;
        }
      }
      //排序
      if (this.sort_v != "1") {
        let s = ["6", this.sort_v];
        rule.push(s);
      }
      this.$set(param, "rule", rule);
      //电话号码
      let typeinfo = "";
      if (this.pnc_active == 0) {
        let i = 0;
        while (i < 11) {
          if (this.phoneNumber[i] == "") {
            this.$set(this.phoneNumber, i, "x");
          }
          typeinfo = typeinfo + this.phoneNumber[i];
          i++;
        }
      } else if (this.pnc_active == 1) {
        typeinfo = this.phoneNumber2;
      } else {
        typeinfo = this.phoneNumber3;
      }
      this.$set(param, "type", this.pnc_active + 1);
      this.$set(param, "typeinfo", typeinfo);
      this.start = 0;
      this.$set(param, "domain", "sq.dslhao.com");
      this.param = param;
      this.gpost(param, 0);
    },
    gpost(param, m) {
      var date = require("silly-datetime");
      var aDate = date.format(new Date(), "YYYYMMDD");
      var aSign = this.sign;
      var aParam = JSON.stringify(param);
      var url = "http://api.dslhao.com/api/mobile/list";
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
            if (m == 0) {
              _this.pn_list = response.data.data.list;
            } else {
              if (response.data.data.list.length) {
                for (var i = 0; i < response.data.data.list.length; i++) {
                  _this.pn_list.push(response.data.data.list[i]);
                }
              } else {
                _this.finished = true;
              }
              _this.loading = false;
            }
          } else if (response.data.flag == "1002") {
            _this.sign = response.data.data.substring(5, 37);
            _this.gpost(param, m);
          } else {
            Dialog({ message: "数据好像出现了点小问题……" });
          }
        })
        .catch(function (error) {
          Dialog({ message: "数据好像出现了点小问题……" });
          console.log(error);
        });
    }, //获取
    lpost() {
      this.start = this.start + 20;
      this.$set(this.param, "start", this.start);
      this.gpost(this.param, 1);
    },
    changeArea(picker, value, index) {
      console.log(index)
      if (value[1].code) {
        this.area = value[1].code;
      } else {
        this.area = value[0].code;
      }
    },
    more_r() {
      this.$refs.pay.toggleAll(false);
      this.$refs.like.toggleAll(false);
      this.$refs.f.toggleAll(false);
    },
    more_over() {
      this.$refs.more.toggle();
    },
    pn_r() {
      this.phoneNumber = ["1", "", "", "", "", "", "", "", "", "", ""];
    },
    pn2_r() {
      this.phoneNumber2 = "";
    },
    pn3_r() {
      this.phoneNumber3 = "";
    },
  },
  computed: {
    areaList() {
      return this.$store.state.areaList;
    },
    mRules() {
      return this.$store.state.mRules;
    },
    operators() {
      return this.$store.state.operators;
    },
    pays() {
      return this.$store.state.pays;
    },
    likes() {
      return this.$store.state.likes;
    },
    f() {
      return this.$store.state.f;
    },
    sorts() {
      return this.$store.state.sorts;
    },
  },
  created() {
    this.post();
    var param = '{"domain":"sq.dslhao.com"}';
    this.$store.commit("getIndex", param);
    this.$store.state.title="靓号(标题)";
  },
};
</script>