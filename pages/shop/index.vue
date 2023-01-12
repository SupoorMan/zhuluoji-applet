<template>
	<view class="shop-page">
		<van-nav-bar class="navbar" fixed>
			<template #left>
				<view class="search-pro">
					<van-icon name="search" size="30rpx" />
					<input type="text" placeholder="输入商品名称" class="search-input" />
				</view>
			</template>
		</van-nav-bar>
		<view class="user-card">
			<van-row>
				<van-col span="18">
					<view class="user-info">
						<van-image round height="100rpx" width="100rpx" :src="user.avatarUrl || ''" fit="cover" />
						<view class="user-desc">
							<view v-if="user">{{ user.nickname }}</view>
							<navigator v-else url="/pages/user/authorization/index">登录</navigator>
							<view class="user-code">当前积分：{{ user.integral || '0' }}</view>
						</view>
					</view>
				</van-col>
				<van-col span="6">
					<navigator class="record-inter" url="/pages/shop/order/list" hover-class="navigator-hover">
						兑换记录
					</navigator>
					<view class="record-inter">赚积分</view>
				</van-col>
			</van-row>
		</view>
		<view class="tabs">
			<view class="tab" v-for="tab in tabs" :key="tab.key" :class="{ active: activeKey === tab.key }"
				@tap="changeType(tab.key)">
				{{ tab.name }}
			</view>
		</view>
		<view class="page-list">
			<van-tabs :active="activeCate" v-if="activeKey == 11" @change="changeTab">
				<!-- 全部商品 -->
				<van-tab :title="tab.name" v-for="tab in proCate" :key="tab.key" :name="tab.key">
					<view class="pro-list">
						<ProCard class="pro-unit" v-for="item in prods" :key="item.id" :item="item" />
					</view>
				</van-tab>
			</van-tabs>
			<view class="pro-list" v-else-if="activeKey == 13">
				<!-- 排行商品 -->

				<RankCard v-for="(item, index) in prods" :key="item.key" :rank="index + 1" :item="item" />
			</view>
			<view class="pro-list" v-else>
				<!-- 我能兑换、新品 -->
				<ProCard class="pro-unit" v-for="(item, index) in prods" :key="item.key" :item="item" />
			</view>
			<view class="custom-image" v-if="(!prods || prods.length === 0) && !loading">
				<van-empty image="/static/empty.png">
					<template #description>
						<view>抱歉，暂无商品</view>
						<view>小编正在整理货仓，尽请期待</view>
					</template>
				</van-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import ProCard from '@/components/ProCard.vue';
	import RankCard from './components/RankCard.vue';
	import {
		getProds
	} from '@/api/product.js';
	export default {
		components: {
			ProCard,
			RankCard
		},
		data() {
			return {
				activeKey: 11,
				activeCate: '0',
				tabs: [{
						name: '全部商品',
						key: 11
					},
					{
						name: '我能兑换',
						key: 12
					},
					{
						name: '人气排名',
						key: 13
					},
					{
						name: '新品上新',
						key: 14
					}
				],
				proCate: [{
						name: '玻璃餐具',
						key: '0'
					},
					{
						name: '睡衣浴袍',
						key: '1'
					},
					{
						name: '床上用品',
						key: '2'
					},
					{
						name: '家居装点',
						key: '3'
					}
				],
				page: {
					current: 1,
					pageSize: 20,
					productType: '0'
				},
				tabProds: {},
				loading: true,
				user: null,
				prods: null
			};
		},
		onLoad(options) {
			setTimeout(() => this.getRecomemdProd(this.page), 100);
		},
		methods: {
			changeType(active) {
				this.activeKey = active;
				switch (active) {
					case 11:
						this.page = {
							current: 1,
							pageSize: 20,
							productType: '0'
						};
						break;
					case 12:
						this.page = {
							current: 1,
							pageSize: 20
						};
						break;
					case 13:
						this.page = {
							current: 1,
							pageSize: 20,
							tagType: 1
						};
						break;
					case 14:
						this.page = {
							current: 1,
							pageSize: 20,
							tagType: 0
						};
						break;
				}
				this.getRecomemdProd(this.page);
			},
			async getRecomemdProd(params) {
				this.loading = true;
				if (this.activeKey == 11) {
					if (this.tabProds[params.productType]) {
						this.prods = this.tabProds[params.productType];
						this.loading = false;
						return;
					}
					const result = await getProds({
						...params,
						shopping: 1
					});
					this.tabProds[params.productType] = [];
					if (params.current === 1) {
						this.tabProds[params.productType] = result.data.records;
						this.prods = result.data.records;
					} else {
						this.tabProds[params.productType] = [
							...this.tabProds[params.productType],
							...result.data.records
						];
						this.prods = [...this.prods, ...result.data.records];
					}
				} else {
					const result = await getProds({
						...params,
						shopping: 1
					});
					if (result.code === 200) {
						this.prods =
							params.current === 1 ?
							result.data.records : [...this.prods, ...result.data.records];
					}
				}
				this.loading = false;
			},
			async changeTab(event) {
				this.activeCate = event.detail.name;
				this.page.productType = event.detail.name;
				await this.getRecomemdProd(this.page);
			}
		},
		onShow() {
			this.user = getApp().globalData.user;
		}
	};
</script>

<style>
	.shop-page {
		height: auto;
		min-height: 100%;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
	}

	.search-pro {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 33rpx;
		height: 66rpx;
		border: 1px solid #999;
		padding-left: 16rpx;
		color: #999;
	}

	.search-input {
		text-align: left;
	}

	.user-card {
		width: 100%;
		margin: 0 auto;
		padding-left: 24rpx;
		padding-bottom: 32rpx;
		margin-top: 20rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		font-size: 30rpx;
	}

	.user-desc {
		margin-left: 16rpx;
		font-size: 30rpx;
	}

	.user-code {
		font-size: 24rpx;
		color: #999;
		padding-top: 24rpx;
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		height: 72rpx;
		line-height: 72rpx;
		margin: 0 24rpx;
	}

	.tab {
		flex: 1;
		height: 100%;
		text-align: center;
	}

	.tab.active {
		background-color: #fffff029;
		border-radius: 16rpx 16rpx 0 0;
	}

	.page-list {
		padding: 24rpx;
		background-color: #fffff029;
		flex: 1;
		--tabs-nav-background-color: transparent;
		--tabs-bottom-bar-color: #4d4d4d;
		--tabs-line-height: 68rpx;
	}

	.van-tab--active {
		border-radius: 18rpx;
		background-color: #e9d6fc;
	}

	.pro-list {
		padding-top: 16rpx;
	}

	.pro-unit {
		display: inline-block;
	}

	.pro-unit:nth-child(2n) {
		margin-left: 16rpx;
	}

	.record-inter {
		background: linear-gradient(to right, #fefeff, #ede5fc);
		border-radius: 30rpx 0 0 30rpx;
		padding-right: 24rpx;
		padding-left: 52rpx;
		position: relative;
		line-height: 56rpx;
		font-size: 24rpx;
		height: 56rpx;
		width: 188rpx;
		text-shadow: 4rpx 0 4rpx #e0bbfe;
	}

	.record-inter::before {
		content: '';
		background: url('@/static/shop/inter-icon.png') no-repeat center;
		background-size: contain;
		display: inline-block;
		position: absolute;
		height: 35rpx;
		width: 35rpx;
		left: 12rpx;
		top: 10rpx;
	}

	.record-inter+.record-inter {
		margin-top: 16rpx;
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
