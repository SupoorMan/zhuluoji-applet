<template>
	<van-cell title-width="262rpx" value-class="right-content" custom-class="pro-card" :key="item.id">
		<template #title>
			<view style="background-color: #f9f9f9; border-radius: 8rpx; width:232rpx ; height: 232rpx;">
				<van-image fit="contain" :src="item.images" width="224rpx" height="224rpx" />
			</view>
		</template>
		<template #default>
			<view style="height: 140rpx;" class="title">{{item.productName}}{{item.sizes}}</view>
			<view>原价：￥{{item.price}}</view>
			<view style="display: flex; align-items: center; justify-content: space-between;">
				<view>
					直播价：<text class="red-text">￥</text>
					<text class="red-text price">{{item.lastPrice}}</text>
				</view>
				<van-button size="mini" round icon="/static/live/notice-active.png" @click="subscLive(item)"
					v-if="item.flag===0" color="#E0AFD9">
					预约成功
				</van-button>
				<van-button size="mini" v-else-if="item.flag===3" round icon="/static/live/notice-active.png"
					color="#757575">
					已结束
				</van-button>
				<van-button size="mini" round plain v-else icon="/static/live/notice.png" color="#E0AFD9"
					@click="subscLive(item)">
					{{stauts[item.flag]}}
				</van-button>
			</view>

		</template>
	</van-cell>
</template>

<script>
	import { updateLivePreview } from '@/api/live';
	export default {
		props: ['item'],
		data() {
			return {
				stauts: { 1: '开播提醒', 2: '直播中', 3: '直播结束' },
			}
		},
		methods: {
			async subscLive(item) {
				if (item.flag === 1 || item.flag === 0) {
					const { code } = await updateLivePreview({ id: item.productId, starter: item.flag === 1 ? 1 : 0 })
					if (code === 200) {
						uni.showToast({
							icon: 'none',
							title: '预约成功'
						})
					}
				}
			},
		}
	}
</script>
<style scoped>
	.title {
		font-size: 32rpx;
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
