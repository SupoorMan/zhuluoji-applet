<template>
	<view class="eval-card">
		<van-cell center="true" use-label-slot :border="false" title-width="90%">
			<template #icon>
				<van-image round width="30" height="30" :src="item.avatarUrl" style="margin-right: 10rpx" />
			</template>
			<template #title>
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<view class="van-cell-text">{{ item.nickname }}</view>
					<view>
						<text class="time-text">{{cutDate(item.createTime)}}</text>
						<van-icon slot="right-icon" name="ellipsis" class="custom-icon" @tap="moreOpt(item)"
							v-if="item.appletUserId===user.id" />
					</view>
				</view>
				<text style="color: #edba00; font-size: 24rpx">Level{{ item.level }}</text>
			</template>
			<template #default>
			</template>
		</van-cell>
		<view class="eval-message" :style="noreply ? 'padding-right:0;' : ''">
			<swiper class="eval-imgs" circular v-if="item.images">
				<swiper-item v-for="img in imgs" :key="img">
					<view class="swiper-item">
						<van-image :src="img" fit="contain" width="580rpx" height="580rpx" />
					</view>
				</swiper-item>
			</swiper>
			{{ item.message }}
			<div class="review-tools" v-if="!noreply && (item.homeId ||item.activityId)">
				<view @click="replyToEval(item)">
					<van-icon name="chat-o" size="32rpx" style="margin-right: 4rpx" />
					回复
				</view>
				<view @click="addStar">
					<van-icon :name="item.flag === 1 ? 'like' : 'like-o'" size="32rpx" color="#FF4B4B"
						style="margin-right: 4rpx" />
					<template v-if="item.starter">{{ item.starter }}</template>
				</view>
			</div>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs";
	import { userStore } from "../store";
	import { mapState } from 'pinia';
	export default {
		props: {
			item: {
				type: Object,
				required: true,
			},
			index: {
				type: Array, // Number[]
				required: true,
			},
			noreply: {
				type: Boolean,
				required: false,
				default: false,
			},
		},
		computed: {
			...mapState(userStore, ['user']),
			imgs() {
				if (this.item && this.item.images) {
					return this.item.images.split(',')
				}
				return []
			}
		},
		data() {
			return {};
		},
		methods: {
			cutDate(createTime) {
				return dayjs(createTime).format("YY-MM-DD");
			},
			replyToEval(item) {
				this.$emit("replyToEval", item);
			},
			addStar() {
				this.$emit("addStar", this.index);
			},
			moreOpt() {
				this.$emit("moreOpt", this.index);
			}
		},
	};
</script>

<style scoped>
	.eval-card {
		--cell-vertical-padding: 8rpx;
		--cell-line-height: 40rpx;
		padding-bottom: 16rpx;
		padding-top: 16rpx;
	}

	.van-cell-text {
		font-size: 26rpx;
		line-height: 1.2;
		color: #666;
	}

	.eval-message {
		padding: 0 22rpx 0 106rpx;
		font-size: 26rpx;
	}

	.eval-imgs {
		width: 580rpx;
		height: 580rpx;
		background-color: #f9f9f9;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
	}

	.review-tools {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 16rpx;
		margin-bottom: 16rpx;
	}

	.review-tools>view {
		padding: 0 8rpx;
		display: flex;
		align-items: center;
		font-size: 24rpx;
	}
</style>
<style>
	.time-text {
		font-size: 24rpx;
		margin-right: 16rpx;
	}

	view.van-cell__value {
		font-size: 24rpx !important;
	}
</style>
