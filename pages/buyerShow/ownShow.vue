<template>
	<view class="ownShow-page">
		<view class="shows" v-if="shows && shows.length>0">

			<view class="show-card" v-for="show in shows" :key="show.id" hover-class="navigator-class"
				@tap="jumpTo('/pages/buyerShow/detail?id='+show.id)">
				<view style="background-color: #f9f9f9;border-radius: 12rpx;">
					<image style="width: 144rpx;height: 144rpx;" :src="show.images" mode="aspectFit"></image>
				</view>
				<view class="card-content">
					<view class="">
						{{show.productName}}
						<text style="float: right;">{{cutTime(show.createTime)}}</text>
					</view>
					<view class="">
						<!-- {{show.details}} -->
						<text style="float: right;" class="delete-btn" @tap="handelRemove(show)">删除</text>
						<text style="float: right;" class="edit-btn" @tap="handelEdit(show)">编辑</text>
					</view>
				</view>
			</view>
			<view v-if="shows && shows.length<page.total"
				style="padding: 24rpx; margin: 24rpx atuo;text-align: center;">
				<text @click="loadMoreEvals">点击加载更多</text>
			</view>
		</view>
		<view class="custom-image" v-else>
			<van-empty image="/static/empty.png">
				<template #description>
					<view>抱歉，您没有发布的买家秀</view>
				</template>
			</van-empty>
		</view>
	</view>
</template>

<script>
	import { getShows, delShows } from '@/api/activity.js';
	import { userStore } from '@/store'
	import { mapState } from 'pinia'
	import dayjs from "dayjs"
	export default {
		data() {
			return {
				page: {
					current: 1,
					pageSize: 10,
					total: 0,
				},
				shows: null // 买家秀列表
			}
		},
		computed: {
			...mapState(userStore, ['user']),
		},
		methods: {
			jumpTo(url) {
				uni.navigateTo({
					url
				})
			},
			cutTime(date) {
				return dayjs(date).format('YY/MM/DD HH:mm');
			},
			handelEdit(show) {
				uni.navigateTo({
					url: '/pages/buyerShow/add?id=' + show.id
				})
			},
			async handelRemove(show) {
				const { code } = await delShows({ id: show.id })
				if (code === 200) {
					uni.showToast({
						icon: 'success',
						title: '删除成功'
					})
					const index = this.shows.findIndex(n => n.id === show.id)
					if (index !== -1) {
						this.shows = this.shows.splice(index, 1)
						this.page.total -= 1
					}
				}
			},
			async getList() {
				const { code, data } = await getShows({ ...this.page, appletUserId: this.user.id, type: 1 })
				if (code === 200) {
					if (this.page.current === 1) {
						this.shows = data.records;
					} else {
						this.prods = [...this.shows, ...data.records];
					}
					this.page.total = data.total
				}
				this.$forceUpdate()
			}
		},
		onLoad() {
			this.getList()
		}
	}
</script>

<style scoped>
	.ownShow-page {
		padding-top: 1rpx;
		height: auto;
		min-height: 100vh;
	}

	.show-card {
		background-color: #fff;
		border-radius: 20rpx;
		margin: 24rpx 16rpx;
		display: flex;
		align-items: center;
		padding: 24rpx;
	}

	.card-content {
		flex: 1;
		padding-left: 12rpx;
		height: 144rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.delete-btn,
	.edit-btn {
		display: inline-block;
		background-color: #FFE7E7;
		color: #FF4141;
		border-radius: 8rpx;
		padding: 4rpx 16rpx;
	}

	.edit-btn {
		background-color: #cce9ff;
		color: #4781ff;
		margin-right: 16rpx;
	}

	/* 空提示 */
	.custom-image {
		background-color: #fffffe;
		border-radius: 24rpx;
		text-align: center;
		margin-top: 24rpx;
	}
</style>
<style>
	.van-empty__image {
		width: 525rpx !important;
		height: 185rpx !important;
	}
</style>
