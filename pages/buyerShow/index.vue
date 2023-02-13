<template>
	<view class="show-page">

		<!-- 轮播广告 -->
		<view class="uni-margin-wrap">
			<swiper class="swiper" :autoplay="true" :interval="3000" :duration="1000" circular v-if="banners">
				<swiper-item v-for="bn in banners" :key="bn.id">
					<view class="swiper-item">
						<van-image :src="bn.url" width="726rpx" height="300rpx" @tap="jumpTo('/pages/buyerShow/rule')">
						</van-image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="show-list" v-if="shows">
			<ShowCard v-for="item in shows" :item="item" :key="item.id" class="show-card" />
		</view>
		<view class="join-btn" hover-class="navigator-hover" @tap="jumpTo('/pages/buyerShow/ownShow')">
			我&nbsp;的<br />发&nbsp;布
		</view>
	</view>
</template>

<script>
import { getActivity } from '@/api/activity';
import { getBanner } from '@/api/user';
import { pageShowPreview } from '@/api/live';
import dayjs from 'dayjs';
import ShowCard from './components/ShowCard.vue';
export default {
	components: { ShowCard },
	data() {
		return {
			banners: null,
			activity: null,
			shows: null
		}
	},
	methods: {
		jumpTo(url) {
			uni.navigateTo({ url })
		},
		toAdd() {
			uni.navigateTo({
				url: '/pages/buyerShow/add?activityId=' + this.activity.id
			})
		},
		async getBanners() {
			const result = await getBanner({ type: 2 });
			if (result.code === 200) {
				this.banners = result.data;
			}
		},
		async getActList() {
			uni.showLoading({
				title: '正在加载...'
			})
			const { data } = await getActivity({ type: 1, status: 1, current: 1, pageSize: 1 })
			if (data.records && data.records.length > 0) {
				this.activity = data.records[0]
				const activityDate = data.records[0].days.split(',')
				const diffTime1 = dayjs().diff(dayjs(activityDate[0]))
				const diffTime2 = dayjs().diff(dayjs(activityDate[1]))
				if (diffTime1 >= 0 && diffTime2 <= 0) {
					await this.getBanners()
					await this.getCurrentShows()
					uni.hideLoading()
				} else {
					uni.redirectTo({
						url: '/pages/buyerShow/rule'
					})
				}
			}
		},
		async getCurrentShows() {
			const { data } = await pageShowPreview({
				activityId: this.activity.id,
				status: 1,
				type: 1,
			})
			if (data.records) {
				this.shows = [...data.records]
				console.log(this.shows)
			}
		}
	},
	onShow() {
		this.getActList()
	}
}
</script>

<style scoped>
.show-page {
	height: auto;
	min-height: 100vh;
	padding-bottom: 0;
}

/* 轮播广告 */
.uni-margin-wrap {
	width: 726rpx;
	border-radius: 16rpx;
	overflow: hidden;
	margin: 0 12rpx;
}

.swiper {
	height: 300rpx;
}

.show-list {
	display: flex;
	padding-left: 15rpx;
	padding-top: 24rpx;
	flex-wrap: wrap;
}

.show-card {
	margin-bottom: 24rpx;
}

.join-btn {
	background-color: #957ff1;
	color: #fff;
	position: fixed;
	width: 108rpx;
	height: 108rpx;
	border-radius: 22rpx;
	top: 57%;
	right: 0;
	z-index: 5;
	text-align: center;
	font-weight: 600;
	padding: 14rpx 0 14rpx 8rpx;
	letter-spacing: 6rpx;
}
</style>
