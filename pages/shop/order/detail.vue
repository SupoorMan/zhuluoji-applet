<template>
	<view class="order-detail-page" v-if="detail">
		<view class="detail-content">
			<OrderCard :order="detail" />
			<van-cell title="运费" value="包邮"></van-cell>
			<van-cell title="收货信息：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ detail.receiveAddress }}</text>
				</template>
			</van-cell>
			<van-cell title="订单编号：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ detail.orderNo }}</text>
					<text @click="copyOrderNo">|复制</text>
				</template>
			</van-cell>
			<van-cell title="运单号：" :border="false" title-width="200rpx" v-show="detail.status>1">
				<template #default>
					<text>{{ detail.transferNo }}</text>
				</template>
			</van-cell>

			<van-cell title="创建时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ getTime(detail.createTime) }}</text>
				</template>
			</van-cell>

			<van-cell title="发货时间：" :border="false" title-width="200rpx" v-show="detail.status>1">
				<template #default>
					<text>{{ detail.updateTime }}</text>
				</template>
			</van-cell>
			<van-cell title="完成时间：" :border="false" title-width="200rpx" v-show="detail.finishTime">
				<template #default>
					<text>{{ detail.finishTime }}</text>
				</template>
			</van-cell>
		</view>
		<view class="contract-cell">
			<van-cell-group inset custom-class="">
				<van-cell>
					<template #title>
						<view>遇到问题？</view>
					</template>
					<template #default>
						<van-button open-type="contact" size="mini" icon="chat-o">联系客服</van-button>
					</template>
				</van-cell>
			</van-cell-group>
		</view>

	</view>
</template>

<script>
	import OrderCard from './components/OrderCard';
	import { getOrders } from '@/api/order';
	import dayjs from 'dayjs';
	export default {
		components: {
			OrderCard
		},
		data() {
			return {
				detail: null,
				showSelectAddress: false,
				filedValue: ''
			};
		},
		methods: {
			async getDetail(opt) {
				const { data } = await getOrders(opt)
				if (data) {
					this.detail = data.records[0];
				}
			},
			copyOrderNo() {},
			getTime(time) {
				return dayjs(time).format('YYYY-MM-DD hh:mm:ss')
			}
		},
		onLoad(option) {
			this.getDetail(option)
		},
	};
</script>

<style>
	.order-detail-page {
		height: auto;
		min-height: 100vh;
		padding-top: 24rpx;
	}

	.detail-content {
		margin: 0 32rpx 24rpx 32rpx;
		background-color: #fffff970;
		border-radius: 16rpx;
		overflow: hidden;
		--card-background-color: #fffff970;
		--cell-background-color: #fffff970;
		--cell-line-height: 28rpx;
		--cell-font-size: 26rpx;
	}

	.contract-cell {
		margin-top: 24rpx;
		--cell-background-color: #fffff970;
		--button-default-border-color: transparent;
		--button-default-background-color: transparent;
	}

	.van-button:before {
		border: 0;
	}
</style>
