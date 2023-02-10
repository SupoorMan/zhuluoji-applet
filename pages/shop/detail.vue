<template>
	<view class="prod-detail-page" v-if="detail">
		<!-- 标题 -->
		<van-nav-bar title="积分商城" class="navbar" fixed left-arrow @click-left="backPage" />
		<view></view>
		<!-- 轮播 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true">
				<swiper-item v-for="bn in proBanner" :key="bn">
					<image :src="bn" class="swiper-item" mode="aspectFit" />
				</swiper-item>
			</swiper>
		</view>
		<view class="prod-title-info">
			<van-row>
				<van-col span="12">
					<view class="prod-title">{{ detail.productName }}</view>
					<view class="price">
						{{detail.list.length>0? detail.list[0].integral: "-"}}
						<text class="price-unit">积分</text>
					</view>
				</van-col>
				<van-col span="12" style="text-align: right;">
					<view>剩余{{ detail.totals }}份</view>
					<view class="price">
						<text class="price-unit">每人限购 {{ detail.purchaseLimit }} 件</text>
					</view>
				</van-col>
			</van-row>
		</view>
		<view class="prod-detail-info">
			<van-cell label="规格:" :value="detail.list.length>0? detail.list[0].sizes +detail.list[0].colors : '-'"
				:border="false" title-width="3em" />
			<van-cell label="类型:" :border="false" title-width="3em">
				<template #default>
					<text v-if="detail.productType">{{proCate[detail.productType]}}</text>
					<text style="color:#F56171;">【积分兑换不退不换】</text>
				</template>
			</van-cell>
			<van-cell label="发货:" value="3-15个工作日" :border="false" title-width="3em" />
		</view>
		<view class="prod-title-info">
			<van-row>
				<van-col span="12">用户评价（{{evals ? evals.total:'0'}}）</van-col>
				<van-col span="12" style="text-align: right;">
					<navigator :url="'/pages/shop/userReviews/index?productId=' + detail.id">
						查看全部
						<van-icon name="arrow" />
					</navigator>
				</van-col>
			</van-row>
			<view v-if="evals && evals.total>0">
				<view style="display: flex;align-items: center;">
					<van-image width="24" height="24" :src="evals.first.avatarUrl" round
						style="margin-top: 20rpx;margin-right: 8rpx;" />
					<text>{{evals.first.nickname}} ,</text>
					<text style="color:#edba00;font-size:24rpx;">LV{{evals.first.level}}</text>
				</view>
				<view>{{evals.first.message}}</view>
			</view>
		</view>
		<view class="prod-photo-info">
			<van-divider contentPosition="center" dashed>图文详情</van-divider>
			<rich-text style="width: 750rpx;font-size: 0;" :nodes="detail.details"></rich-text>
		</view>
		<!-- 商品介绍 -->
		<van-goods-action>
			<van-goods-action-icon icon="share-o" text="分享" color="#AE71D5" open-type="share" icon-class="icon-action"
				text-class="text-action" />
			<van-goods-action-icon icon="like-o" text="收藏" icon-class="icon-action" text-class="text-action"
				color="#AE71D5" @click="onClickIcon" />
			<van-goods-action-button text="去兑换" @click="onClickButton"
				color="linear-gradient(to right, #F4E2FF, #D695FF)" />
		</van-goods-action>
	</view>
</template>

<script>
	import { getProdDetail } from '@/api/product';
	import { getEvals } from '@/api/review';
	import { userStore } from '@/store'
	import { mapState } from 'pinia'
	export default {
		data() {
			return {
				detail: null,
				proCate: {
					1: '餐具摆件',
					// 2: '睡衣浴袍',
					3: '床品家纺',
					4: '生活日用'
				},
				proBanner: [],
				evals: null // 评价对象 
			};
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			backPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			onShareAppMessage() {
				return {
					title: this.detail.productName,
					imageUrl: this.detail.productImage,
					path: '/pages/shop/detail?productId=' + this.detail.id,
				}
			},
			async getDetail(option) {
				const { data } = await getProdDetail({ ...option, type: 0 });
				this.detail = data;
				if (data.productImage) {
					this.proBanner = data.productImage.split(',');
				}
			},
			async getEval(options) {
				const { data } = await getEvals({
					current: 1,
					pageSize: 1,
					...options
				})
				if (data) {
					this.evals = {
						total: data.total,
						first: data.total > 0 ? data.records[0] : {}
					}
				}
			},
			onClickButton() {
				if (!this.user) {
					uni.navigateTo({
						url: '/pages/user/authorization/index'
					})
					return
				}
				const prod = this.detail;
				uni.navigateTo({
					url: '/pages/shop/order/addOrder',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', prod);
					}
				});
			}
		},
		onLoad(options) {
			this.getDetail(options);
			this.getEval(options)
		}
	};
</script>

<style>
	.prod-detail-page {
		height: 100%;
	}

	.uni-margin-wrap {
		border-radius: 8rpx 8rpx 0 0;
		height: 726rpx;
		width: 726rpx;
		background-color: #fff;
		margin: 0 auto;
		text-align: center;
	}

	.swiper,
	.uni-margin-wrap image.swiper-item {
		width: 726rpx;
		height: 726rpx;
	}

	.prod-title-info {
		background-color: #fff;
		width: 726rpx;
		margin: 0 auto;
		border-radius: 0 0 8rpx 8rpx;
		padding: 6rpx 24rpx 24rpx 24rpx;
		line-height: 80rpx;
	}

	.prod-title {
		color: #777;
		font-size: 32rpx;
	}

	.price {
		color: #f56122;
		font-size: 44rpx;
		font-weight: bolder;
		line-height: 56rpx;
	}

	.price-unit {
		font-size: 24rpx;
		background-color: #ffe4bf70;
		border-radius: 8rpx;
		padding: 6rpx 8rpx;
		color: #f56122;
		vertical-align: middle;
		margin-left: 8rpx;
		font-weight: 500;
	}

	.prod-detail-info {
		background-color: #fff;
		width: 726rpx;
		margin: 0 auto;
		border-radius: 8rpx 8rpx;
		overflow: hidden;
		margin-top: 12rpx;
		margin-bottom: 12rpx;
		--cell-label-font-size: 28rpx;
	}

	.prod-photo-info {
		background-color: #fff;
		padding: 24rpx 0;
		margin-top: 12rpx;
	}

	.van-cell__value {
		text-align: left !important;
	}

	[alt] {
		max-width: 100%;
	}

	.icon-action {
		color: #ae71d5;
		--goods-action-icon-color: #ae71d5;
	}

	.text-action {
		color: #ae71d5;
		font-size: 24rpx;
	}

	.prod-photo-info p {
		display: none;
	}

	..van-goods-action {
		padding-left: 24rpx;
		padding-right: 24rpx;
	}
</style>
