<template>
	<view class="notice-page">
		<view class="notice-list">
			<view class="notice-card" v-for="notice in list" :key="notice.id">
				<view class="card-header">
					<view class="title">
						<van-icon :name="source[notice.type].icon" :color="source[notice.type].color" size="20" />
						<text :style="{'color': source[notice.type].color}">{{source[notice.type].text}}</text>
					</view>
					<view style="font-size: 24rpx;">{{cutTime(notice.createTime)}}</view>
				</view>
				<view class="card-body">
					<view class="notice-message">
						{{notice.message}}
					</view>
				</view>
			</view>
			<view v-if="list && list.length!==page.total"
				style="padding: 24rpx; margin: 24rpx atuo;text-align: center;">
				<text @click="loadMore">加载更多>></text>
			</view>
		</view>
		<view v-if="list && list.length===0" class="empty">
			抱歉 ,您暂无站内消息
		</view>
	</view>
</template>

<script>
	import { getNotice, readNotice } from '@/api/user';
	import dayjs from 'dayjs';
	import { mapActions, mapState } from 'pinia'
	import { userStore } from '../../store';
	export default {
		data() {
			return {
				page: {
					current: 1,
					pageSize: 10,
					total: 0
				},
				source: {
					6: {
						icon: 'points', //
						color: '#FCBF40',
						text: '积分通知'
					},
					7: {
						icon: 'points', //
						color: '#FCBF40',
						text: '积分通知'
					},
					8: {
						icon: 'points', //
						color: '#FCBF40',
						text: '积分通知'
					},
					0: {
						icon: 'points', //
						color: '#FCBF40',
						text: '积分通知'
					},
					1: {
						icon: 'setting-o',
						color: '#737374',
						text: '系统通知'
					},
					4: {
						icon: 'gift-o', //
						color: '#FF8141',
						text: '积分兑换'
					},
					9: {
						icon: 'logistics', //
						color: '#418DFF',
						text: '订单物流'
					},
					2: {
						icon: 'video-o', //
						color: '#BB81DA',
						text: '直播预约'
					},
					10: {
						icon: 'medal-o', // <van-icon name="medal-o" />
						color: '#FF4141',
						text: '等级通知'
					},
				},
				list: null
			};
		},
		computed: {
			...mapState(userStore, ['user', 'noticeCount'])
		},
		methods: {
			...mapActions(userStore, ['updateNoticeCount']),
			async getList() {
				const { code, data } = await getNotice({ ...this.page, appletUserId: this.user.id });
				if (code === 200) {
					if (this.page.current !== 1) {
						this.list = [...this.list, ...data.records]
					} else {
						this.list = data.records;
						this.page.total = data.total;
					}
				}
			},
			async UpdateRead() {
				await readNotice();
				this.updateNoticeCount(0);
			},
			cutTime(date) {
				return dayjs(date).format('YY/MM/DD HH:mm');
			},
			async loadMore() {
				this.page.current += 1
				await this.getList()
			}
		},
		onLoad(opt) {
			this.getList();
			if (this.noticeCount) {
				this.UpdateRead()
			}
		}
	};
</script>

<style scoped>
	.notice-page {
		height: atuo;
		min-height: 100vh;
	}

	.notice-list {
		padding: 16rpx 0;
	}

	.notice-card {
		background-color: #fff;
		margin: 16rpx;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 16rpx 16rpx;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		display: flex;
		align-items: center;
	}

	.card-header text {
		margin-left: 8rpx;
	}

	.card-body {
		display: flex;
		align-items: flex-start;
		padding-top: 16rpx;
	}

	.notice-message {
		border-left: 2rpx solid #79797940;
		padding-left: 12rpx;
		font-size: 24rpx;
	}

	.empty {
		padding: 300rpx 0;
		text-align: center;
	}
</style>
