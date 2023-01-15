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

		</view>
		<view style="text-align: center;" class="" v-else>
			<view class="custom-image">
				<view>暂无预约商品</view>
				<view>点击下方按钮新增商品吧</view>
			</view>
			<van-button color="#DF8ABD" size="small" round @click="backPage"> 预约直播商品</van-button>
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
	.custom-image {
		/* background-color: #fffffe; */
		border-radius: 24rpx;
		text-align: center;
		margin: 80rpx 24rpx;
		position: relative;
		padding-top: 130rpx;
		height: 344rpx;
	}

	.custom-image>view {
		color: #333;
		line-height: 1.8;
		font-family: SiYuanHei, SiYuanHei-Normal;
	}

	.custom-image::before {
		content: '';
		border-radius: 50%;
		width: 344rpx;
		height: 344rpx;
		display: block;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
		opacity: 0.34;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.00), #cb72bb);
	}
</style>
