<template>
	<view class="day-sign">
		<van-nav-bar title="每日签到" class="navbar" fixed left-arrow @click-left="backPage"></van-nav-bar>
		<view class="">
			<view class="top-inter">
				<view class="inter-content">
					<text class="inter-text">{{ user? user.integral : 0 }}</text>
					<van-icon name="/static/shop/inter-icon.png" size="40rpx" />
				</view>
				<navigator class="inter-btn" open-type="switchTab" url="/pages/shop/index">
					<text>去兑换</text>
					<van-icon name="arrow" />
				</navigator>
			</view>
			<view class="calendar-content">
				<i class="calendar-disposition1"></i>
				<i class="calendar-disposition2"></i>
				<i class="calendar-disposition3"></i>
				<view class="calendar-body">
					<div class="small-bg"></div>
					<div class="bottom-bg1"></div>
					<div class="bottom-bg2"></div>
					<div class="bottom-bg3"></div>

					<van-calendar readonly :show-confirm="false" :show-title="false" :poppable="false"
						:show-mark="false" color="transparent" type="multiple" :row-height="calendarLineHeight"
						:default-date="signDays" class="calendar" :min-date="monthStart" :max-date="monthEnd" />
					<view class="sign-btn" @tap="setSign">
						<div class="btn-text"> {{!todayIsSign ? '立即签到' : '已签到'}}</div>
						<text class="btn-tip">每日签到可得1积分</text>
					</view>
				</view>
			</view>
			<view class="sign-tip">
				<view class="tip-title">
					<van-row>
						<van-col span="8" custom-class="">签到奖励</van-col>
						<van-col span="16" style="text-align: right;">
							本月累计签到
							<text style="color:#c7a3d8">{{ totalDays }}</text>
							天
						</van-col>
					</van-row>
				</view>

				<view class="sign-tip-grid">
					<van-grid column-num="3" :border="false" gutter="10">
						<van-grid-item use-slot content-class="grid-item ">
							<view class="">
								<van-icon name="/static/shop/inter-icon.png" size="50rpx" />
							</view>
							<text>累计签到7天</text>
							<text class="small-text">额外奖励3积分</text>
						</van-grid-item>
						<van-grid-item use-slot content-class="grid-item ">
							<view class="">
								<van-icon name="/static/shop/inter-icon.png" size="50rpx" />
							</view>
							<text>累计签到15天</text>
							<text class="small-text">额外奖励5积分</text>
						</van-grid-item>
						<van-grid-item use-slot content-class="grid-item ">
							<view class="">
								<van-icon name="/static/shop/inter-icon.png" size="50rpx" />
							</view>
							<text>累计签到25天</text>
							<text class="small-text">额外奖励10积分</text>
						</van-grid-item>
					</van-grid>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getSignDays, signDay } from '@/api/signIn.js'
	import dayjs from 'dayjs'
	import { userStore } from '@/store'
	import { mapActions, mapState } from 'pinia'
	export default {
		data() {
			return {
				signDays: [],
				totalDays: 0,
				calendarLineHeight: uni.upx2px(80),
				monthStart: dayjs().startOf('month'),
				monthEnd: dayjs().endOf('month'),
				hasSign: false,
			};
		},
		computed: {
			...mapState(userStore, ['user', 'todayIsSign'])
		},
		methods: {
			...mapActions(userStore, ['setUser', 'updateSign', 'getUser']),
			async getSigns() {
				const { data } = await getSignDays({
					date: dayjs().format('YYYY-MM-DD')
				})
				this.totalDays = data.all
				const monthDays = this.getDaysArrayByMonth()
				const signDays = []
				data.sign.split('').forEach((isSign, index) => {
					if (isSign === '1') {
						signDays.push(dayjs(monthDays[index]).format('YYYY-MM-DD'))
					}
				})
				this.signDays = [...signDays]
			},
			getDaysArrayByMonth() { // 当月每日日期
				//获取当前月份包含的天数
				var daysInMonth = dayjs().daysInMonth();
				var arrDays = [];
				//循环获取月份里的日期
				while (daysInMonth) {
					var current = dayjs().date(daysInMonth);
					arrDays.push(current);
					daysInMonth--;
				}
				return arrDays.reverse();
			},
			backPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			async setSign() {
				const { data } = await signDay()
				if (data && data.includes('已签')) {
					uni.showModal({
						content: "今日已签到",
						showCancel: false
					})
					return
				} else {
					uni.showModal({
						content: "签到成功!",
						showCancel: false
					})
				}
				this.updateSign(true)
				await this.getSigns()
				this.getUser()
			}
		},
		onLoad(opt) {
			this.getSigns()
		}
	};
</script>

