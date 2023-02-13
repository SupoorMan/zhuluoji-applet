// import App from './App'
// import request from './api/index.js'
// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// const pinia = createPinia()
// App.mpType = 'app'
// const app = createApp(App)
// app.config.globalProperties.$request = request
// app.mount()
// app.use(pinia)
import App from './App'
import request from './api/index.js'
import dialog from "./utils/dialog.js";
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
// #ifndef VUE3
import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
const pinia = createPinia()
Vue.use(PiniaVuePlugin)
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$dialog = dialog
App.mpType = 'app'
const app = new Vue({
	...App,
	pinia
})
app.$mount()
// #endif
// #ifdef VUE3
import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$request = request
	app.config.globalProperties.$dialog = dialog
	app.use(createPinia())
	return {
		app
	}
}
// #endif
