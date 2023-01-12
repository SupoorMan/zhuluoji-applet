<template>
	<view class="page">

		<view class="live-tab-header">
			<view @tap="handelClickTab(1)" :class="activeLive === 1 ? 'active' : ''">
				<text class="tab-text">酷酷的侏罗纪家居</text>
			</view>
			<view @tap="handelClickTab(2)" :class="activeLive === 2 ? 'active' : ''">
				<text class="tab-text">酷酷的侏罗纪家纺</text>
			</view>
		</view>
		<view v-if="list[activeLive]">
			<van-cell title-width="262rpx" value-class="right-content" custom-class="pro-card">
				<template #title>
					<view style="background-color: #f9f9f9; border-radius: 8rpx; width:232rpx ; height: 232rpx;">
						<van-image fit="contain" src="https://img.yzcdn.cn/vant/cat.jpeg" width="224rpx"
							height="224rpx" />
					</view>
				</template>
				<template #default>
					<view style="height: 140rpx;" class="title">产品名称</view>
					<view>原价：￥500</view>
					<view style="display: flex; align-items: center; justify-content: space-between;">
						<view>
							直播价：<text class="red-text">￥</text> <text class="red-text price">425</text>
						</view>
						<van-button size="mini" round icon="/static/live/notice.png" color="#E0AFD9">预约成功
						</van-button>
					</view>

				</template>
			</van-cell>
		</view>
		<view v-else>
			<view> </view>
			<van-button color="#DF8ABD">预约直播商品</van-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeLive: 1,
				list: { 1: null, 2: null }
			}
		},
		methods: {
			handelClickTab(key) {
				this.activeLive = key
				this.getAppo()
			},
			async getAppo() {
				await getAppointment(this.activeLive)
			}
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
</style>
<style>
	.right-content {
		text-align: left !important;
	}

	.pro-card {
		border-radius: 12rpx;
	}
</style>
