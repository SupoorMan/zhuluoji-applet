<template>
	<view class="convert-list">
		<view class="convert-card" v-for="order in list">
			<view class="card-body">
				<view class="card-image"><image :src="order.images" mode="aspectFit"></image></view>
				<view class="card-content">
					<view style="">
						No: {{ order.orderNo }}
						<text style="color:#ff6a5f;float: right;">{{ state[order.status] }}</text>
					</view>
					<view class="tag">
						<van-tag color="#F1E6FF" text-color="#9300FF">{{ source[order.type] }}</van-tag>
					</view>
				</view>
			</view>
			<view class="card-footer">
				<text>{{ cutTime(order.createTime) }}</text>
				<text>共计: {{ order.costs }} &nbsp;元</text>
			</view>
		</view>
	</view>
</template>

<script>
import { pageOrderConvert } from '@/api/order';
import dayjs from 'dayjs';
export default {
	data() {
		return {
			page: {
				current: 1,
				pageSize: 20
			},
			source: {
				0: '微信',
				1: '淘宝',
				2: '小红书',
				3: '抖音',
				4: '其他'
			},
			state: {
				0: '待审核',
				1: '已兑换',
				2: '不通过兑换'
			},
			list: null
		};
	},
	methods: {
		async getList() {
			const { code, data } = await pageOrderConvert(this.page);
			if (code === 200) {
				this.list = data.records;
			}
		},
		cutTime(date) {
			return dayjs(date).format('YYYY-MM-DD hh:mm:ss');
		}
	},
	onLoad(opt) {
		this.getList();
	}
};
</script>

<style scoped>
.convert-list {
	height: atuo;
	min-height: 100vh;
}
.convert-card {
	background-color: #fff;
	margin: 24rpx;
	border-radius: 24rpx;
	overflow: hidden;
}
.card-body {
	display: flex;
	align-items: flex-start;
	padding: 24rpx;
}
.card-image {
	width: 160rpx;
	height: 160rpx;
	margin-right: 16rpx;
	background-color: #f7f7f7;
}
.card-image > image {
	width: 160rpx;
	height: 100%;
	line-height: 160rpx;
}
.card-content {
	flex: 1;
}
.tag {
	padding-top: 30rpx;
}
.card-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 24rpx;
	font-size: 23rpx;
	color: #666;
	background-color: #f9f9f9;
}
</style>