<style scoped>
	.day-sign {
		height: auto;
		padding-bottom: 32rpx;
		overflow-x: hidden;
	}

	.top-inter {
		background: url('@/static/signday/top.png') no-repeat right;
		background-size: contain;
		height: 214rpx;
		margin: 0 32rpx;
	}

	.inter-content {
		display: flex;
		align-items: center;
		padding-top: 32rpx;
	}

	.inter-text {
		font-size: 40rpx;
		margin-right: 16rpx;
	}

	.inter-btn-text {
		color: #666;
	}

	.inter-btn {
		border: 2rpx solid #fff;
		text-align: center;
		padding: 2rpx 12rpx 2rpx 22rpx;
		display: inline-flex;
		width: 104rpx;
		height: 48rpx;
		line-height: 38rpx;
		border-radius: 24rpx;
		background: radial-gradient(at center, #f8f4fa, #eadeef, #dfcce6);
		font-size: 24rpx;
		margin-top: 16rpx;
		color: #666;
		align-items: center;
	}

	.calendar-content {
		position: relative;
		top: -45rpx;
		margin: 0 24rpx;
	}

	.calendar-disposition1:before,
	.calendar-disposition2:before,
	.calendar-disposition3:before {
		content: '';
		position: relative;
		display: block;
		background: url('@/static/signday/s6.png') no-repeat;
		left: -6rpx;
		top: -26rpx;
		background-size: contain;
		width: 26rpx;
		height: 36rpx;
	}

	.calendar-disposition1,
	.calendar-disposition2,
	.calendar-disposition3 {
		position: absolute;
		width: 14rpx;
		height: 14rpx;
		border-radius: 7rpx;
		background-color: #c49dd8;
		display: block;
		top: 10rpx;
	}

	.calendar-disposition1 {
		left: 40rpx;
	}

	.calendar-disposition2 {
		left: 80rpx;
	}

	.calendar-disposition3 {
		left: 120rpx;
	}

	.bottom-bg1 {
		position: absolute;
		display: block;
		background: url('@/static/signday/left.png') no-repeat;
		left: -54rpx;
		bottom: 42%;
		background-size: contain;
		width: 162rpx;
		height: 138rpx;
	}

	.bottom-bg2 {
		position: absolute;
		display: block;
		background: url('@/static/signday/bottom-2.png') no-repeat;
		right: -77rpx;
		bottom: 18%;
		background-size: contain;
		width: 314rpx;
		height: 248rpx;
	}

	.bottom-bg3 {
		position: absolute;
		display: block;
		background: url('@/static/signday/bottom-1.png') no-repeat;
		left: -36rpx;
		bottom: 16%;
		background-size: contain;
		width: 274rpx;
		height: 192rpx;
	}

	.bottom-bg2::before {
		content: '';
		position: absolute;
		display: block;
		background: url('@/static/signday/s4.png') no-repeat;
		left: -6rpx;
		top: -36rpx;
		background-size: contain;
		width: 41rpx;
		height: 36rpx;
	}

	.bottom-bg2::after {
		content: '';
		position: absolute;
		display: block;
		background: url('@/static/signday/s3.png') no-repeat;
		left: -106rpx;
		top: 56rpx;
		background-size: contain;
		width: 34rpx;
		height: 34rpx;
	}

	.small-bg {
		position: absolute;
		display: block;
		background: url('@/static/signday/s2.png') no-repeat;
		left: 41%;
		top: 37%;
		background-size: contain;
		width: 32rpx;
		height: 32rpx;
	}

	.small-bg::before {
		content: '';
		position: absolute;
		display: block;
		background: url('@/static/signday/s1.png') no-repeat;
		left: -198rpx;
		top: -66rpx;
		background-size: contain;
		width: 50rpx;
		height: 54rpx;
	}

	.small-bg::after {
		content: '';
		position: absolute;
		display: block;
		background: url('@/static/signday/s5.png') no-repeat;
		right: -282rpx;
		top: -32rpx;
		background-size: contain;
		width: 40rpx;
		height: 34rpx;
	}

	.calendar-body {
		padding-bottom: 12rpx;
		border-radius: 24rpx;
		background-color: #fff;
		box-shadow: -4rpx 3rpx 6rpx #cfb2d9;
		padding: 0 16rpx 16rpx 16rpx;
	}

	.sign-btn {
		width: 264rpx;
		border-radius: 40rpx;
		height: 86rpx;
		border: 4rpx solid #f5e1ff;
		background-color: #c8a3d8;
		color: #fff;
		margin: 64rpx auto 32rpx auto;
		text-align: center;
		padding: 8rpx 12rpx;
		line-height: 1;
	}

	.btn-text {
		text-shadow: 2rpx 2rpx 10rpx #9b62c0;
	}

	.btn-tip {
		font-size: 18rpx;
	}

	.small-text {
		font-size: 22rpx;
		color: #7f7f7f;
	}
</style>
<style>
	.calendar {
		--calendar-height: 568rpx;
		--calendar-header-box-shadow: none;
		--calendar-background-color: transparent;
		position: relative;
		z-index: 2;
	}

	.van-calendar__day>view {
		width: 48rpx !important;
		height: 48rpx !important;
		border-radius: 24rpx !important;
		line-height: 48rpx;
	}

	.van-calendar__day--multiple-selected>view,
	.van-calendar__day--start>view,
	.van-calendar__day--end>view,
	.van-calendar__day--multiple-middle>view,
	.van-calendar__day--start-end>view {
		background-color: #dec8e8;
	}

	.sign-tip {
		padding: 24rpx 0;
		margin: 0 24rpx;
		background-color: #fff;
		border-radius: 24rpx;
		box-shadow: 4rpx 4rpx 6rpx #cfb2d9;
		--grid-item-content-background-color: #ede2f2;
	}

	.tip-title {
		padding: 0 24rpx;
		/* padding-bottom: 24rpx; */
	}

	.sign-tip-grid {
		margin-top: 24rpx;
		line-height: 1.8;
	}

	.van-grid-item__content {
		border-radius: 12rpx;
		overflow: hidden;
	}

	.grid-item {
		border-radius: 12rpx;
		overflow: hidden;
		text-shadow: 2rpx 2rpx 10rpx #d5bce1;
	}
</style>
