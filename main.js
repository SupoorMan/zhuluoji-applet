import App from './App'
import request from './api/index.js'
import Vue from 'vue'
// import {
// 	createPinia
// } from 'pinia'

Vue.config.productionTip = false
App.mpType = 'app'
// const pinia = createPinia()
Vue.prototype.$request = request

const app = new Vue({
	...App,
	// pinia
})
app.$mount()
