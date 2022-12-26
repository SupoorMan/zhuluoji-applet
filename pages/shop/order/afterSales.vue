<template>
	<view class="order-page">
		<van-nav-bar
			title="售后"
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
					@tap="activeKey = tab.key"
				>
					{{ tab.name }}
				</view>
			</view>
			<view v-if="activeKey === 3">
				<navigator url="/pages/shop/order/detail" hover-class="navigator-hover">
					<OrderCard />
				</navigator>
				<OrderCard />
			</view>
			<view class="custom-image" v-else>
				<van-empty image="/static/empty.png">
					<template #description>
						<view>您还没有相关的售后</view>
						<view>快去看看其他推荐好物吧</view>
					</template>
				</van-empty>
			</view>
		</view>
		<!-- 推荐 -->
		<Recommend />
	</view>
</template>

<script>
import OrderCard from './components/OrderCard';
import Recommend from '../components/Recommend';
export default {
	components: { OrderCard, Recommend },
	data() {
		return {
			activeKey: 1,
			tabs: [
				{ name: '售后申请', key: 1 },
				{ name: '处理中', key: 2 },
				{ name: '已完成', key: 3 }
			]
		};
	},
	methods: {
		backPage() {
			uni.navigateBack({ delta: 1 });
		}
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
	border-radius: 16rpx;
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
