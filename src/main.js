import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import Vant from 'vant';
import axios from 'axios';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
