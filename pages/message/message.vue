<template>
	<view class="page-list">
		<van-cell-group title="系统通知">
			<van-cell
				is-link
				icon="bell"
				title="站内信息通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
			<van-cell
				is-link
				icon="bullhorn-o"
				title="系统消息通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
		</van-cell-group>
		<van-cell-group title="消息通知">
			<van-cell
				is-link
				icon="live"
				title="直播预告通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
			<van-cell
				is-link
				icon="gift"
				title="活动消息通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
			<van-cell
				is-link
				icon="logistics"
				title="订单物流通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
			<van-cell
				is-link
				icon="medal-o"
				title="等级通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
			<van-cell
				is-link
				icon="balance-o"
				title="积分通知"
				link-type="navigateTo"
				url="/pages/input/index"
			/>
		</van-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
.page-list {
	background: #f9f9f9;
	height: 100%;
}
</style>
