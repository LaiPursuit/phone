import state from './state';
import { Dialog } from 'vant';
import axios from 'axios';
var date = require("silly-datetime");
const mutations = {
    getIndex(state, param) {
        var _this = this;
        var aDate = date.format(new Date(), 'YYYYMMDD');
        var aSign = state.sign;
        var aParam = param;
        var url = 'http://api.dslhao.com/api/index/index';
        axios({ method: 'post', url: url, data: { date: aDate, sign: aSign, param: aParam }, transformRequest: [function (data) { let ret = ''; for (let it in data) { ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&' } ret = ret.substring(0, ret.lastIndexOf('&')); return ret }], headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } })
            .then(function (response) {
                if (response.data.flag == '0') {
                    state.operators = response.data.data.rule[0].values;
                    state.mRules = response.data.data.rule[1].values;
                    state.pays = response.data.data.rule[2].values;
                    state.likes = response.data.data.rule[3].values;
                    state.f = response.data.data.rule[4].values;
                    state.sorts = response.data.data.rule[5].values;
                    _this.commit('IT');
                } else if (response.data.flag == '1002') {
                    console.log(response)
                    state.sign = response.data.data.substring(5, 37);
                    _this.commit('getIndex', param);
                } else {
                    Dialog({ message: '数据好像出现了点小问题……' })
                }
            })
            .catch(function (error) {
                Dialog({ message: '数据好像出现了点小问题……' });
                console.log(error)
            });
    },
    IT() {
        var l = state.operators.length;
        for (var i = 0; i < l; i++) {
            var o = state.operators[i].id;
            delete state.operators[i].id;
            state.operators[i].value = o;
            var o = state.operators[i].name;
            delete state.operators[i].name;
            state.operators[i].text = o;
        }
        var l = state.mRules.length;
        for (var i = 0; i < l; i++) {
            var o = state.mRules[i].id;
            delete state.mRules[i].id;
            state.mRules[i].value = o;
            var o = state.mRules[i].name;
            delete state.mRules[i].name;
            state.mRules[i].text = o;
        }
        var l = state.sorts.length;
        for (var i = 0; i < l; i++) {
            var o = state.sorts[i].id;
            delete state.sorts[i].id;
            state.sorts[i].value = o;
            var o = state.sorts[i].name;
            delete state.sorts[i].name;
            state.sorts[i].text = o;
        }
    },
    setCollection(state, n) {
        if (localStorage.collections) {
            var collections = JSON.parse(localStorage.collections);
        } else {
            var collections = [];
        }
        if (!collections.includes(n)) {
            collections.push(n);
            localStorage.collections = JSON.stringify(collections);
            this.commit('getCollection');
        }else{
            var m = collections.indexOf(n);
            collections.splice(m,1);
            localStorage.collections = JSON.stringify(collections);
            this.commit('getCollection');
        }
    },
    getCollection(state) {
        if (localStorage.collections) {
            state.collections = JSON.parse(localStorage.collections);
        } else {
            state.collections = [];
            localStorage.collections = "";
        }
        console.log(localStorage.collections);
        //localStorage.removeItem("collections");
    }
}

export default mutations