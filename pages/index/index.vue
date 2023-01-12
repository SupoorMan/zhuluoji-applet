<template>
	<view class="content">
		<!-- 标题 -->
		<van-nav-bar title="侏罗纪家仙女VIP专属" class="navbar" fixed>
			<van-icon name="chat-o" slot="left" size="20" />
		</van-nav-bar>
		<view></view>
		<!-- 轮播 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true">
				<swiper-item v-for="bn in banners" :key="bn.id">
					<view class="swiper-item">
						<van-image :src="bn.url" width="690rpx" height="300rpx"></van-image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 主要操作 -->
		<view class="home-operation">
			<van-grid column-num="5">
				<van-grid-item icon="sign" icon-color="#fdaad2" text="每日签到" link-type="navigateTo"
					:url="jumpPath('/pages/user/daySignIn/daySignIn')" />
				<van-grid-item icon="shop" icon-color="#f3b777" text="侏罗纪的家" link-type="navigateTo"
					:url="jumpPath('/pages/home/index')" />
				<van-grid-item icon="video" icon-color="#cea6fe" text="直播预告" link-type="navigateTo"
					:url="jumpPath('/pages/user/daySignIn/daySignIn')" />
				<van-grid-item icon="balance-list" icon-color="#aaf79d" text="订单转换" link-type="navigateTo"
					:url="jumpPath('/pages/user/transferOrder/transfer')" />
				<van-grid-item icon="gift-card" icon-color="#fb8885" text="仙女买家秀" link-type="navigateTo"
					:url="jumpPath('/pages/user/daySignIn/daySignIn')" />
			</van-grid>
		</view>
		<!-- 积分商品推荐位 -->
		<view class="store-bar">
			<van-cell label="更多商品，更多惊喜" :border="false">
				<view slot="title">
					<view class="van-cell-text">积分商城</view>
					<van-tag plain type="danger" round>新品</van-tag>
				</view>
			</van-cell>

			<view class="pro-bar">
				<van-grid :border="false">
					<!-- https://img.yzcdn.cn/vant/cat.jpeg -->
					<van-grid-item use-slot v-for="item in prods" :key="item.id" link-type="navigateTo"
						:url="'/pages/shop/detail?productId=' + item.id">
						<div>
							<van-image width="130rpx" height="130rpx" radius="4" fit="cover"
								:src="getProImage(item.productImage)" class="prod-image" />
							<text class="prod-text" slot="text">{{ item.productName }}</text>
						</div>
					</van-grid-item>
				</van-grid>
			</view>
		</view>
		<!--  商品列表-->
		<view class="pro-list">
			<ProCard class="pro-unit" v-for="item in prods" :key="item.id" :item="item" />
		</view>
	</view>
</template>

<script>
	import ProCard from '@/components/ProCard.vue';
	import { getProds } from '@/api/product.js';
	import { getBanner } from '@/api/user';
	export default {
		components: {
			ProCard
		},
		data() {
			return {
				user: null,
				prods: null,
				banners: []
			};
		},
		onLoad(options) {
			this.getRecomemdProd();
			this.getBanners();
		},
		methods: {
			async getBanners() {
				const result = await getBanner({ type: 0 });
				if (result.code === 200) {
					this.banners = result.data;
				}
			},
			jumpPath(realpath) {
				return this.user ? realpath : '/pages/user/authorization/index';
			},
			getProImage(urls) {
				if (urls) {
					const imgs = urls.split(',');
					return imgs.length > 1 ? imgs[0] : urls;
				} else {
					return '';
				}
			},
			async getRecomemdProd() {
				const result = await getProds({
					current: 1,
					pageSize: 20
				});
				if (result.code === 200) {
					this.prods = result.data.records;
				}
			}
		},
		onShow() {
			this.user = getApp().globalData.user;
		}
	};
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.uni-margin-wrap {
		width: 690rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		/* background-color: #fff; */
	}

	.home-operation {
		width: 100%;
		--grid-item-content-background-color: transparent;
	}

	/* 积分商城 */
	.store-bar {
		width: 690rpx;
		margin: auto;
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		--grid-item-content-padding: 10rpx;
	}

	.van-cell-text {
		display: inline-block;
		margin-right: 16rpx;
	}

	.pro-bar {
		padding: 0 16rpx;
	}

	.prod-text {
		font-size: 22rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* 积分商城 end*/
	/* 商品展示 */
	.pro-list {
		clear: both;
		position: relative;
		width: 690rpx;
		margin: 32rpx auto;
	}

	.pro-unit:nth-child(2n) {
		margin-left: 16rpx;
	}

	/* .pro-unit {
	float: left;
	width: 336rpx;
	background-color: #fff;
	border-radius: 8rpx;
	padding-bottom: 16rpx;
	margin-bottom: 16rpx;
}
.pro-desc {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.pro-tag {
	width: 140rpx;
	text-align: center;
}

.pro-title {
	padding-right: 16rpx;
}

.pro-price {
	color: #ff6600;
	font-size: 36rpx;
}

.pro-price-unit {
	font-size: 22rpx;
	margin-left: 4rpx;
} */
</style>
