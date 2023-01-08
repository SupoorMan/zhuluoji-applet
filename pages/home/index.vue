<template>
	<view class="home-page">
		<van-nav-bar title="侏罗纪的家" class="navbar" fixed left-arrow @click-left="backPage" />
		<view></view>
		<view class="home-tabs">
			<view class="home-tab-header">
				<view @tap="active = 1" :class="active === 1 ? 'left' : ''">
					<text class="tab-text">roomtour</text>
				</view>
				<view
					style="text-align: right;"
					@tap="active = 2"
					:class="active === 2 ? 'right' : ''"
				>
					<text class="tab-text">图纸分享</text>
				</view>
			</view>
			<view
				class="home-tab"
				:style="
					active === 1
						? 'border-top-right-radius: 20rpx;'
						: 'border-top-left-radius: 20rpx;'
				"
			>
				<view v-if="active === 1">
					<!-- 评论 -->
					ddd
				</view>
				<view v-else>
					<van-tabs
						color="#BB81DA75"
						title-inactive-color="#666"
						type="card"
						:active="activeType"
						@change="onTypeChange"
					>
						<van-tab v-for="item in roomType" :key="item" :title="item">
							<swiper class="room-tab" circular>
								<swiper-item v-for="bn in banners" :key="bn.id">
									<view class="swiper-item">
										<van-image :src="bn.url" width="678rpx" height="580rpx" />
									</view>
								</swiper-item>
							</swiper>
						</van-tab>
					</van-tabs>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="prod-list" v-if="active === 2">
				<van-card thumb="https://img.yzcdn.cn/vant/cat.jpeg">
					<view slot="title" class="title"><view>产品名称</view></view>
					<view slot="desc" class="desc">冷暖调光 优雅轻奢</view>
					<view slot="price" class="brand">品牌名</view>
					<view slot="num" class="price">
						参考价：
						<text class="price-text">约￥2000.00</text>
					</view>
				</van-card>
			</view>
			<view v-else>
				<van-divider />
				<view class="recommend-tabs">
					<view
						class="re-tab"
						:class="retabActive === item ? 'active' : ''"
						v-for="item in recommendType"
						@tap="retabActive = item"
					>
						{{ item }}
					</view>
				</view>
				<view class="review-list">
					<van-collapse :value="activeNames" @change="onChange">
						<van-collapse-item name="1">
							<view slot="title">
								用户
								<van-icon name="question-o" />
							</view>
							<view class="review-tools">
								<van-icon name="share-o" size="32rpx" />
								分享
								<van-icon name="like-o" size="32rpx" style="margin-left: 20rpx;" />
								20
							</view>
						</van-collapse-item>
						<van-collapse-item
							custom-class="review-collapse"
							v-for="item in list"
							:name="item.id"
							:key="item.id"
						>
							<template #icon>
								<van-image
									round
									width="30"
									height="30"
									src="https://img.yzcdn.cn/vant/cat.jpeg"
									style="margin-right: 10rpx;"
								/>
							</template>
							<template #title>
								{{ item.appletUserId }}，Level0
							</template>
							<template #value>
								{{ dayjs(item.createTime).format('YY-MM-DD') }}
							</template>
							{{ item.message }}
							<div class="review-tools">
								<van-icon name="share-o" size="32rpx" />
								分享
								<van-icon name="like-o" size="32rpx" />
								20
							</div>
						</van-collapse-item>
					</van-collapse>
				</view>
			</view>
		</view>
		<view class="return-recommend">
			<van-search
				:value="returnText"
				placeholder="喜欢就评论支持一下吧~"
				shape="round"
				use-action-slot
				left-icon="edit"
				@change="onRecommendChange"
				@search="onRecommendClick"
			>
				<view slot="action" @tap="onRecommendClick">确定</view>
			</van-search>
		</view>
	</view>
</template>

