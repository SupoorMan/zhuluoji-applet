<template>
	<view class="authorization-page">
		<van-nav-bar
			title="授权"
			class="navbar"
			fixed
			left-arrow
			@click-left="backPage"
		></van-nav-bar>
		<view class="title">侏罗纪家仙女服务中心</view>
		<view class="title">申请获取以下权限</view>
		<view class=""><text>获得你的公开信息（昵称、头像等）</text></view>

		<button v-if="!user" class="button" open-type="getUserInfo" @getuserinfo="getUserInfo">
			登录授权
		</button>
		<button
			v-else-if="!user.phone"
			class="button"
			open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber"
		>
			手机号授权
		</button>
	</view>
</template>

<script>
import { login, getUserIofo, updateUser } from '@/api/user/user.js';
import WXBizDataCrypt from '@/utils/WXBizDataCrypt';
export default {
	data() {
		return {
			user: null,
			code: null
		};
	},
	methods: {
		getUserInfo(event) {
			var that = this;
			console.log(event.detail.userInfo);
			uni.getUserInfo({
				success(res) {
					console.log(res);
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
						uni.navigateBack({ delta: 1 });
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					mask: true,
					title: authorize.data.msg,
					duration: 1500
				});
			}
		},
		async getPhoneNumber(event) {
			const { code, data, msg } = await this.wxloginres(this.code, this.user);
			if (code === 200) {
				console.log(data);
				debugger;
				let pc = new WXBizDataCrypt('wxcfa80ada427f5deb', data.sessionKey);
				let phone = pc.decryptData(event.detail.encryptedData, event.detail.iv);
				console.log(phone);
				await updateUser({ phone: phone, id: this.user.id });
			} else {
				uni.showToast({
					title: msg,
					icon: 'error'
				});
			}
		},
		//登录后提交服务器获取进一步信息
		async wxloginres(wxcode, userInfo) {
			let that = this;
			return await login({
				code: wxcode,
				userInfo
			});
		},
		async getUser() {
			const res = await getUserIofo();
			if (res) {
				getApp().globalData.user = res.data;
			}
		},
		backPage() {
			uni.navigateBack({ delta: 1 });
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
	onShow() {
		this.user = getApp().globalData.user;
	}
};
</script>

<style>
.authorization-page {
	height: 100%;
	background-image: linear-gradient(to right, #f7f3f4, #ede5fc);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.title {
	font-size: 40rpx;
}
button.button {
	width: 448rpx;
	margin: 300rpx auto;
	border-radius: 28rpx;
	background-image: linear-gradient(to right, #cca0ff, #eadefc);
	box-shadow: 0 4rpx 20rpx #e6daf7;
	color: #fff;
	font-size: 28rpx;
	line-height: 82rpx;
}
button.button::after {
	border: 0;
}
</style>
