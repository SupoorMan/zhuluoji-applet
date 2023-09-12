<template>
	<view class="home-page">
		<van-nav-bar title="侏罗纪的家" class="navbar" fixed left-arrow @click-left="backPage" />
		<view></view>
		<view class="home-tabs">
			<view class="home-tab-header">
				<view></view>
				<!-- <view @tap="active = 1" :class="active === 1 ? 'left' : ''">
					<text class="tab-text">roomtour</text>
				</view> -->
				<view style="text-align: right" @tap="active = 2" :class="active === 2 ? 'right' : ''">
					<text class="tab-text">图纸分享</text>
				</view>
			</view>
			<view class="home-tab"
				:style="active === 1  ? 'border-top-right-radius: 20rpx;'  : 'border-top-left-radius: 20rpx;' ">
				<!-- <view v-show="active === 1" class="video-box"> -->
				<!-- roomtour 视频 -->
				<!-- <video :src="roomTour.images" width="100%" height="100%" v-if="roomTour" /> -->
				<!-- </view> -->
				<view v-show="active === 2" v-if="typeList">
					<van-tabs color="#BB81DA75" title-inactive-color="#666" type="card" :active="activeType"
						@change="onTypeChange">
						<van-tab v-for="item in typeList" :key="item.id" :title="item.topType">
							<swiper class="room-tab" circular>
								<swiper-item v-for="img in item.banners" :key="img">
									<view class="swiper-item">
										<van-image :src="img" fit="contain" width="678rpx" height="580rpx" />
									</view>
								</swiper-item>
							</swiper>
						</van-tab>
					</van-tabs>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="prod-list" v-if="active === 2 && typeList && typeList[activeType].list">
			<van-cell-group inset v-for="proItem in typeList[activeType].list" :key="proItem.id">
				<van-card :thumb="proItem.images">
					<view slot="title" class="title">
						<view>{{ proItem.names }}</view>
					</view>
					<view slot="desc" class="desc">{{ proItem.introduction }}</view>
					<view slot="price" class="brand">{{ proItem.brands }}</view>
					<view slot="num" class="price">
						参考价：
						<text class="price-text">约￥{{ proItem.values }}</text>
					</view>
				</van-card>
			</van-cell-group>
		</view>
		<!-- 评论列表 -->
		<!-- 		<view v-else-if="active === 1">
			<van-divider />
			<view class="recommend-tabs">
				<view class="re-tab" :class="retabActive === item ? 'active' : ''" v-for="item in recommendType"
					@tap="changeRcomdType(item)" :key="item">
					{{ item }}
				</view>
			</view>
			<view class="review-list" v-if="recommendList.length > 0">
				<van-cell-group :border="false">
					<Recommends :recommendList="recommendList" @replyToEval="replyToEval" @addStar="addStar" />

				</van-cell-group>
			</view>
		</view> -->
		<!-- 	<view class="return-recommend" v-show="active === 1">
			<view class="recommend-content">
				<view class="eval-area">
					<van-icon name="edit" />
					<textarea fixed v-model="returnText" @input="onRecommendChange"
						:placeholder="returnTopId ? focusReply : '喜欢就评论支持一下吧~'" auto-height @blur="onBulrReply"
						:focus="returnTopId !== ''"></textarea>
				</view>
				<view class="eval-btn" @click="onRecommendClick" hover-class="navigator-hover">确定</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import dayjs from "dayjs";
	import Recommends from "./components/Recommends.vue";
	import {
		getHomePage,
		getHomeDetail,
		getHomeEvalPage,
		addHomeEval,
		updateHomeEval,
		getHomeEvalsubPage,
	} from "@/api/home";
	import { mapState } from "pinia";
	import { userStore } from "@/store";
	export default {
		components: {
			Recommends,
		},
		data() {
			return {
				active: 2,
				activeType: 0, // 选中的图片类型
				recommendType: ["精选评论", "最新评论", "我的点赞"],
				retabActive: "精选评论",
				showMoreOpt: true,
				roomTour: null,
				typeList: null,
				recommendList: [],
				focusReply: "",
				returnTopId: "",
				returnText: "",
			};
		},
		computed: {
			...mapState(userStore, ["user"]),
		},
		methods: {
			backPage() {
				uni.navigateBack({
					delta: 1,
				});
			},
			async changeRcomdType(item) {
				this.retabActive = item;
				switch (item) {
					case "精选评论":
						await this.loadEvals({
							type: 0,
						});
						return;
					case "最新评论":
						await this.loadEvals({
							type: 1,
						});
						return;
					case "我的点赞":
						await this.loadEvals({
							type: 2,
							appletUserId: this.user.id,
						});
						return;
				}
			},
			replyToEval(item) {
				this.returnTopId = item.id;
				this.focusReply = "回复(" + item.nickname + ")";
			},
			onBulrReply(event) {
				if (!event.detail.value) {
					this.returnTopId = "";
					this.focusReply = "";
				}
			},
			onTypeChange(event) {
				this.activeType = event.detail.name;
			},
			async getDetail() {
				const { data } = await getHomeDetail({
					id: this.roomTour.id,
				});
				this.typeList = data.map((m) => {
					if (m.images) {
						m = {
							...m,
							banners: m.images.split(","),
						};
					}
					return m;
				}).reverse();
			},
			onRecommendChange(event) {
				this.returnText = event.detail.value;
			},
			async onRecommendClick() {
				// 新增评论
				if (this.returnText.length < 2) {
					uni.showToast({
						icon: "none",
						title: "评论不能少于2字",
					});
				}
				if (this.returnText) {
					const { code, data } = await addHomeEval({
						homeId: this.roomTour.id,
						message: this.returnText,
						topId: this.returnTopId,
						state: 0,
						type: 2,
					});
					if (code === 200) {
						this.returnText = "";
						this.returnTopId = "";
						this.focusReply = "";
						uni.showToast({
							title: "评论成功",
							icon: "success",
						});
						await this.changeRcomdType(this.retabActive);
					}
				}
			},
			async getHomePage() {
				const { data, code } = await getHomePage({
					status: 1,
					current: 1,
					pageSize: 1,
				});
				if (code === 200 && data.records.length > 0) {
					this.roomTour = data.records.length > 0 ? data.records[0] : null;
					await this.getDetail();
					await this.changeRcomdType(this.retabActive);
				}
			},
			async loadEvals(opt = {}) {
				const params = {
					pageSize: 10,
					current: 1,
					homeId: this.roomTour.id,
					topId: -1,
					...opt,
				};
				const { code, data } = await getHomeEvalPage(params);
				this.recommendList = data.records || [];
			},
		},
		onLoad(opt) {
			this.getHomePage();
		},
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
		content: "";
		background: url("/static/home/tab-act.png") no-repeat bottom center;
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
		content: "";
		background: url("/static/home/tab-active.png") no-repeat bottom center;
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

	.home-tab-header>view {
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
		padding: 32rpx 26rpx;
		--cell-group-inset-padding: 0;
		--card-background-color: #fff;
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

	/*视频 */
	.video-box {
		/* padding-top: 144rpx; */
	}

	video {
		width: 660rpx;
		height: 660rpx;
	}

	/* 评论 */
	.recommend-tabs {
		border-radius: 20rpx;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		width: 486rpx;
		margin-left: 32rpx;
	}

	.re-tab {
		padding: 12rpx 24rpx;
		flex: 1;
	}

	.re-tab+.re-tab {
		border-left: 2rpx solid #bb81da30;
	}

	.re-tab.active {
		background-color: #bb81da75;
		color: #fff;
		font-weight: 600;
	}

	.review-list {
		padding-bottom: calc(env(safe-area-inset-bottom) + 88rpx);
		margin-top: 40rpx;
		--cell-background-color: transparent;
	}

	.return-recommend {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.recommend-content {
		display: flex;
		align-items: flex-start;
		align-items: center;
		box-sizing: border-box;
		padding: var(--search-padding, 10px 12px);
	}

	.eval-area {
		background-color: var(--search-background-color, #f7f8fa);
		border-radius: 2px;
		display: flex;
		flex: 1;
		padding-left: var(--padding-sm, 12px);
		border-radius: 44rpx;
	}

	.eval-area textarea {
		padding: 16rpx;
		width: 100%;
	}

	.eval-btn {
		color: var(--search-action-text-color, #323233);
		font-size: var(--search-action-font-size, 14px);
		line-height: var(--search-input-height, 34px);
		padding: var(--search-action-padding, 0 8px);
	}
</style>
<style>
	.van-tabs__scroll--card {
		border: 0 !important;
		margin: 0 !important;
		border-radius: 10rpx !important;
		overflow: hidden;
	}

	.time-text {
		font-size: 24rpx;
		margin-right: 16rpx;
	}
</style>
