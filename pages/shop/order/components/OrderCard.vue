<template>
	<van-card thumb="https://img.yzcdn.cn/vant/cat.jpeg" custom-class="pro-card">
		<view slot="title" class="title">
			<view class="">经典小香风织带抱枕 黑色 30x50cm</view>
			<view class="order-status">{{ orderState[order.status] }}</view>
		</view>
		<view slot="desc" class="price">
			{{ order.integral }}
			<text class="unit">积分</text>
		</view>
		<view slot="footer">
			<van-button
				size="mini"
				class="button"
				round
				v-for="btn in buttons[order.status]"
				:key="btn.key"
			>
				{{ btn.name }}
			</van-button>
		</view>
	</van-card>
</template>

<script>
export default {
	props: {
		order: {
			type: Object
		}
	},
	data() {
		return {
			orderState: {
				'-1': '已取消',
				'0': '未支付',
				'1': '待发货',
				'2': '待收货',
				'3': '已完成'
			},
			buttons: {
				1: [
					{ name: '找客服', key: 1 },
					{ name: '催发货', key: 2 },
					{ name: '改地址', key: 3 },
					{ name: '取消订单', key: 4 }
				],
				2: [
					{ name: '找客服', key: 1 },
					{ name: '查看物流', key: 4 },
					{ name: '确认收货', key: 5 }
				],
				3: [{ name: '去评价', key: 6 }],
				'-1': [{ name: '删除订单', key: 7 }, { name: '重新兑换', key: 8 }]
			}
		};
	},
	methods: {}
};
</script>

<style>
.pro-card {
	border-radius: 16rpx;
	margin-top: 16rpx;
}
.title,
.price {
	display: flex;
	align-items: flex-start;
	justify-content: flex-end;
}
.title {
	height: 118rpx;
}
.order-status {
	color: #ff6a5f;
	width: 120rpx;
}
.price {
	align-items: center;
	color: #ff6600;
}
.unit {
	color: #666;
}
.button {
	--button-mini-font-size: 22rpx;
}
</style>
