<template>
	<van-cell title-width="262rpx" value-class="" custom-class="pro-card" :key="item.id">
		<template #title>
			<view style="background-color: #f9f9f9; border-radius: 8rpx; width:232rpx ; height: 232rpx;">
				<van-image fit="contain" :src="item.images" width="224rpx" height="224rpx" />
			</view>
		</template>
		<template #default>
			<view class="right-content">

				<view style="height: 140rpx;" class="title">{{item.productName}}{{item.sizes}}</view>
				<view>原价：￥{{item.price}}</view>
				<view style="display: flex; align-items: center; justify-content: space-between;">
					<view>
						直播价：<text class="red-text">￥</text>
						<text class="red-text price">{{item.lastPrice}}</text>
					</view>
					<van-tag size="medium" v-if="item.flag===0" color="#E0AFD9" round @click="subscLive(item)">
						<van-icon name="/static/live/notice-active.png" color="#E0AFD9" />
						预约成功
					</van-tag>
					<!-- <van-button size="mini" round icon="/static/live/notice-active.png" @click="subscLive(item)"
						v-if="item.flag===0" color="#E0AFD9">
						预约成功
					</van-button> -->
					<van-tag size="medium" v-else-if="item.flag===3" round color="#757575">
						<van-icon name="/static/live/notice-active.png" color="#757575" />
						已结束
					</van-tag>

					<van-tag size="medium" round plain v-else icon="/static/live/notice.png" color="#E0AFD9"
						@click="subscLive(item)">
						{{stauts[item.flag]}}
					</van-tag>
				</view>
			</view>

		</template>
	</van-cell>
</template>

<script>
	import { updateLivePreview } from '@/api/live';
	export default {
		props: ['item', 'user'],
		data() {
			return {
				stauts: { 1: '开播提醒', 2: '直播中', 3: '直播结束' },
			}
		},
		methods: {
			async subscLive(item) {
				if (!this.user) {
					uni.navigateTo({
						url: '/pages/user/authorization/index'
					})
				}
				if (item.flag === 1 || item.flag === 0) {
					const { code } = await updateLivePreview({
						id: item.productId || item.id,
						starter: item.flag ===
							1 ? 1 : 0
					})
					if (code === 200) {
						uni.showToast({
							icon: 'none',
							title: item.flag === 1 ? '取消预约成功' : '预约成功'
						})
						this.item.flag = item.flag ===
							1 ? 0 : 1
					}
				}
			},
		}
	}
</script>
<style scoped>
	.title {
		font-size: 32rpx;
		text-align: left;
	}

	.red-text {
		color: #FF4141;
	}

	.price {
		font-size: 36rpx;
		font-weight: 600;
	}
</style>
<style>
	.right-content {
		text-align: left !important;
	}

	.pro-card {
		border-radius: 12rpx;
		margin-top: 24rpx;
	}
</style>
