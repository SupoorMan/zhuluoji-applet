<template>
	<view class="order-detail-page">
		<view class="detail-content">
			<OrderCard :order="detail" />
			<van-cell title="运费">
				<template #default>
					<text>运费（到付）：￥{{ detail.expressFee }}</text>
				</template>
			</van-cell>
			<van-cell title="收货信息：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ detail.receiveAddress }}</text>
				</template>
			</van-cell>
			<van-cell title="订单编号：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ detail.orderNo }}</text>
					<text>复制</text>
				</template>
			</van-cell>
			<van-cell title="创建时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ getTime(detail.createTime) }}</text>
				</template>
			</van-cell>
			<!-- <van-cell title="付款时间：" :border="false" title-width="200rpx">
				<template #default>
					<text>{{ getTime(detail.payTime) }}</text>
				</template>
			</van-cell> -->
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
	import {
		getOrders
	} from '@/api/order';
	import dayjs from 'dayjs';
	export default {
		components: {
			OrderCard,
			Recommend
		},
		data() {
			return {
				detail: null
			};
		},
		methods: {
			async getDetail(opt) {
				const {
					data
				} = await getOrders(opt)
				if (data) {
					this.detail = data.records[0];
				}
			},
			getTime(time) {
				return dayjs(time).format('YYYY-MM-DD hh:mm:ss')
			}
		},
		onLoad(option) {
			this.getDetail(option)

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
