<template>
	<view class="rule-page">
		<view class="rule-content">
			<view class="rule-title">做任务赚积分</view>
			<view class="rule-card" style="margin-top: 40rpx;">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675073008484_getInter_sign.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">每日签到</view>
					<text>签到成功+1积分</text>
				</view>
				<view class="">
					<text>+1积分</text>
					<view class="rule-btn" @tap="jumpTo('/pages/user/daySignIn/daySignIn')">去签到</view>
				</view>
			</view>
			<view class="rule-card">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675132543742_getInter_appoint.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">预约直播商品上播提醒</view>
					<text>1积分/次，每日限一次</text>
				</view>
				<view class="">
					<text>+1积分</text>
					<view class="rule-btn" @tap="jumpTo('/pages/video/index')">去预约</view>
				</view>
			</view>
			<view class="rule-card">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675132583030_getInter_join.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">加入会员群送福利</view>
					<text>限新用户加入，入群可得10积分</text>
				</view>
				<view class="">
					<text>+10积分</text>
					<view class="rule-btn" @tap="!user ? jumpTo(''):''">
						<cell @startmessage='startmessage' @completemessage="completemessage" contactTextBlod="false"
							iconUrl="" contactText="去加入"
							url='https://work.weixin.qq.com/gm/8dfa7240fa5f2070805fb3d83911b297' v-if="user" />
						<template v-else>去加入</template>
					</view>

				</view>
			</view>
			<view class="rule-card">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675132667982_getInter_order.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">兑换订单评价</view>
					<text>对兑换订单发表评价并过审，根据评价字数及视频或图片可得2~10积分</text>
				</view>
				<view class="">
					<text>+2~10积分</text>
					<view class="rule-btn" @tap="jumpTo('/pages/shop/order/list')">去评价</view>
				</view>
			</view>
			<view class="rule-card">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675132622851_getInter_activity.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">参与“仙女买家秀”活动</view>
					<text>参与活动发表买家秀，根据评价字数及视频或图片可得2~10积分</text>
				</view>
				<view class="">
					<text>+2~10积分</text>
					<view class="rule-btn" @tap="jumpTo('/pages/buyerShow/index')">去评价</view>
				</view>
			</view>
			<view class="rule-card">
				<image
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1676014787065_getInter_trans.png"
					mode="aspectFit"></image>
				<view class="card-body">
					<view class="title-text">订单转化</view>
					<text>凭历史订单参与订单转化，按消费金额转化相应积分</text>
				</view>
				<view class="">
					<text>+相应积分</text>
					<view class="rule-btn" @tap="jumpTo('/pages/user/transferOrder/transfer')">去转换</view>
				</view>
			</view>
		</view>
		<!-- <van-popup round :show="showQr" @close="showQr=false">
			<view class="qr-content">
				<image :src="qrPath" mode="aspectFit" :show-menu-by-longpress="true"></image>
				<view style="display: flex;align-items: center; justify-content: center;">
					<text style="text-align: right;">扫一扫加入群聊</text>
					<button size="mini" open-type="share" pain style="margin-left: 40rpx;margin-right: 0;"> 分享</button>
				</view>
			</view>
		</van-popup> -->
	</view>
</template>

<script>
	import { userStore } from '@/store'
	import { mapState } from 'pinia'
	export default {
		data() {
			return {
				showQr: false,
				qrPath: 'https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1678169073219_qr_code.png'
			}
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			completemessage(mesg) {
				const errorList = {
					3002: '获取插件配置信息失败',
					3004: '用户信息授权失败',
					3005: '消息发送失败',
					3006: '用户已经加入群聊',
					3009: '群聊已满员',
					3010: '群聊已解散',
					3011: '用户命中企业群聊黑名单',
					3012: '用户已在群里中且群已满员',
				}
				if (mesg && errorList[mesg.errcode]) {
					uni.showModal({
						title: '温馨提示',
						content: errorList[mesg.errcode]
					})
				}
			},
			jumpTo(url) {
				if (!this.user) {
					uni.navigateTo({
						url: '/pages/user/authorization/index',
					})
				} else {
					if (url) {
						uni.navigateTo({
							url,
							fail() {
								uni.switchTab({
									url
								})
							}
						})
					}
				}
			},
		},
		onShareAppMessage() {
			return {
				title: '做任务赚积分',
				path: "/pages/shop/rules/interRules",
			};
		},
		// onLoad(opt) {
		// 	// 是否是二维码进入
		// 	if (opt && opt.code) {
		// 		this.showQr = true
		// 	}
		// }
	}
</script>

<style scoped>
	.rule-page {
		height: auto;
		min-height: 100vh;
		background: linear-gradient(to right top, #f4eef6, #ad7eb5);
	}

	.rule-content {
		background: url('https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1676014636485_getInter_bg.png') no-repeat top center;
		background-size: contain;
		padding-top: 40rpx;
		/* padding-top: 1rpx; */
	}

	.rule-title {
		text-align: center;
		padding-bottom: 40rpx;
		color: #693A7C;
		font-weight: bolder;
		font-size: 36rpx;
	}

	.rule-card {
		display: flex;
		align-items: flex-start;
		padding: 20rpx 20rpx;
		margin: 0 20rpx;
		background-color: #fff;
		/* border-radius: 20rpx; */
	}

	.rule-card:first-child {
		border-radius: 20rpx 20rpx 0 0;
	}

	.rule-card:last-child {
		border-radius: 0 0 20rpx 20rpx;
	}

	.rule-card image {
		width: 87rpx;
		height: 87rpx;
		margin-right: 10rpx;
	}

	.rule-card .card-body {
		width: 446rpx;
	}

	.rule-card .title-text {
		color: #454545;
		font-size: 30rpx;
		text-shadow: 0 0 1rpx #454545;
	}

	.rule-card text {
		font-size: 24rpx;
		color: #818080;
	}

	.rule-card .rule-btn {
		border-radius: 20rpx;
		color: #fff;
		text-align: center;
		padding: 4rpx 16rpx;
		background-color: #C09FCA;
		box-shadow: 0 0 4rpx 4rpx #EEDFED;
	}

	.qr-content {
		padding: 80rpx 0;
		text-align: center;
	}
</style>
<style>
	.groupCell--nickname {
		font-size: 28rpx !important;
		color: #fff !important;
		font-weight: normal !important;
		line-height: 38rpx !important;
		margin-left: 0 !important;
	}

	.groupCell--fn-hover-class,
	.groupCell--row-hover-class {
		background: #C09FCA !important;
	}

	.groupCell--arrow,
	.groupCell--group_chat_icon {
		display: none;
	}
</style>
