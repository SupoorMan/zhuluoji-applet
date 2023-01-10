<script>
import { userStore } from '@/store';
export default {
	globalData: {
		user: null
	},
	methods: {
		login(userInfo) {
			uni.login({
				success: res => {
					if (res.code) {
						this.$request
							.post('/wx/login', {
								code: res.code,
								userInfo: {
									avatarUrl: userInfo.avatarUrl,
									nickName: userInfo.nickName
								}
							})
							.then(res => {
								console.log(res);
							});
					}
				}
			});
		}
	},
	onLaunch: function() {
		console.log('App Launch');
		let _this = this;
		uni.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 获取用户信息
					_this.$request.get('/auser/getUser').then(res => {
						console.log(res);
						_this.globalData.user = res.data;
						// userStore().setUser(res.data)
					});
				} else {
					// _this.login(res.authSetting['scope.userInfo']);
				}
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
@import '/wxcomponents/vant/common/index.wxss';

*,
view {
	box-sizing: border-box;
	font-size: 28rpx;
	font-family: '微软雅黑', sans-serif;
}

page {
	height: calc(100vh);
	box-sizing: border-box;
	--button-primary-color: #dbbffd;
}

/*每个页面公共css */
page > view {
	background-image: linear-gradient(to top right, #f9f6f2, #ede5fc);
	color: #666;
	padding-left: env(safe-area-inset-left);
	padding-right: env(safe-area-inset-right);
	padding-bottom: env(safe-area-inset-bottom);
}

.navbar {
	width: 100%;
	--nav-bar-background-color: transparent;
	padding-bottom: var(--nav-bar-height);
	z-index: 2;
	position: relative;
}

.navbar + view {
	padding-top: calc(var(--status-bar-height) + 68px);
}

.van-nav-bar {
	background-image: linear-gradient(to top right, #f6f1f5, #ede5fc);
}
</style>
