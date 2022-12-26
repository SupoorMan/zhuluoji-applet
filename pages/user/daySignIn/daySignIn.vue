<template>
	<view class="day-sign">
		<van-nav-bar title="每日签到" class="navbar" fixed left-arrow></van-nav-bar>
		<view class="">
			<view class="top-inter">
				<view class="inter-content">
					<text class="inter-text">2000</text>
					<van-icon name="/static/shop/inter-icon.png" size="40rpx" />
				</view>
				<view class="inter-btn">
					<text>去兑换</text>
					<van-icon name="arrow" />
				</view>
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
					<van-calendar
						:show-title="false"
						:poppable="false"
						:show-confirm="false"
						:show-mark="false"
						color="#dec8e8"
						:row-height="calendarLineHeight"
						class="calendar"
					/>
					<view class="sign-btn">
						<div class="btn-text">立即签到</div>
						<text class="btn-tip">每日签到可得1积分</text>
					</view>
				</view>
			</view>
			<view class="sign-tip">
				<van-row custom-class="tip-title">
					<van-col span="8">签到奖励</van-col>
					<van-col span="16" style="text-align: right;">
						本月累计签到
						<text style="color:#c7a3d8">22</text>
						天
					</van-col>
				</van-row>
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
export default {
	data() {
		return {
			calendarLineHeight: uni.upx2px(80)
		};
	},
	methods: {}
};
</script>

<style>
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
	width: 134rpx;
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
.calendar {
	--calendar-height: 568rpx;
	--calendar-header-box-shadow: none;
	--calendar-background-color: transparent;
	position: relative;
	z-index: 2;
}

.van-calendar__selected-day {
	width: 48rpx !important;
	height: 48rpx !important;
	border-radius: 24rpx !important;
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
}
.btn-text {
	text-shadow: 2rpx 2rpx 10rpx #9b62c0;
}
.btn-tip {
	font-size: 18rpx;
}
.tip-title {
	padding: 0 24rpx;
	padding-bottom: 24rpx;
}
.sign-tip {
	padding: 24rpx 0;
	margin: 0 24rpx;
	background-color: #fff;
	border-radius: 24rpx;
	box-shadow: 4rpx 4rpx 6rpx #cfb2d9;
	--grid-item-content-background-color: #ede2f2;
}
.sign-tip-grid {
	margin-top: 24rpx;
	line-height: 1.8;
}
.grid-item {
	border-radius: 12rpx;
	overflow: hidden;
	text-shadow: 2rpx 2rpx 10rpx #d5bce1;
}
.small-text {
	font-size: 22rpx;
	color: #7f7f7f;
}
</style>
