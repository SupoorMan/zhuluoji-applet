<template>
	<view class="convert-list">
		<view class="tabs">
			<view class="tab" v-for="tab in tabs" :key="tab.key" :class="{ active: activeKey === tab.key }"
				@tap="changeTab(tab.key)">
				{{ tab.name }}
			</view>
		</view>
		<view class="tab-list">

			<view v-if="showList &&showList.length>0">
				<view class="convert-card" v-for="order in showList" :key="order.id">
					<view class="card-body">
						<view class="card-image" v-if="order.images">
							<image :src="order.images" mode="aspectFit"></image>
						</view>
						<view class="card-content">
							<view style="">
								订单编号：{{ order.orderNo }}
								<text style="color:#7F7F7F;float: right;">{{ cutTime(order.createTime) }}</text>
							</view>
							<view>
								购买平台：
								<text style="color:#7F7F7F;">{{source[order.type]}}</text>
							</view>
							<view class="order-cost-info" v-if="order.status===1">
								<view style="">
									消费金额：
									<text style="color:#7F7F7F;">￥{{ order.costs }}</text>
								</view>
								<view style="">
									兑换积分：
									<text style="color:#FF8141;">{{ order.integral }}</text>
								</view>
							</view>

						</view>
					</view>
					<view class="card-footer">
						<template v-if="order.status===2">
							<text>原因：{{order.remark}}</text>
							<van-tag color="#D0D0D0" text-color="#737374">{{ state[order.status] }}</van-tag>
						</template>
						<template v-else>
							<text></text>
							<van-tag color="#FFE4BF" text-color="#F56122">{{ state[order.status] }}</van-tag>
						</template>
					</view>
				</view>
			</view>

			<view class="custom-image" v-else>
				<van-empty image="/static/empty.png">
					<template #description>
						<view>您还没有相关的订单</view>
						<view>快去转换订单获得积分奖励吧</view>
					</template>
				</van-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import { pageOrderConvert } from '@/api/order';
	import dayjs from 'dayjs';
	import { mapState } from 'pinia'
	import { userStore } from '@/store';
	export default {
		data() {
			return {
				page: {
					current: 1,
					pageSize: 100
				},
				activeKey: 1,
				source: {
					0: '微信',
					1: '淘宝',
					2: '小红书',
					3: '抖音',
					4: '其他'
				},
				state: {
					0: '审核中',
					1: '兑换成功',
					2: '兑换失败'
				},
				tabs: [
					{ name: '转换中', key: 0 },
					{ name: '已完成', key: 1 },
					{ name: '已取消', key: 2 }
				],
				list: null,
				showList: null
			};
		},
		computed: {
			...mapState(userStore, ['user']),
		},
		methods: {
			changeTab(activeKey) {
				this.activeKey = activeKey;
				this.showList = this.list.filter(n => n.status === activeKey)
			},
			async getList() {
				const { code, data } = await pageOrderConvert({ ...this.page, appletUserId: this.user.id });
				if (code === 200) {
					this.list = data.records;
					this.changeTab(0)
				}
			},
			cutTime(date) {
				return dayjs(date).format('YY-MM-DD');
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

	.tabs {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 84rpx;
		line-height: 84rpx;
		padding-top: 20rpx;
	}

	.tab {
		flex: 1;
		height: 100%;
		text-align: center;
	}

	.tab.active {
		color: #D695FF;
		/* border-bottom: 4rpx solid #D695FF; */
		/* border-radius: 8rpx; */
	}

	.tab.active:after {
		content: '';
		width: 60rpx;
		display: block;
		margin: 0 auto;
		border-bottom: 4rpx solid #D695FF;
	}

	.tab-list {
		padding-top: 16rpx;
	}

	/* 订单卡片 */
	.convert-card {
		background-color: #F5F5F5;
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
		background-color: #fff;
	}

	.card-image>image {
		width: 160rpx;
		height: 100%;
		line-height: 160rpx;
	}

	.card-content {
		flex: 1;
		line-height: 1.8;
		color: #333;
	}

	.order-cost-info {
		display: flex;
		justify-content: space-between;
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

	/* 空白提示 */
	.custom-image {
		background-color: #fffffe;
		border-radius: 24rpx;
		text-align: center;
		margin-top: 24rpx;
	}
</style>
<style>
	.van-empty__image {
		width: 525rpx !important;
		height: 185rpx !important;
	}
</style>
