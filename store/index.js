import { defineStore } from 'pinia';
import { getUserIofo } from '../api/user.js'
export const userStore = defineStore('user', {
	state: () => {
		return {
			user: null,
			todayIsSign: false // 今日是否签到
		}
	},
	actions: {
		setUser(data) {
			this.user = data
		},
		getUser(data) {
			getUserIofo().then(res => {
				if (res.code === 200) {
					this.user = res.data
				}
			})
		},
		updateSign(data) {
			this.todayIsSign = data
		},
	}
})
