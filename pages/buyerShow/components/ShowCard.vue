<template>

	<navigator v-if="item" :url="'/pages/buyerShow/detail?id='+item.id">
		<view class="show-card">
			<view class="image-box">
				<van-image :src="item.images" width="352rpx" height="352rpx" radius="12" />
			</view>
			<view class="title">
				<van-icon name="star" color="#fcd144" size="12" style="margin-top: 8rpx;margin-right: 4rpx;" />
				<view>{{item.productName}}</view>
			</view>
			<view class="desc-info">
				<view class="name">
					<van-image :src="item.avatarUrl" round width="30" fit="cover" height="30"
						style="margin-right: 8rpx;" />
					<view class="">
						<text>{{item.nickname}}</text>
						<br>
						<text style="color:#fcd144">LV{{item.level}}</text>
					</view>

				</view>
				<view @click.stop="pickShows(item)" class="top-content">
					<van-icon name="like" color="#ff6a5f" size="20" />
					<text class="star-text">{{item.starter}}</text>
				</view>
			</view>
		</view>
	</navigator>
</template>

<script>
	import { updateLivePreview } from '@/api/live';
	export default {
		props: ['item'],
		data() {
			return {}
		},
		methods: {
			async pickShows(item) {
				const { code } = await updateLivePreview({ id: item.id, type: 1, starter: item.flag === 1 ? 0 : 1 })
				if (code === 200) {
					this.item.starter = item.flag === 1 ? this.item.starter - 1 : this.item.starter + 1
					this.item.flag = item.flag === 1 ? 0 : 1
				}
			},
		}
	}
</script>

<style>
	.show-card {
		background-color: #ffffff80;
		width: 352rpx;
		border-radius: 20rpx;
		margin-right: 15rpx;
		overflow: hidden;
	}

	.show-card>view {
		display: flex;
	}

	.title {
		padding: 12rpx;
		align-items: flex-start;
		/* border-bottom: 1rpx solid #eee; */
		position: relative;
		bottom: 1rpx;
	}

	.title::after {
		position: absolute;
		content: '';
		width: 300rpx;
		display: block;
		border-bottom: 1rpx dotted #eee;
		bottom: 0rpx;
		left: 26rpx;
	}

	.desc-info {
		justify-content: space-between;
		padding: 12rpx;
	}

	.desc-info .name {
		display: flex;
		align-items: center;
	}

	.desc-info .name text {
		font-size: 24rpx;
	}

	.top-content {
		width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.star-text {
		text-align: center;
		font-size: 22rpx;
		line-height: 70rpx;
		vertical-align: middle;
		display: inline-block;
	}
</style>
