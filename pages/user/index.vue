<template>
	<view class="user-page">
		<van-nav-bar title="我的" class="navbar" fixed>
			<navigator :url="jumpPath('/pages/message/list')" slot="left">
				<van-icon name="chat-o" size="20" />
			</navigator>
		</van-nav-bar>
		<view class=""></view>
		<!-- 用户 -->
		<view class="user-card">
			<van-row>
				<van-col span="18">
					<view class="user-info">
						<van-image round height="134rpx" width="134rpx"
							:src="user && user.avatarUrl? user.avatarUrl : ''" fit="cover" />
						<view class="user-desc ">
							<navigator v-if="user" :url="jumpPath('/pages/user/userInfo/userInfo')">{{ user.nickname }}
							</navigator>
							<navigator v-else url="/pages/user/authorization/index">登录</navigator>
							<view class="user-code">{{ user ? user.uid : '' }}</view>
						</view>
					</view>
				</van-col>
				<van-col span="6">
					<view style="margin-top: 70rpx;text-align: right;">
						<navigator :url="jumpPath('/pages/user/daySignIn/daySignIn')" class="sign-btn"
							v-if="!todayIsSign">
							<van-button icon="edit" size="small" round color="#fc817c">
								签到
							</van-button>
						</navigator>
						<van-button icon="edit" size="small" round color="#fc817c" v-else>
							已签到
						</van-button>
					</view>
				</van-col>
			</van-row>
		</view>

		<!-- 等级卡片 -->
		<view class="level-card">
			<view>当前等级</view>
			<view class="level-content">
				<text>LV{{ user ? user.level : 0 }}</text>
				<text v-if="user&& user.level<4">LV{{ user ? user.level + 1 : 1 }}</text>
			</view>
			<van-progress v-if="user && user.level<4" track-color="#f0e2ff" color="#fff" :show-pivot="false"
				:percentage="(user.growth/expensLv[user.level])*100" />
			<view class="level-tip" v-if="user && user.level<4">{{user.growth}}/{{expensLv[user.level]}},
				还差{{expensLv[user.level] - user.growth }}经验值，便可升级</view>
			<view class="level-content">
				<view class="content-unit">
					<view>{{ user ? user.growth : 0 }}</view>
					<view>成长值</view>
				</view>
				<view class="content-unit">
					<view>{{ user ? user.integral : 0 }}</view>
					<view>积分</view>
				</view>
			</view>
		</view>
		<!-- 我的服务 -->
		<view class="title">我的服务</view>
		<view class="service">
			<van-grid column-num="3" :border="false">
				<van-grid-item use-slot link-type="navigateTo" :url="jumpPath('/pages/user/transferOrder/transfer')">
					<view class="service-icon icon-1">
						<van-icon name="after-sale" color="#fff" size="72rpx" />
					</view>
					<view class="">订单转换</view>
				</van-grid-item>
				<van-grid-item use-slot link-type="navigateTo" :url="jumpPath('/pages/message/list')">
					<view class="service-icon icon-2">
						<van-icon name="comment-o" color="#fff" size="72rpx" />
					</view>
					<view class="">信息中心</view>
				</van-grid-item>
				<van-grid-item use-slot link-type="navigateTo"
					:url="jumpPath(user&& user.id ?'/pages/video/appointment/index?appletUserId=' + user.id:'')">
					<view class="service-icon icon-3">
						<van-icon name="todo-list-o" color="#fff" size="72rpx" />
					</view>
					直播预约
				</van-grid-item>
			</van-grid>
		</view>
		<view class="tools">
			<view>更多工具</view>
			<van-grid column-num="4" :border="false">
				<van-grid-item icon="orders-o" text="订单" link-type="navigateTo"
					:url="jumpPath('/pages/shop/order/list')" />
				<van-grid-item use-slot>
					<view class="button">
						<van-button open-type="contact" size="large">
							<van-icon name="service-o" size="48rpx" color="#646566" />
							<view style="color:#646566;padding-top: 8rpx; font-size: 24rpx;">
								<text>
									客服
								</text>
							</view>
						</van-button>
					</view>
				</van-grid-item>
				<van-grid-item icon="contact" text="用户" link-type="navigateTo"
					:url="jumpPath('/pages/user/userInfo/userInfo')" />
				<van-grid-item icon="records" text="建议分享" />
				<van-grid-item icon="info-o" text="关于我们" />
				<van-grid-item icon="point-gift-o" text="敬请期待" />
			</van-grid>
		</view>
		<button open-type="contact" id="contact"></button>
	</view>
