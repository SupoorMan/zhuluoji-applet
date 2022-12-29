<template>
	<view class="order-page">
		<van-nav-bar
			title="全部订单"
			class="navbar"
			fixed
			left-arrow
			@click-left="backPage"
		></van-nav-bar>
		<view class="order-list">
			<view class="tabs">
				<view
					class="tab"
					v-for="tab in tabs"
					:key="tab.key"
					:class="{ active: activeKey === tab.key }"
					@tap="changeTab(tab.key)"
				>
					{{ tab.name }}
				</view>
			</view>
			<view v-if="orders && orders.length > 0">
				<OrderCard v-for="order in orders" :key="order.id" :order="order" />
			</view>
			<view class="custom-image" v-else>
				<van-empty image="/static/empty.png">
					<template #description>
						<view>您还没有相关的订单</view>
						<view>快去看看其他推荐好物吧</view>
					</template>
				</van-empty>
			</view>
		</view>
	</view>
</template>

<script>
import OrderCard from './components/OrderCard';
import { getOrders } from '@/api/order';
export default {
	components: { OrderCard },
	data() {
		return {
			activeKey: 1,
			tabs: [
				{ name: '全部', key: 1 },
				{ name: '已完成', key: 2 },
				{ name: '待收货', key: 3 },
				{ name: '已取消', key: 4 }
			],
			page: {
				current: 1,
				pageSize: 20,
				status: ''
			},
			orders: null
		};
	},
	methods: {
		backPage() {
			uni.navigateBack({ delta: 1 });
		},
		changeTab(activeKey) {
			this.activeKey = activeKey;
			this.page.status = activeKey;
			this.getList(this.page);
		},
		async getList(params) {
			const { data, code } = await getOrders(params);
			if (code === 200) {
				this.orders = data.records;
			}
		},
		toDetail(item) {
			uni.navigateTo({
				url: '/pages/shop/order/detail',
				success: function(res) {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit('acceptDataFromOpenerPage', item);
				}
			});
		}
	},
	onLoad() {
		this.getList(this.page);
	}
};
</script>

<style>
.order-page {
	height: 100%;
	padding-top: 0;
}
.order-list {
	padding: 0 24rpx;
}
.tabs {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 64rpx;
	line-height: 64rpx;
}
.tab {
	flex: 1;
	height: 100%;
	text-align: center;
}
.tab.active {
	background-color: #fff;
	border-radius: 8rpx;
}

.custom-image {
	background-color: #fffffe;
	border-radius: 24rpx;
	text-align: center;
	margin-top: 24rpx;
}
.van-empty__image {
	width: 525rpx !important;
	height: 185rpx !important;
}
</style>
