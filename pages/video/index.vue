<template>
	<view class="page-live">
		<!-- 日历 -->
		<view class="live-week">
			<view class="month-title">{{currentMonth}}</view>
			<swiper class="week-swiper">
				<swiper-item indicator-dots="true" indicator-color="#fff" indicator-active-color="#F5C2A9">
					<view class="swiper-item">
						<view class="weekdays">
							<view v-for="weekday in weekName" :key="weekday">{{weekday}}</view>
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
			<view class="live-prods"
				:style="
          activeLive === 0
            ? 'border-top-right-radius: 20rpx;background-image: linear-gradient(to top left, #FFF7FF, #e8c2e3 68%, #E0AFD9)'
            : 'border-top-left-radius: 20rpx;background-image: linear-gradient(to top right, #FFF7FF, #e8c2e3 68%, #E0AFD9)'">
				<AppointmentCard v-for="item in prods" :key="item.id" :item="item" />
				<view class="custom-image" v-if="!prods ||  prods.length===0">

					<view style="color: #525151;">暂无直播商品</view>
					<view style="color: #525151;">敬请期待</view>

				</view>
			</view>
		</view>

		<!-- 我的预约 -->
		<view class="appointment-btn" hover-class="navigator-hover" @tap="toAppoint">
			我的预约
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import { getBanner } from '@/api/user';
	import { pageLivePreview, updateLivePreview } from '@/api/live';
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
				weekName: ['日', '一', '二', '三', '四', '五', '六'],
				activeLive: 1,
				// stauts: { 1: '开播提醒', 2: '直播中', 3: '直播结束' },
				prods: null,
				user: null
			}
		},
		methods: {
			toAppoint() {
				uni.navigateTo({
					url: '/pages/video/appointment/index?appletUserId=' + this.user.id
				})
			},
			changeTab(key) {
				this.activeLive = key
				this.getCurrentLive()
			},
			handelChangeWeek(weekday) {
				this.currentDay = weekday.value
				this.getCurrentLive()
			},
			getCurrentWeek() {
				const days = 7;
				const week = [];
				for (let i = 1; i < days + 1; i++) {
					const d = dayjs().startOf('week').add(i, 'day')
					week.push({
						text: d.format('DD'),
						value: d.format('YYYY-MM-DD')
					})
				}
				return week
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
				const { data } = await pageLivePreview({
					dates: this.currentDay,
					status: 1,
					type: 0,
					sources: this.activeLive,
					appletUserId: this.user.id
				})
				if (data.records) {
					this.prods = data.records
				}
			}
		},
		onLoad(opt) {
			this.currentWeek = this.getCurrentWeek()
			this.getBanners()
			if (this.user) {
				this.getCurrentLive()
			}
		},
		onShow() {
			this.user = getApp().globalData.user;
			if (this.user && !this.prods) {
				this.getCurrentLive()
			}
		}
	}
</script>

<style scoped>
	.page-live {
		height: auto;
		min-height: 100vh;
		background: #FFFAF044;
		overflow-x: hidden;
	}

	/* 日历 */
	.live-week {
		background-image: linear-gradient(to bottom, #FFFFFF, #E5ADE6);
		text-align: center;
		line-height: 76rpx;
		color: #333;
		height: 284rpx;
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
		color: #B752B4;
		line-height: 110rpx;
	}

	.live-tab-header>view.active {
		font-size: 40rpx;
		text-shadow: 4rpx 4rpx 8rpx #B752B4;
		color: #fff;
	}

	.live-tab-header>view>text {
		position: relative;
		font-family: Microsoft YaHei;
		z-index: 2;
		font-weight: 600;
	}

	.left {
		padding-left: 30rpx;
	}

	.right {
		padding-right: 30rpx
	}

	.left::before,
	.right::before {
		content: "";
		background: url("/static/live/tab.png") no-repeat bottom left;
		background-size: contain;
		position: absolute;
		display: block;
		width: 338rpx;
		height: 120rpx;
		top: 0;
	}

	.left::before {
		transform: rotateY(180deg);
		left: -16rpx;
	}

	.right::before {
		right: -16rpx;
	}

	.left.active::before,
	.right.active::before {
		background:
			url("/static/live/03-19.png") no-repeat bottom left;
		background-size: contain;
		background-position: -26rpx bottom;
		width: 750rpx;
		height: 100rpx;
	}

	.left.active::before {
		transform: rotateY(0deg);
		z-index: 1;
		left: 0;
	}

	.right.active::before {
		transform: rotateY(180deg);
		right: 0;
	}

	.live-prods {
		min-height: 400rpx;
		background-image: linear-gradient(to top left, #fdf3fd, #e8c2e3 68%, #e1d1da);
		border-radius: 0 0 12rpx 12rpx;
		--cell-value-color: #333;
		padding: 12rpx;
		position: relative;
		margin-top: -12rpx;
	}

	.appointment-btn {
		background-color: #CB72BB;
		color: #fff;
		position: fixed;
		width: 108rpx;
		height: 108rpx;
		border-radius: 22rpx;
		top: 59%;
		right: 14rpx;
		z-index: 5;
		text-align: center;
		font-weight: 600;
		padding: 14rpx 0 14rpx 8rpx;
		letter-spacing: 6rpx;
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