</template>

<script>
	import { userStore } from '@/store'
	import { mapActions, mapState } from 'pinia'
	export default {
		data() {
			return {
				expensLv: {
					0: 1000,
					1: 5000, // 4000,
					2: 10000, // 5000,
					3: 30000 // 20000
				},
				expens: 1000 // 经验值
			};
		},
		computed: {
			...mapState(userStore, ['user', 'todayIsSign']),
			// currentExpens() {
			// 	if (this.user && this.user.level) {
			// 		const curLevel = this.user.level
			// 		const expensArr = this.expensLv
			// 		let minExpens = 0
			// 		for (let o in expensArr) {
			// 			if (o < curLevel) {
			// 				minExpens += expensArr[o]
			// 			}
			// 		}
			// 		return this.user.growth - minExpens
			// 	}
			// 	return 0
			// },
		},
		methods: {
			...mapActions(userStore, ['getUser']),
			jumpPath(realpath) {
				return this.user ? realpath : '/pages/user/authorization/index';
			},
		},
		onShow() {
			this.getUser()
		}
	};
</script>

<style scoped>
	.user-page {
		display: flex;
		flex-direction: column;
		padding-bottom: 32rpx;
		padding-top: 1rpx;
		height: 100%;
	}

	.user-card {
		width: 668rpx;
		margin: 0 auto;
		padding-top: 32rpx;
	}

	.sign-btn {
		background-color: #fc817c;
		border-radius: 36rpx;
		border: 4rpx solid #fff;
		padding-right: 16rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		font-size: 30rpx;
	}

	.user-desc {
		margin-left: 16rpx;
		font-size: 30rpx;
	}

	.user-code {
		font-size: 24rpx;
		color: #999;
		padding-top: 24rpx;
	}

	.level-card {
		color: #fff;
		width: 668rpx;
		background-color: #cb9eff;
		margin: 24rpx auto;
		text-align: center;
		border-radius: 24rpx;
		padding: 16rpx 32rpx;
		border: 2rpx solid #fff;
	}

	.level-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 16rpx;
	}

	.level-tip {
		font-size: 24rpx;
		line-height: 2;
	}

	.content-unit {
		flex: 1;
	}

	.title {
		padding-top: 16rpx;
		text-align: center;
	}

	.service {
		width: 686rpx;
		border-radius: 24rpx;
		margin: 0 auto;
		--grid-item-content-background-color: transparent;
	}

	.service-icon {
		height: 150rpx;
		border: 2rpx solid #fff;
		border-radius: 32rpx;
		width: 100%;
		text-align: center;
		margin-bottom: 16rpx;
		line-height: 174rpx;
	}

	.icon-1 {
		background-color: #fac986;
	}

	.icon-2 {
		background-color: #bef5b5;
	}

	.icon-3 {
		background-color: #fab1d8;
	}

	.tools {
		width: 668rpx;
		margin: 64rpx auto 0 auto;
		border-radius: 24rpx;
		background-color: #fff;
		text-align: center;
		padding-top: 24rpx;
		padding-bottom: 32rpx;
		--grid-item-content-padding: 32rpx 0 0 0;
		--button-default-border-color: transparent;
		--button-default-background-color: transparent;
	}
</style>
<style>
	.tools .button button {
		display: flex !important;
		flex-direction: column;
	}
</style>
