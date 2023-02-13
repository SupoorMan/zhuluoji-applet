import { defineStore } from 'pinia';
import { getUserIofo } from '../api/user.js'
import { getTodaySign } from '@/api/signIn.js'
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
		getUser() {
			getUserIofo().then(res => {
				if (res.code === 200) {
					this.user = res.data
					// 查询用户是否签到
					getTodaySign().then(res => {
						if (res.code === 200) {
							this.updateSign(!!res.data)
						}
					})
				}
			})
		},
		updateSign(data) {
			this.todayIsSign = data
		},
	}
})
