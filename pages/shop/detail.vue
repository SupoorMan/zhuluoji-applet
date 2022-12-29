<template>
	<view class="prod-detail-page">
		<!-- 标题 -->
		<van-nav-bar title="积分商城" class="navbar" fixed left-arrow @click-left="backPage" />
		<view></view>
		<!-- 轮播 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true">
				<swiper-item v-for="bn in proBanner" :key="bn">
					<image :src="bn" class="swiper-item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="prod-title-info">
			<van-row>
				<van-col span="12">
					<view class="prod-title">{{ detail.productName }}</view>
					<view class="price">
						{{ detail.integral }}
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
			<van-field
				readonly
				label="规格:"
				:value="detail.amount || '-'"
				:border="false"
				title-width="2.5em"
				label-class="detail-title"
			/>
			<van-field
				readonly
				label="类型:"
				:value="proCate[detail.productType]"
				:border="false"
				title-width="2.5em"
				label-class="detail-title"
			/>
			<van-field
				readonly
				label="发货:"
				value="3-15个工作日"
				:border="false"
				title-width="2.5em"
				label-class="detail-title"
			/>
		</view>
		<view class="prod-title-info">
			<van-row>
				<van-col span="12">用户评价（00）</van-col>
				<van-col span="12" style="text-align: right;">
					<navigator :url="'/pages/shop/userReviews/index?productId=' + detail.id">
						查看全部
						<van-icon name="arrow" />
					</navigator>
				</van-col>
			</van-row>
			<view>
				<view style="display: flex;align-items: center;">
					<van-image
						width="20"
						height="20"
						src="https://img.yzcdn.cn/vant/cat.jpeg"
						round
						style="margin-top: 20rpx;margin-right: 8rpx;"
					/>
					<text>用户名, LV0</text>
				</view>
				<view>评价内容。。。。。。。。。。。。。。。。</view>
			</view>
		</view>
		<view class="prod-photo-info">
			<van-divider contentPosition="center" dashed>图文详情</van-divider>
			<rich-text style="width: 750rpx;" :nodes="detail.details"></rich-text>
		</view>
		<!-- 商品介绍 -->
		<van-goods-action>
			<van-goods-action-icon
				icon="share-o"
				text="分享"
				color="#AE71D5"
				icon-class="icon-action"
				text-class="text-action"
				@click="onClickIcon"
			/>
			<van-goods-action-icon
				icon="like-o"
				text="收藏"
				icon-class="icon-action"
				text-class="text-action"
				color="#AE71D5"
				@click="onClickIcon"
			/>
			<van-goods-action-button
				text="去兑换"
				@click="onClickButton"
				color="linear-gradient(to right, #F4E2FF, #D695FF)"
			/>
		</van-goods-action>
	</view>
</template>

<script>
import { getProdDetail } from '@/api/product';
export default {
	data() {
		return {
			detail: null,
			proCate: {
				1: '玻璃餐具',
				2: '睡衣浴袍',
				3: '床上用品',
				4: '家居装点'
			},
			proBanner: []
		};
	},
	methods: {
		backPage() {
			uni.navigateBack({ delta: 1 });
		},
		async getDetail(option) {
			const { data } = await getProdDetail(option);
			this.detail = data;
			if (data.productImage) {
				this.proBanner = data.productImage.split(',');
			}
		},
		onClickButton() {
			const prod = this.detail;
			uni.navigateTo({
				url: '/pages/shop/order/addOrder',
				success: function(res) {
					console.log(prod);
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit('acceptDataFromOpenerPage', prod);
				}
			});
		}
	},
	onLoad(options) {
		this.getDetail(options);
	}
};
</script>

<style>
.prod-detail-page {
	height: 100%;
}
.uni-margin-wrap {
	border-radius: 8rpx 8rpx 0 0;
	height: 320rpx;
	width: 726rpx;
	background-color: #fff;
	margin: 0 auto;
	text-align: center;
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
	background-color: #ffe4bf;
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
}
.prod-photo-info {
	background-color: #fff;
	padding: 24rpx 0;
	margin-top: 12rpx;
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
</style>
