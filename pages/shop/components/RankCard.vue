<template>
	<van-card
		thumb="https://img.yzcdn.cn/vant/cat.jpeg"
		:custom-class="['pro-card', 'top', 'top-' + rank]"
	>
		<view slot="title" class="title">经典小香风织带抱枕 黑色 30x50cm</view>
		<view slot="desc" class="desc">
			<view class="price-body">
				<text class="price">2000</text>
				<text class="unit">积分</text>
			</view>
			<van-button size="mini" class="button" color="#ff6a5f" round plain>兑换</van-button>
		</view>
	</van-card>
</template>

<script>
export default {
	props: {
		rank: {
			type: Number
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

	background-size: contain;
	display: inline-block;
	position: absolute;
	height: 40rpx;
	width: 29rpx;
	left: 30rpx;
	top: -4rpx;
	text-align: center;
	color: #fff;
}

.top-1:before {
	content: '1';
	background: url('@/static/shop/rank-t.png') no-repeat center;
}
.top-2:before {
	content: '2';
	background: url('@/static/shop/rank-t.png') no-repeat center;
}
.top-3:before {
	content: '3';
	background: url('@/static/shop/rank-t.png') no-repeat center;
}
.title {
	height: 118rpx;
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
