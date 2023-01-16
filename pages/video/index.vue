<template>
	<view class="page-live">
		<!-- 日历 -->
		<view class="live-week">
			<view class="month-title">{{currentMonth}}</view>
			<swiper class="week-swiper">
				<swiper-item indicator-dots="true" indicator-color="#fff" indicator-active-color="#F5C2A9">
					<view class="swiper-item">
						<view class="weekdays">
							<view v-for="weekday in currentWeek" :key="weekday">{{weekday.weekName}}</view>
						</view>
						<view class="weekdays">
							<view class="week-day" v-for="weekday in currentWeek" :key="weekday.text"
								@tap="handelChangeWeek(weekday)" :class="{'active':currentDay===weekday.value }">
								{{weekday.text}}
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 轮播广告 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" :autoplay="true" :interval="3000" :duration="1000" circular v-if="banners">
				<swiper-item v-for="bn in banners" :key="bn.id">
					<view class="swiper-item">
						<van-image :src="bn.url" width="726rpx" height="300rpx"></van-image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 直播间预告 -->
		<view class="live-banner">
			<view class="live-tab-header">
				<view class="left" @tap="changeTab(0)" :class="activeLive === 0 ? 'active' : ''">
					<text class="tab-text">酷酷的侏罗纪家居</text>
				</view>
				<view class="right" style="text-align: right;" @tap="changeTab(1)"
					:class="activeLive === 1 ? 'active' : ''">
					<text class="tab-text">酷酷的侏罗纪家纺</text>
				</view>
			</view>
			<view class="live-prods" :style="
          activeLive === 0
            ? 'border-top-right-radius: 20rpx;'
            : 'border-top-left-radius: 20rpx;'">
				<AppointmentCard v-for="item in prods" :key="item.id" :item="item" :user="user" />
				<view class="custom-image" v-if="!prods ||  prods.length===0">

					<view style="color: #525151;">暂无直播商品</view>
					<view style="color: #525151;">敬请期待</view>

				</view>
			</view>
		</view>

		<!-- 我的预约 -->
		<view class="appointment-btn" hover-class="navigator-hover" @tap="toAppoint">
			我&nbsp;的<br />预&nbsp;约
		</view>
	</view>
</template>

<script>
	import { userStore } from '@/store'
	import { mapState } from 'pinia'
	import dayjs from 'dayjs'
	import { getBanner } from '@/api/user';
	import { pageLivePreview, updateLivePreview, getToday } from '@/api/live';
	import { AppointmentCard } from './components/AppointmentCard.vue'
	export default {
		components: {
			AppointmentCard
		},
		data() {
			return {
				banners: null,
				currentMonth: dayjs().format('YYYY年MM月'),
				currentWeek: null,
				currentDay: dayjs().format('YYYY-MM-DD'),
				activeLive: 1,
				prods: null,
				// user: null
			}
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			toAppoint() {
				uni.navigateTo({
					url: '/pages/video/appointment/index?appletUserId=' + this.user.id
				})
			},
			async changeTab(key) {
				this.activeLive = key
				await this.getCurrentLive()
			},
			async handelChangeWeek(weekday) {
				this.currentDay = weekday.value
				await this.getCurrentLive()
			},
			async getCurrentWeek() {
				const { data: today } = await getToday()
				if (today) {
					this.currentMonth = dayjs(today).format('YYYY年MM月');
					this.currentDay = dayjs(today).format('YYYY-MM-DD');
					const days = 3;
					const weekNameMap = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' };
					const week = [];
					for (let i = -3; i <= days; i++) {
						const d = dayjs(today).add(i, 'day')
						week.push({
							weekName: weekNameMap[d.format('d')],
							text: d.format('DD'),
							value: d.format('YYYY-MM-DD')
						})
					}
					this.currentWeek = week
				}
			},
			// async subscLive(item) {
			// 	if (item.flag === 1 || item.flag === 0) {
			// 		const { code } = await updateLivePreview({ id: item.productId, starter: item.flag === 1 ? 1 : 0 })
			// 		if (code === 200) {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '预约成功'
			// 			})
			// 		}
			// 	}
			// },
			async getBanners() {
				const result = await getBanner({ type: 1 });
				if (result.code === 200) {
					this.banners = result.data;
				}
			},
			async getCurrentLive() {
				console.log(this.currentDay)
				const { data } = await pageLivePreview({
					dates: this.currentDay,
					status: 1,
					type: 0,
					sources: this.activeLive,
					appletUserId: this.user ? this.user.id : ''
				})
				if (data.records) {
					this.prods = data.records
				}
			}
		},
		onLoad(opt) {
			this.getCurrentWeek()
			this.getBanners()
			if (this.user) {
				this.getCurrentLive()
			}
		},
		onShow() {
			// this.user = getApp().globalData.user;
			// if (this.user && !this.prods) {
			// 	this.getCurrentLive()
			// }
		}
	}
