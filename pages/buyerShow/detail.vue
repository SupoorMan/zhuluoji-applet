<template>
	<view class="show-detail-page">
		<van-nav-bar title="仙女买家秀" class="navbar" fixed left-arrow @click-left="backPage"></van-nav-bar>
		<view class=""> </view>
		<view class="show-card" v-if="detail">
			<view class="show-header">
				<view class="user-info">
					<van-image :src="detail.avatarUrl" round width="40" height="40" />
					<view class="">
						<view>{{ detail.nickname }}</view>
						<view class="level-text">LV{{ detail.level }}</view>
					</view>
				</view>
				<view>
					<text class="time-text">{{ detail.createTime }}</text>
					<van-icon name="ellipsis" class="custom-icon" />
				</view>
			</view>
			<swiper class="shows-imgs" circular v-if="images">
				<swiper-item v-for="img in images" :key="img">
					<view class="swiper-item">
						<van-image :src="img" fit="contain" width="690rpx" height="780rpx" />
					</view>
				</swiper-item>
			</swiper>
			<view class="detail-info">
				<view class="detail-title">{{ detail.title }}</view>
				{{ detail.details }}
			</view>
		</view>
		<!-- <view class="recommend-list" v-if="evals"> -->
		<!-- <view class="recommend-counts">共 {{page.total}} 条评论</view> -->
		<!-- <EvalCard v-for="(item, index) in evals" :key="item.id" :item="item" :index="[index]" v-show="!item.hide"
				@replyToEval="replyToEval" @addStar="addStar" @moreOpt="moreOpt">
				<van-cell-group v-if="item.list.length > 0">
					<EvalCard v-for="(child, s) in item.list" :key="child.id" :item="child" :index="[index, s]" noreply
						@addStar="addStar" v-show="!child.hide" />
				</van-cell-group>
			</EvalCard>
			<view v-if="evals && evals.length<page.total"
				style="padding: 24rpx; margin: 24rpx atuo;text-align: center;">
				<text @click="loadMoreEvals">点击加载更多评论</text>
			</view>
			<van-share-sheet :show="showMoreOpt" title="更多操作" :options="options" @select="onSelect"
				@close="showMoreOpt=false" />
		</view> -->
		<!-- 回复和评价输入框 -->
		<!-- 	<view class="return-recommend" v-if="detail">
			<view class="recommend-content">
				<view class="eval-area">
					<van-icon name="edit" />
					<textarea fixed auto-height v-model="returnText" @input="onRecommendChange"
						:focus="returnTopId !== ''" @blur="onBulrReply" @confirm="onRecommendClick"
						@focus="isEnterEval=true" :placeholder="
              returnTopId ? focusReply : '喜欢就评论支持一下吧~'
            " />
				</view>
				<view class="eval-operation" v-if="!isEnterEval">
					<van-button color="#fff" open-type="share">
						<van-icon name="share-o" size="24" color="#666" />
					</van-button>
					<view @tap="addStar">
						<van-icon :name="detail.flag=== 1? 'like' :'like-o'" color="#ff6a5f" size="24" />
						<text v-if="detail.starter>0">{{ detail.starter }}</text>
					</view>
				</view>
				<view v-else class="eval-btn" @click="onRecommendClick" hover-class="navigator-hover">确定</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import EvalCard from "@/components/EvalCard.vue";
	import { updateLivePreview } from '@/api/live';
	import { getShowDetail, addEvaluate, delEvaluate } from "@/api/activity";
	import { userStore } from '@/store';
	import { mapState } from 'pinia';
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime";
	dayjs.extend(relativeTime);
	export default {
		components: {
			EvalCard,
		},
		data() {
			return {
				page: { current: 1, pageSize: 1, total: 0 },
				evals: null,
				detail: null,
				images: null,
				returnText: '',
				returnTopId: '',
				isEnterEval: false,
				focusReply: '',
				showMoreOpt: false, // 是否展示评论更多操作
				current: null,
				options: [{
					name: '删除',
					icon: 'https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/icon/1676355956647_delete.png'
				}],
			};
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			backPage() {
				uni.navigateBack({ delta: 1 });
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
				this.isEnterEval = false
			},
			onRecommendChange(event) {
				this.returnText = event.detail.value;
			},
			async onRecommendClick() {
				// 新增评论
				if (this.returnText.length < 2) {
					uni.showToast({
						icon: "none",
						title: "评论不少于2字",
					});
				}
				if (this.returnText && this.returnText.length > 1) {
					const newEval = {
						activityId: this.detail.activityId,
						message: this.returnText,
						topId: this.returnTopId,
						state: 0,
						status: 0,
					}
					const { code, data } = await addEvaluate(newEval);
					if (code === 200) {
						uni.showToast({
							title: '评论成功'
						})
						const { nickname, level, avatarUrl, appletUserId: id } = this.user
						this.returnText = "";
						this.returnTopId = "";
						this.focusReply = "";
						this.evals = [{
							...newEval,
							id: data,
							list: [],
							nickname,
							level,
							avatarUrl,
							appletUserId
						}, ...this.evals]
					}
				}
			},
			moreOpt(index) {
				this.showMoreOpt = true
				this.current = index
			},
			async onSelect(option) {
				switch (option.detail.name) {
					case '删除':
						await this.deleteEval();
						return;
					default:
						break;
				}
			},
			async deleteEval() {
				const index = this.current
				const item =
					this.current.length > 1 ?
					this.evals[index[0]].list[index[1]] :
					this.evals[index[0]];
				const { code, data } = await delEvaluate({ id: item.id });
				if (code === 200) {
					uni.showToast({
						icon: "success",
						title: "删除成功"
					})
					this.showMoreOpt = false
					if (index.length > 1) {
						this.evals[index[0]].list[index[
							1]] = { ...item, hide: true }
					} else {
						this.evals[index[0]] = { ...item, hide: true }
					}
					this.$forceUpdate();
				} else {
					uni.showToast({
						icon: "error",
						title: data
					})
				}
			},
			async addStar(item) {
				const { id, flag, starter } = this.detail
				const { code } = await updateLivePreview({ id, type: 1, starter: flag === 1 ? 0 : 1 })
				if (code === 200) {
					this.detail = {
						...this.detail,
						flag: flag === 1 ? 0 : 1,
						starter: flag === 1 ? starter - 1 : starter + 1
					}
				}
			},
			async getDetail(opt) {
				const { data } = await getShowDetail({ ...opt, ...this.page });
				if (data) {
					if (this.page.current === 1) {
						this.detail = {
							avatarUrl: data.avatarUrl,
							nickname: data.nickname,
							level: data.level,
							flag: data.flag,
							id: data.activityDetail.id,
							starter: data.activityDetail.starter,
							activityId: data.activityDetail.activityId,
							createTime: dayjs(data.activityDetail.createTime).fromNow(),
							title: data.activityProduct.productName,
							details: data.activityProduct.details,
						};
						this.evals = data.list.records
						this.page.total = data.list.total
						this.images = data.activityProduct.images.split(",");
					} else {
						this.evals = [...this.evals, ...data.list.records]
						this.page.total = data.list.total
					}
				}
			},
			async loadMoreEvals() {
				this.page.current += 1
				await this.getDetail({ id: this.detail.id })
			}
		},
		onLoad(opt) {
			this.getDetail(opt);
		},
	};
