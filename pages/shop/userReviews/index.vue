<template>
	<view class="review-page">
		<van-tabs :active="active" animated @change="changeTab">
			<van-tab :title="item.name" v-for="item in reviewType" :key="item.key" :name="item.key">
				<view class="review-list">
					<van-cell-group>
						<EvalCard v-for="(item, index) in recommendList" :key="item.id" :item="item" :index="[index]"
							@addStar="addStar">

						</EvalCard>
					</van-cell-group>
				</view>
			</van-tab>
		</van-tabs>
		<!-- <view class="return-recommend">
			<view class="recommend-content">
				<view class="eval-area">
					<van-icon name="edit" />
					<textarea fixed v-model="returnText" @input="onRecommendChange" :placeholder="
		      returnTopId ? focusReply : '喜欢就评论支持一下吧~(至少15字)'
		    " auto-height @blur="onBulrReply" :focus="returnTopId !== ''" @confirm="onRecommendClick"></textarea>
				</view>
				<view class="eval-btn" @click="onRecommendClick" hover-class="navigator-hover">确定</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import EvalCard from "@/components/EvalCard.vue";
	import {
		getEvals,
		getEvalsCount,
		updateEvaluate,
		addEvaluate
	} from '@/api/review';
	import dayjs from 'dayjs';
	export default {
		components: {
			EvalCard
		},
		data() {
			return {
				active: 'all',
				reviewType: [{
						name: '全部',
						key: 'all'
					},
					{
						name: '图文',
						key: 'pic'
					},
					{
						name: '最新',
						key: 'new'
					}
				],
				page: {
					current: 1,
					pageSize: 20,
					productId: ''
				},
				recommendList: null,
				returnTopId: null,
				returnText: '',
				focusReply: ''

			};
		},
		methods: {
			async changeTab(event) {
				this.active = event.detail.name;
				const params = {
					...this.page,
					flag: event.detail.name === 'pic' ? 0 : 1
				}
				await this.getList(event.detail.name !== 'all' ? params : this.page);
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
			async addStar(index) {
				const item =
					index.length > 1 ?
					this.recommendList[index[0]].list[index[1]] :
					this.recommendList[index[0]];
				const {
					code
				} = await updateEvaluate({
					...item,
					starter: item.flag === 1 ? 0 : 1,
				});
				if (code === 200) {
					const newItem = {
						...item,
						starter: item.flag === 1 ? item.starter - 1 : item.starter + 1,
						flag: item.flag === 1 ? 0 : 1,
					};
					if (index.length > 1) {
						this.recommendList[index[0]].list[index[1]] = newItem;
					} else {
						this.recommendList[index[0]] = newItem;
					}
					this.$forceUpdate();
				}
			},
			onRecommendChange(event) {
				this.returnText = event.detail.value;
			},
			async onRecommendClick() {
				// 新增评论
				if (this.returnText.length < 15) {
					uni.showToast({
						icon: "none",
						title: "评论至少15字",
					});
				}
				if (this.returnText && this.returnText.length > 14) {
					const {
						code,
						data
					} = await addEvaluate({
						productId: this.page.productId,
						message: this.returnText,
						topId: this.returnTopId,
						state: 0,
						type: 2,
					});
					if (code === 200) {
						this.returnText = "";
						this.returnTopId = "";
						this.focusReply = "";
						await this.getList();
					}
				}
			},
			async getList(option) {
				const result = await getEvals(option);
				if (result.code === 200) {
					this.recommendList = result.data.records;
				}
			},

			cutDate(date) {
				return dayjs(item.createTime).format('YY-MM-DD')
			},
			onChange(event) {
				this.activeNames = event.detail;
			},
			async getCount(option) {
				const result = await getEvalsCount(option);
				if (result.code === 200) {
					this.reviewType = this.reviewType.map(m => {
						m = {
							...m,
							name: m.name + '（' + result.data[m.key] + '）'
						}
						return m
					})
				}
			}
		},
		onLoad(option) {
			this.page.productId = option.productId;
			this.getList(this.page);
			this.getCount(option)
		}
	};
</script>
<style scoped>
	.review-page {
		height: auto;
		min-height: 100vh;
	}

	.review-list {
		padding-bottom: calc(env(safe-area-inset-bottom) + 88rpx);
		/* margin-top: 40rpx; */
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
	.review-page {
		height: 100%;
		/* --tabs-nav-background-color: transparent; */
		--tab-active-text-color: #d695ff;
		--tabs-bottom-bar-color: #d695ff;
		--tabs-line-height: 80rpx;
	}

	.review-collapse {}

	.review-tools {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
