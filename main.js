import App from './App'
import request from './api/index.js'

import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$request = request

const app = new Vue({
	...App
})
app.$mount()