</script>

<style scoped>
	.page-live {
		height: auto;
		min-height: 100vh;
		background: #f9f9f9;
		overflow-x: hidden;
	}

	/* 日历 */
	.live-week {
		background-image: linear-gradient(to bottom, #FFFFFF, #fdf4f7 59%, #fae3ec);
		text-align: center;
		line-height: 76rpx;
		color: #333;
		height: 274rpx;
	}

	.month-title::after {
		content: '';
		border-bottom: 2rpx dotted #79797956;
		display: block;
		margin: 0 12rpx;
	}

	.week-swiper {
		height: 200rpx;
	}

	.weekdays {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.weekdays>view {
		width: 88rpx;
		height: 76rpx;
		text-align: center;
		color: #333;
	}

	.week-day {
		border-radius: 10rpx;
		background-color: #fff;
	}

	.week-day.active {
		background-color: #F5C2A9;
	}

	/* 轮播广告 */
	.uni-margin-wrap {
		width: 726rpx;
		border-radius: 16rpx;
		overflow: hidden;
		margin: 30rpx 12rpx;
	}

	.swiper {
		height: 300rpx;
	}

	/* 直播间 */
	.live-banner {
		margin: 24rpx 12rpx;
	}

	.live-tab-header {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.live-tab-header>view {
		flex: 1;
		height: 100rpx;
		position: relative;
		font-size: 26rpx;
		color: #813f8d;
		line-height: 124rpx;
	}

	.live-tab-header>view.active {
		font-size: 38rpx;
		color: #956f98;
		font-weight: 600;
		line-height: 110rpx;
	}

	.live-tab-header>view>text {
		position: relative;
		font-family: Microsoft YaHei;
		z-index: 2;
	}

	.left {
		padding-left: 40rpx;
	}

	.right {
		padding-right: 40rpx;
	}

	.left::before,
	.right::before {
		content: "";
		/* border-radius: 58rpx 20rpx 0 0; */
		/* background-color: #ffffff37; */
		background: url("/static/live/tab.png") no-repeat bottom left;
		background-size: contain;
		position: absolute;
		display: block;
		width: 312rpx;
		height: 82rpx;
		top: 30rpx;
	}

	.left::before {
		left: 0rpx;
		transform: rotateY(180deg);
	}

	.right::before {
		/* transform: rotateY(180deg); */
		right: 0rpx;
	}

	.left.active::before,
	.right.active::before {
		border-radius: 30rpx 128rpx 0 0;
		background-color: #eaddea;
		background: url("/static/live/tab-active.png") no-repeat bottom left;
		background-size: contain;
		/* background-position: -26rpx bottom; */
		width: 450rpx;
		height: 100rpx;
		top: 0;
	}

	.left.active::before {
		transform: rotateY(0deg);
		z-index: 1;
		left: 0;
		padding-left: 50rpx;
	}

	.right.active::before {
		transform: rotateY(180deg);
		right: 0;
		padding-right: 50rpx;
	}

	.live-prods {
		min-height: 400rpx;
		background-color: #faeef3;
		/* background-image: linear-gradient(to top left, #fdf3fd, #e8c2e3 68%, #fdf6fd); */
		border-radius: 0 0 12rpx 12rpx;
		--cell-value-color: #333;
		padding: 12rpx;
		position: relative;
		/* margin-top: -12rpx; */
	}

	.appointment-btn {
		background-color: #CB72BB;
		color: #fff;
		position: fixed;
		/* width: 108rpx;
		height: 108rpx; */
		border-radius: 22rpx;
		top: 59%;
		right: 14rpx;
		z-index: 5;
		text-align: center;
		font-weight: 600;
		padding: 14rpx 24rpx 14rpx 24rpx;
		/* letter-spacing: 6rpx; */
	}

	.custom-image {
		/* background-color: #fffffe; */
		border-radius: 24rpx;
		text-align: center;
		margin: 24rpx;
		position: relative;
		padding-top: 160rpx;
	}

	.custom-image::before {
		content: '';
		border-radius: 50%;
		width: 344rpx;
		height: 344rpx;
		display: block;
		position: absolute;
		left: 152rpx;
		top: 0;
		opacity: 0.34;
		background: linear-gradient(180deg, #fff, #cb72bb);
	}
</style>