<script>
import { getBanner } from '@/api/user/user';
export default {
	data() {
		return {
			active: 1,
			roomType: ['客厅', '卧室', '厨房', '衣帽间', '卫浴'],
			activeType: '客厅',
			recommendType: ['精选评论', '最新评论', '我的点赞'],
			retabActive: '精选评论',
			banners: null,
			returnText: ''
		};
	},
	methods: {
		backPage() {
			uni.navigateBack({ delta: 1 });
		},
		onTypeChange(event) {
			this.activeType = event.detail.name;
		},
		loadImage() {},
		onRecommendChange(event) {
			this.returnText = event.detail;
		},
		onRecommendClick(event) {},
		async getBanners() {
			const result = await getBanner();
			if (result.code === 200) {
				this.banners = result.data;
			}
		}
	},
	onLoad(opt) {
		this.getBanners();
	}
};
</script>

<style scoped>
.home-page {
	height: auto;
	min-height: 100vh;
}
.home-tabs {
	width: 714rpx;
	height: 806rpx;
	margin: 0 auto;
}
.home-tab {
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	box-shadow: 4rpx 4rpx 4rpx #bb81da68;
	height: 714rpx;
	position: relative;
	padding: 24rpx;
	--padding-md: 0rpx;
}
.right {
	box-shadow: 4rpx 4rpx 4rpx #bb81da68;
	border-top-right-radius: 24rpx;
}
.left::before,
.right::before {
	content: '';
	background: url('/static/home/tab-act.png') no-repeat bottom center;
	background-size: contain;
	position: absolute;
	width: 100%;
	height: 100%;
	display: block;
	top: 0;
	right: 0;
}
.tab-text {
	position: relative;
	padding: 8rpx 34rpx 10rpx 34rpx;
	color: #666;
	font-weight: 600;
}
.left .tab-text,
.right .tab-text {
	background-color: #bb81da9e;
	border: 2rpx solid #f6e7ff;
	border-radius: 20rpx;
	color: #fff;
	text-shadow: 2rpx 4rpx 4rpx #7f499c50;
}
.left::after {
	right: 22rpx;
	top: 20rpx;
}
.left::after,
.right::after {
	content: '';
	background: url('/static/home/tab-active.png') no-repeat bottom center;
	background-size: 90%;
	position: absolute;
	display: block;
	width: 76rpx;
	height: 70rpx;
}
.right::after {
	left: 22rpx;
	top: 18rpx;
	transform: rotateY(180deg);
}

.right::before {
	transform: rotateY(180deg);
}

.home-tab-header {
	display: flex;
	align-items: center;
	justify-content: center;
}
.home-tab-header > view {
	flex: 1;
	padding: 40rpx 30rpx 0 30rpx;
	height: 92rpx;
	position: relative;
	font-size: 30rpx;
}
.room-tab {
	padding-top: 24rpx;
	width: 678rpx;
	height: 580rpx;
}
.prod-list {
	padding-top: 32rpx;
}
.title {
	color: #666666;
}
.brand,
.price {
	display: inline-block;
	vertical-align: middle;
	color: #666666;
}
.price {
	font-size: 24rpx;
	float: right;
}
.price-text,
.desc {
	color: #66666670;
	font-size: 24rpx;
}
/* 评论 */
.recommend-tabs {
	border-radius: 20rpx;
	overflow: hidden;
	display: flex;
	align-items: center;
	width: 486rpx;
}
.re-tab {
	padding: 12rpx 24rpx;
}
.re-tab + .re-tab {
	border-left: 2rpx solid #bb81da;
}
.re-tab.active {
	background-color: #bb81da75;
	color: #fff;
	font-weight: 600;
}
.return-recommend {
	position: fixed;
	bottom: env(safe-area-inset-bottom);
	width: 100%;
	/* height: 88rpx; */
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
<style>
.van-tabs__scroll--card {
	border: 0 !important;
	margin: 0 !important;
	border-radius: 10rpx !important;
	overflow: hidden;
}
</style>
