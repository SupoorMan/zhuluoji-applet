<template>
	<view class="review-page">
		<van-tabs :active="active" animated>
			<van-tab :title="item.name" v-for="item in reviewType" :key="item.key">
				<view class="review-list">
					<van-collapse :value="activeNames" @change="onChange">
						<van-collapse-item name="1">
							<view slot="title">
								标题1
								<van-icon name="question-o" />
							</view>
							代码是写出来给人看的，附带能在机器上运行
						</van-collapse-item>
						<van-collapse-item name="2" custom-class="review-collapse">
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
								用户名，Level0
							</template>
							<template #value>
								22-12-20
							</template>
							代码是写出来给人看的，附带能在机器上运行
						</van-collapse-item>
					</van-collapse>
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
import { getEvals } from '@/api/review';
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
</style>
