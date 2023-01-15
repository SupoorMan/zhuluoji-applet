<template>
	<navigator class="pro-unit" :url="'/pages/shop/detail?productId=' + item.id">
		<view class="">
			<van-image width="336rpx" height="336rpx" radius="4" fit="cover" :src="firstImage" class="prod-image" />
		</view>
		<view class="pro-desc">
			<view class="pro-tag" v-if="item.tagType === 0 || item.tagType === 1">
				<van-tag plain type="danger" round v-if="item.tagType === 0">新品</van-tag>
				<van-tag plain type="danger" round v-else-if="item.tagType === 1">人气</van-tag>
			</view>
			<view class="pro-title">
				<p class="prod-text">{{ item.productName }}</p>
				<van-row>
					<van-col span="16">
						<text class="pro-price">{{ item.integral }}</text>
						<text class="pro-price-unit">积分</text>
					</van-col>
					<van-col span="8">
						<van-tag plain size="medium" color="#ff6a5f" round>兑换</van-tag>
					</van-col>
				</van-row>
			</view>
		</view>
	</navigator>
</template>

<script>
	export default {
		name: 'ProCard',
		props: {
			item: {
				type: Object
			}
		},
		computed: {
			firstImage() {
				if (this.item && this.item.productImage) {
					const imgs = this.item.productImage.split(',');
					return imgs.length > 1 ? imgs[0] : this.item.productImage;
				} else {
					return '';
				}
			}
		},
		data() {
			return {};
		}
	};
</script>

<style>
	.pro-unit {
		/* float: left; */
		width: 336rpx;
		background-color: #fff;
		border-radius: 8rpx;
		padding-bottom: 16rpx;
		margin-bottom: 16rpx;
		display: inline-block;
		height: auto;
	}

	.pro-unit:nth-child(2n) {
		margin-left: 16rpx;
	}

	.pro-desc {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding-left: 10rpx;
	}

	.prod-text {
		font-size: 22rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 12rpx;
	}

	.pro-tag {
		width: 80rpx;
		text-align: center;
	}

	.pro-title {
		padding-left: 10rpx;
		padding-right: 16rpx;
		flex: 1;
	}

	.pro-price {
		color: #ff6600;
		font-size: 36rpx;
	}

	.pro-price-unit {
		font-size: 22rpx;
		margin-left: 4rpx;
	}
</style>
