<template>
	<view class="pro-unit">
		<view class="">
			<van-image
				width="336rpx"
				height="336rpx"
				radius="4"
				fit="cover"
				src="https://img.yzcdn.cn/vant/cat.jpeg"
				class="prod-image"
			/>
		</view>
		<view class="pro-desc">
			<view class="pro-tag"><van-tag plain type="danger" round>新品</van-tag></view>
			<view class="pro-title">
				<p class="prod-text">经典小香风织带抱枕 黑色 30x50cm</p>
				<van-row>
					<van-col span="16">
						<text class="pro-price">2000</text>
						<text class="pro-price-unit">积分</text>
					</van-col>
					<van-col span="8">
						<van-tag plain size="medium" color="#ff6a5f" round>兑换</van-tag>
					</van-col>
				</van-row>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ProCard',
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
	width: 140rpx;
	text-align: center;
}

.pro-title {
	padding-right: 16rpx;
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
