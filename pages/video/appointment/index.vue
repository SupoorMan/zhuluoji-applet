<template>
	<view class="page">
		<van-nav-bar title="我的预约" class="navbar" fixed left-arrow @click-left="backPage"></van-nav-bar>
		<view></view>
		<view class="live-tab-header">
			<view @tap="handelClickTab(1)" :class="activeLive === 1 ? 'active' : ''">
				<text class="tab-text">酷酷的侏罗纪家居</text>
			</view>
			<view @tap="handelClickTab(2)" :class="activeLive === 2 ? 'active' : ''">
				<text class="tab-text">酷酷的侏罗纪家纺</text>
			</view>
		</view>
		<view v-if="list[activeLive] &&list[activeLive].length >0 && !loading" class="pro-list">
			<AppointmentCard v-for="item in list[activeLive]" :key="item.id" :item="item" />
			<!-- <van-cell title-width="262rpx" value-class="right-content" custom-class="pro-card"
				v-for="item in list[activeLive]" :key="item.id">
				<template #title>
					<view style="background-color: #f9f9f9; border-radius: 8rpx; width:232rpx ; height: 232rpx;">
						<van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" width="224rpx"
							height="224rpx" />
					</view>
				</template>
				<template #default>
					<view style="height: 140rpx;" class="title">{{item.productName}} {{item.sizes}}</view>
					<view>原价：￥{{item.price}}</view>
					<view style="display: flex; align-items: center; justify-content: space-between;">
						<view>
							直播价：<text class="red-text">￥</text> <text class="red-text price">{{item.lastPrice}}</text>
						</view>
						<van-button size="mini" round icon="/static/live/notice-active.png" @click="subscLive(item)"
							v-if="item.flag===0" color="#E0AFD9">
							预约成功
						</van-button>
						<van-button size="mini" v-else-if="item.flag===3" round icon="/static/live/notice-active.png"
							color="#757575">
							已结束
						</van-button>
					</view>
				</template>
			</van-cell> -->
		</view>
		<view style="text-align: center;" class="" v-else>
			<view class="custom-image">
				<van-empty image="/static/empty.png">
					<template #description>
						<view>暂无预约商品</view>
						<view>点击下方按钮新增商品吧</view>
					</template>
				</van-empty>
			</view>
			<van-button color="#DF8ABD" size="small" round @click="backPage">
				预约直播商品</van-button>
		</view>
	</view>
</template>

<script>
	import { AppointmentCard } from '../components/AppointmentCard.vue'
	import { getAppointment } from '@/api/live'
	export default {
		components: {
			AppointmentCard
		},
		data() {
			return {
				activeLive: 1,
				page: null,
				list: { 1: null, 2: null },
				loading: false
			}
		},
		methods: {
			backPage() {
				uni.navigateBack({ delta: 1 })
			},
			handelClickTab(key) {
				this.activeLive = key
				this.getAppo()
			},
			async getAppo() {
				let index = this.activeLive
				if (this.list[index]) return
				this.loading = true
				const { data } = await getAppointment({ ...this.page, sources: index })
				if (data) {
					this.list[index] = data.records
					this.loading = false
				}
			}
		},
		onLoad(opt) {
			this.page = { ...opt, type: 2 }
			this.getAppo()
		}
	}
</script>

<style scoped>
	.page {
		height: auto;
		min-height: 100vh;
	}

	.live-tab-header {
		width: 652rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin: 0 auto;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.live-tab-header>view {
		text-align: center;
		line-height: 80rpx;
		flex: 1;
	}

	.live-tab-header>view.active {
		color: #fff;
		background-color: #DF8ABD;
	}

	.pro-list {
		padding: 24rpx;
	}
</style>
<style>
	/* 	.right-content {
		text-align: left !important;
	}

	.pro-card {
		border-radius: 12rpx;
	} */
	.custom-image {
		background-color: #fffffe;
		border-radius: 24rpx;
		text-align: center;
		margin: 24rpx;
	}

	.van-empty__image {
		width: 525rpx !important;
		height: 185rpx !important;
	}
</style>
