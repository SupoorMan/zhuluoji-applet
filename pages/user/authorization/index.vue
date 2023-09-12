<template>
	<view class="authorization-page">
		<!-- <van-nav-bar title="授权" class="navbar" left-arrow @click-left="backPage"></van-nav-bar> -->
		<view class="logo">
			<image src="/static/setting/logo.png" mode="aspectFill"></image>
		</view>
		<view class="title">侏罗纪家仙女VIP专属</view>
		<view><text>申请获取以下权限</text></view>
		<view class=""><text>获得你的公开信息（昵称、头像等）</text></view>

		<button v-if="!user" class="button" open-type="getUserInfo" @getuserinfo="getUserInfo">微信一键登录</button>
		<button v-else-if="user && !user.phone" class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			手机号授权
		</button>
	</view>
</template>

<script>
	import { login, updateUser } from '@/api/user.js';
	import WXBizDataCrypt from '@/utils/WXBizDataCrypt';
	import { userStore } from '@/store'
	import { mapActions, mapState } from 'pinia'
	export default {
		data() {
			return {
				code: null
			};
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			...mapActions(userStore, ['setUser', 'getUser']),
			getUserInfo(event) {
				var that = this;
				uni.getUserInfo({
					success(res) {
						// console.log(res);
						that.wxlogin(event.detail.userInfo);
					},
					fail() {
						console.log('获取用户信息失败');
					}
				});
			},
			async wxlogin(userInfo) {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				const authorize = await _this.wxloginres(this.code, userInfo);
				if (authorize.code === 200) {
					uni.setStorageSync('uid', authorize.data.uid);
					await _this.getUser();
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '登录成功',
						duration: 1500,
						success() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						mask: true,
						title: authorize.msg,
						duration: 1500
					});
				}
			},
			async getPhoneNumber(event) {
				const { code, data, msg } = await this.wxloginres(this.code, this.user);
				if (code === 200) {
					let pc = new WXBizDataCrypt('wxcfa80ada427f5deb', data.sessionKey);
					let decryptData = pc.decryptData(event.detail.encryptedData, event.detail.iv);
					await updateUser({
						phone: decryptData.phoneNumber,
						id: this.user.id
					});
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '授权成功',
						duration: 1500,
						success() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				} else {
					uni.showToast({
						title: msg,
						icon: 'error'
					});
				}
			},
			//登录后提交服务器获取进一步信息
			async wxloginres(wxcode, userInfo) {
				return await login({
					code: wxcode,
					userInfo
				});
			},
			backPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onLoad(options) {
			// 先获取code缓存到data中
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					this.code = loginRes.code;
					console.log(this.code);
				}
			});
		},
	};
</script>

<style scoped>
	.authorization-page {
		height: 100%;
		background-image: url('https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1672973995864_acess-bg.png');
		background-size: cover;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 40rpx;
		color: #737374;
		font-weight: bolder;
		margin-top: 24rpx;
		margin-bottom: 18rpx;
	}

	.logo {
		width: 246rpx;
		height: 246rpx;
		border-radius: 50%;
		border: 6rpx solid #bb81da;
		text-align: center;
		padding-top: 12rpx;
	}

	.logo image {
		height: 210rpx;
		width: 210rpx;
		border-radius: 50%;
		line-height: 246rpx;
	}

	button.button {
		width: 476rpx;
		margin: 300rpx auto;
		border-radius: 58rpx;
		background-color: #bb81da60;
		/* background-image: linear-gradient(to right, #cca0ff, #eadefc); */
		box-shadow: 0 4rpx 20rpx #e6daf7;
		color: #fff;
		font-size: 36rpx;
		line-height: 114rpx;
		text-shadow: 2rpx 4rpx 4rpx #7f499c;
	}

	button.button::after {
		border: 4rpx solid #f6e7ff;
	}
</style>