<template>
	<view class="order-detail-page">
		<view class="detail-content">
			<OrderCard />
			<van-cell title="运费">
				<template #default>
					<text>运费（快递）：￥0.00</text>
				</template>
			</van-cell>
			<van-cell title="收货信息：" :border="false" title-width="200rpx">
				<template #default>
					<text>
						周一一，86-18000000000， 浙江省 杭州市 萧山区 一一街道 一一小区00幢0单元000
					</text>
				</template>
			</van-cell>
			<van-cell title="订单编号：" :border="false" title-width="200rpx">
				<template #default>
					<text>00000000000000000000</text>
					<text>复制</text>
				</template>
			</van-cell>
			<van-cell title="创建时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>2022-01-01 00：00：00</text>
				</template>
			</van-cell>
			<van-cell title="付款时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>2022-01-01 00：00：00</text>
				</template>
			</van-cell>
			<van-cell title="发货时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>2022-01-01 00：00：00</text>
				</template>
			</van-cell>
			<van-cell title="完成时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>2022-01-01 00：00：00</text>
				</template>
			</van-cell>
		</view>
		<van-cell-group inset custom-class="contract-cell">
			<van-cell>
				<template #title>
					<view>遇到问题？</view>
				</template>
				<template #default>
					<van-icon name="chat-o" color="#ff938a" />
					<text>联系客服</text>
				</template>
			</van-cell>
		</van-cell-group>
		<!-- 推荐 -->
		<Recommend />
	</view>
</template>

<script>
import OrderCard from './components/OrderCard';
import Recommend from '../components/Recommend.vue';
import { getOrder } from '@/api/order';
export default {
	components: { OrderCard, Recommend },
	data() {
		return {
			detail: null
		};
	},
	methods: {},
	onLoad(option) {
		let _this = this;
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('acceptDataFromOpenerPage', function(data) {
			if (data) {
				_this.detail = data;
			}
		});
	}
};
</script>

<style>
.order-detail-page {
	height: auto;
	padding-top: 24rpx;
}
.detail-content {
	margin: 0 32rpx 24rpx 32rpx;
	background-color: #fffff9;
	border-radius: 16rpx;
	overflow: hidden;
	--card-background-color: #fffff9;
	--cell-background-color: #fffff9;
	--cell-line-height: 28rpx;
	--cell-font-size: 26rpx;
}
.contract-cell {
	margin-top: 24rpx;
	--cell-background-color: #fffff9;
}
</style>
