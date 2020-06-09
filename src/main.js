// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

import 'styles/reset.css'
import 'styles/border.css'
import 'styles/iconfont.css'
import store from './store'
import axios from 'axios'

// // src/plugins/vuetify.js
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'

// Vue.use(Vuetify)

Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://101.200.120.102:8080'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  render: h => h(App)
})
