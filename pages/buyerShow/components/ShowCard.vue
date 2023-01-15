<template>

	<navigator v-if="item" :url="'/pages/buyerShow/detail?id='+item.id">
		<view class="show-card">
			<view class="image-box">
				<van-image :src="item.images" width="330rpx" height="440rpx" radius="12" />
			</view>
			<view class="title">
				<van-icon name="star" color="#fcd144" size="12" />
				<view>{{item.productName}}</view>
			</view>
			<view class="desc-info">
				<view class="name">
					<van-image :src="item.avatarUrl" round width="30" fit="cover" height="30" />
					<text>{{item.nickname}}</text>
				</view>
				<view class="" @click.stop="pickShows(item)">
					<van-icon name="like" color="#ff6a5f" size="24" />
					<view class="star-text">{{item.starter}}</view>
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
		width: 336rpx;
		border-radius: 12rpx;
		margin-right: 24rpx;
		overflow: hidden;
	}

	.show-card>view {
		display: flex;
	}

	.title {
		padding: 12rpx;
	}

	.desc-info {
		justify-content: space-between;
		padding: 12rpx;
	}

	.desc-info .name {
		display: flex;
		align-items: center;
	}

	.star-text {
		text-align: center;
		font-size: 22rpx;
	}
</style>