</script>

<style scoped>
	.show-detail-page {
		height: auto;
		min-height: 100vh;
		overflow-x: hidden;
	}

	.show-card {
		border-radius: 24rpx;
		background-color: #fff7fc;
		padding: 24rpx;
		padding-bottom: 40rpx;
	}

	.show-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.show-header .user-info {
		display: flex;
		align-items: center;
	}

	.show-header .user-info view {
		margin-left: 12rpx;
	}

	.level-text {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #fcd144;
	}

	.time-text {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.shows-imgs {
		margin-top: 30rpx;
		width: 700rpx;
		height: 780rpx;
		border-radius: 12rpx;
		overflow: hidden;
		background-color: #cccccc70;
	}

	.detail-info {
		padding-top: 32rpx;
	}

	.detail-title {
		font-size: 30rpx;
		font-weight: 600;
		margin-bottom: 12rpx;
	}

	.recommend-list {
		padding: 40rpx 0;
		--cell-background-color: transparent;
		padding-bottom: calc(env(safe-area-inset-bottom) + 88rpx);
	}

	.recommend-counts {
		margin: 0 24rpx;
		padding-bottom: 16rpx;
		border-bottom: 2rpx dotted #77777760;
	}

	/* 底部回复评论 */
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

	.eval-operation {
		display: flex;
		align-items: center;
		padding-left: 12rpx;
	}

	.eval-operation>view {
		margin: 0 12rpx;
		display: flex;
		align-items: center;
	}

	.eval-operation>view text {
		font-size: 24rpx;
		margin-left: 8rpx;
	}
</style>
