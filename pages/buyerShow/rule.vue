<template>
	<view class="show-page">
		<image :src="activity ? activity.images : ''" mode="widthFix" style="width: 100%;height: auto;" />
		<!-- 我的预约 -->
		<view class="join-btn" hover-class="navigator-hover" @tap="toAdd" v-if="showAdd">
			立&nbsp;即<br />参&nbsp;与
		</view>
	</view>
</template>

<script>
import { getActivity } from '@/api/activity'

import dayjs from 'dayjs'
export default {
	data() {
		return {
			activity: null,
			showAdd: false
		}
	},
	methods: {
		toAdd() {
			uni.navigateTo({
				url: '/pages/buyerShow/add?activityId=' + this.activity.id
			})
		},
		async getActList() {
			const { data } = await getActivity({ type: 1, status: 1, current: 1, pageSize: 1 })
			if (data.records && data.records.length > 0) {
				this.activity = data.records[0]
				// await this.getCurrentShows()
				const activityDate = data.records[0].days.split(',')
				const diffTime1 = dayjs().diff(dayjs(activityDate[0]))
				const diffTime2 = dayjs().diff(dayjs(activityDate[1]))
				if (diffTime1 >= 0 && diffTime2 <= 0) {
					this.showAdd = true
				}
			}
		},
	},
	onLoad() {
		this.getActList()
	}
}
</script>

<style scoped>
.show-page {
	height: auto;
	min-height: 100vh;
	padding-bottom: 0;
}

.join-btn {
	background-color: #957ff1;
	color: #fff;
	position: fixed;
	width: 108rpx;
	height: 108rpx;
	border-radius: 22rpx;
	top: 57%;
	right: 0;
	z-index: 5;
	text-align: center;
	font-weight: 600;
	padding: 14rpx 0 14rpx 8rpx;
	letter-spacing: 6rpx;
}
</style>
