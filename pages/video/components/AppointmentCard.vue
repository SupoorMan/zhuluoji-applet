<template>
	<view class="pro-card" :key="item.id" v-show="item.flag!==1 || ! showCancel">
		<van-cell title-width="262rpx" custom-class="pro-card">
			<template #title>
				<view style="border-radius: 16rpx; width:232rpx ; height: 232rpx;">
					<van-image fit="contain" :src="item.images" width="224rpx" height="224rpx" />
				</view>
			</template>
			<template #default>
				<view class="right-content">
					<view style="height: 140rpx;" class="title">
						{{item.productName}}
						<view style="line-height: 44rpx;">
							<text style="color: #787878;">
								{{item.sizes}}
							</text>
							<br />
							<text style="color: #787878;" v-if="item.stamps">
								开播时间: {{cutDate(item) }}
							</text>
						</view>
					</view>
					<view style="line-height: 40rpx;margin-top: 16rpx;"><text style="color: #787878;">原价： </text> <text
							style="text-decoration: line-through;">￥{{item.price}}</text>
					</view>
					<view
						style="display: flex; align-items: center; justify-content: space-between;line-height: 40rpx;">
						<view>
							<text style="color: #787878;">直播价：</text><text class="red-text">￥</text>
							<text class="red-text price">{{item.lastPrice}}</text>
						</view>
						<van-tag size="medium" v-if="item.flag===0" color="#E0AFD9" round @tap="subscLive(item)">
							<van-icon name="/static/live/notice-active.png" color="#E0AFD9" />
							{{
								showCancel ? '取消预约':  '预约成功' 
							}}
						</van-tag>

						<!-- <van-button size="mini" round icon="/static/live/notice-active.png" @click="subscLive(item)"
						v-if="item.flag===0" color="#E0AFD9">
						预约成功
					</van-button> -->
						<van-tag size="medium" v-else-if="item.flag===3" round color="#757575">
							<van-icon name="/static/live/notice-active.png" color="#757575" />
							已结束
						</van-tag>
						<van-tag size="medium" round plain v-else color="#E0AFD9" @tap="subscLive(item)">
							<van-icon name="/static/live/notice.png" color="#E0AFD9" />
							{{stauts[item.flag]}}
						</van-tag>
					</view>
				</view>

			</template>
		</van-cell>
	</view>

</template>

<script>
	import { updateLivePreview } from '@/api/live';
	export default {
		props: ['item', 'user', 'showCancel'],
		data() {
			return {
				stauts: { 1: '开播提醒', 2: '直播中', 3: '直播结束' },
			}
		},
		methods: {
			cutDate(item) {
				if (item.stamps) {
					const dates = item.stamps.split(',')
					return item.activityDate ? item.activityDate + ' ' + dates[0] : dates[0]
				}
				return ''
			},
			async subscLive(item) {
				if (!this.user) {
					uni.navigateTo({
						url: '/pages/user/authorization/index'
					})
					return
				}
				if (item.flag === 0 && !this.showCancel) return
				if (item.flag === 1 || item.flag === 0) {
					const { code } = await updateLivePreview({
						id: item.productId || item.id,
						starter: item.flag ===
							1 ? 1 : 0
					})
					if (code === 200) {
						uni.showToast({
							icon: 'none',
							title: item.flag === 0 ? '取消预约成功' : '预约成功'
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
		color: #333;
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
		overflow: hidden;
		--cell-horizontal-padding: 16rpx;
	}
</style>
