<template>
	<view class="recommend">
		<van-divider dashed contentPosition="center">精选推荐</van-divider>
		<view class="pro-list">
			<ProCard class="pro-unit" />
			<ProCard class="pro-unit" />
		</view>
	</view>
</template>

<script>
import ProCard from '@/components/ProCard.vue';
export default {
	components: {
		ProCard
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
.recommend {
	padding-top: 32rpx;
}
.pro-list {
	padding-top: 16rpx;
	padding-left: 24rpx;
	padding-right: 24rpx;
	margin: 0 auto;
}
.pro-unit:nth-child(2n) {
	margin-left: 16rpx;
}
</style>
