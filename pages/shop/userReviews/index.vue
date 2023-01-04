<template>
	<view class="review-page">
		<van-tabs :active="active" animated>
			<van-tab :title="item.name" v-for="item in reviewType" :key="item.key">
				<view class="review-list">
					<van-collapse :value="activeNames" @change="onChange">
						<van-collapse-item name="1">
							<view slot="title">
								用户
								<van-icon name="question-o" />
							</view>
							<view class="review-tools">
								<van-icon name="share-o" size="32rpx" />
								分享
								<van-icon name="like-o" size="32rpx" style="margin-left: 20rpx;" />
								20
							</view>
						</van-collapse-item>
						<van-collapse-item
							custom-class="review-collapse"
							v-for="item in list"
							:name="item.id"
							:key="item.id"
						>
							<template #icon>
								<van-image
									round
									width="30"
									height="30"
									src="https://img.yzcdn.cn/vant/cat.jpeg"
									style="margin-right: 10rpx;"
								/>
							</template>
							<template #title>
								{{ item.appletUserId }}，Level0
							</template>
							<template #value>
								{{ dayjs(item.createTime).format('YY-MM-DD') }}
							</template>
							{{ item.message }}
							<div class="review-tools">
								<van-icon name="share-o" size="32rpx" />
								分享
								<van-icon name="like-o" size="32rpx" />
								20
							</div>
						</van-collapse-item>
					</van-collapse>
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
import { getEvals } from '@/api/review';
import dayjs from 'dayjs';
export default {
	data() {
		return {
			active: 0,
			activeNames: ['1'],
			reviewType: [
				{ name: '全部（00）', key: 'p1' },
				{ name: '图文（00）', key: 'p2' },
				{ name: '最新（00）', key: 'p3' }
			],
			page: {
				current: 1,
				pageSize: 20,
				productId: ''
			},
			list: null
		};
	},
	methods: {
		async getList(option) {
			const result = await getEvals(option);
			if (result.code === 200) {
				this.list = result.data.records;
			}
		},
		onChange(event) {
			this.activeNames = event.detail;
		}
	},
	onLoad(option) {
		this.page.productId = option.productId;
		this.getList(this.page);
	}
};
</script>

<style>
.review-page {
	height: 100%;
	/* --tabs-nav-background-color: transparent; */
	--tab-active-text-color: #d695ff;
	--tabs-bottom-bar-color: #d695ff;
	--tabs-line-height: 80rpx;
}
.review-collapse {
}
.review-tools {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
