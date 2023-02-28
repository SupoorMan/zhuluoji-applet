import { defineStore } from 'pinia';
import { getUserIofo, getNoticeCount } from '../api/user.js'
import { getTodaySign } from '@/api/signIn.js'
export const userStore = defineStore('user', {
	state: () => {
		return {
			user: null,
			todayIsSign: false, // 今日是否签到
			noticeCount: 0 // 未读消息数量
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
					getNoticeCount().then(res => {
						if (res.code === 200) {
							this.updateNoticeCount(res.data)
						}
					})
				}
			})
		},
		updateSign(data) {
			this.todayIsSign = data
		},
		updateNoticeCount(data) {
			this.noticeCount = data
		},
	}
})
