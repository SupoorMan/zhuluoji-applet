<template>
	<navigator :url="'/pages/shop/detail?productId=' + item.id" class="pro-card top" :class="'top-' + rank">
		<van-card :thumb="firstImage">
			<view slot="title" class="title">
				{{ item.productName }}
			</view>
			<view slot="desc" class="desc">
				<view class="price-body">
					<text class="price">{{ item.integral }}</text>
					<text class="unit">积分</text>
				</view>
				<van-button size="mini" class="button" color="#ff6a5f" round plain>兑换</van-button>
			</view>
		</van-card>
	</navigator>
</template>

<script>
	export default {
		props: {
			rank: {
				type: Number
			},
			item: {
				type: Object
			}
		},
		computed: {
			firstImage() {
				if (this.item && this.item.productImage && this.item.productImage.length > 1) {
					return this.item.productImage.split(',')[0];
				} else {
					return '';
				}
			}
		},
		data() {
			return {
				buttons: []
			};
		},
		methods: {}
	};
</script>

<style>
	.pro-card {
		border-radius: 16rpx;
		margin-top: 16rpx;
		border: 2rpx solid #bdbdbd;
		overflow: hidden;
		position: relative;
		--card-thumb-size: 270rpx;
		--card-padding: 0;
	}

	.pro-card.top-1,
	.top-2,
	.top-3 {
		border: 2rpx solid #f3da79;
	}

	.top:before {
		background: url('@/static/shop/rank.png') no-repeat center;
	}

	.top:before,
	.top-1:before,
	.top-2:before,
	.top-3:before {
		content: '';
		display: inline-block;
		position: absolute;
		height: 48rpx;
		width: 40rpx;
		left: 24rpx;
		top: -4rpx;
		text-align: center;
		color: #fff;
		z-index: 1;
	}

	.top-1:before {
		content: '1';
		background: url('@/static/shop/rank-t.png') no-repeat center;
		background-size: contain;
	}

	.top-2:before {
		content: '2';
		background: url('@/static/shop/rank-t.png') no-repeat center;
		background-size: contain;
	}

	.top-3:before {
		content: '3';
		background: url('@/static/shop/rank-t.png') no-repeat center;
		background-size: contain;
	}

	.title {
		height: 202rpx;
		padding-top: 20rpx;
		padding-left: 8rpx;
		font-size: 32rpx;
		font-weight: bloder;
		color: #737374;
	}

	.order-status {
		color: #ff6a5f;
		width: 120rpx;
	}

	.price-body {
		flex: 1;
	}

	.desc {
		display: flex;
		align-content: center;
		justify-content: space-between;
		padding: 0 8rpx;
	}

	.price {
		color: #ff6600;
		font-size: 38rpx;
	}

	.unit {
		color: #666;
		font-size: 28rpx;
		padding-left: 4rpx;
	}

	.button {
		--button-mini-font-size: 22rpx;
	}
</style>
