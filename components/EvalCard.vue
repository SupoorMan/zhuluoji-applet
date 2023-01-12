<template>
	<view>
		<van-cell center="true" value-class="time-text" use-label-slot :value="cutDate(item.createTime)">
			<template #icon>
				<van-image round width="30" height="30" :src="item.avatarUrl" style="margin-right: 10rpx" />
			</template>
			<template #title>
				<view class="van-cell-text">{{ item.nickname }}</view>
				<text style="color: #edba00; font-size: 24rpx">Level{{ item.level }}</text>
			</template>
			<van-icon slot="right-icon" name="ellipsis" class="custom-icon" />
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
			<div class="review-tools">
				<view @click="replyToEval(item)" v-if="!noreply && item.homeId">
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
		},
	};
</script>

<style scoped>
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
</style>
