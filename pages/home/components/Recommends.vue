<template>
	<view class="">
		<EvalCard class="eval-card" v-for="(item, index) in recommendList" :key="item.id" :item="item" :index="[index]"
			@replyToEval="replyToEval" @addStar="addStar" @moreOpt="moreOpt" v-show="!item.hide">
			<van-cell-group v-if="item.list.length > 0">
				<EvalCard v-for="(child, s) in item.list" :key="child.id" :item="child" :index="[index, s]" noreply
					@addStar="addStar" @moreOpt="moreOpt" v-show="!child.hide" />
			</van-cell-group>
		</EvalCard>
		<van-share-sheet :show="showMoreOpt" title="更多操作" :options="options" @select="onSelect"
			@close="showMoreOpt=false" />
	</view>
</template>

<script>
	import EvalCard from "@/components/EvalCard.vue";
	import { delHomeEval } from '@/api/home.js'
	export default {
		props: ['recommendList'],
		components: {
			EvalCard,
		},
		data() {
			return {
				showMoreOpt: false,
				current: null,
				options: [{
					name: '删除',
					icon: 'https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/icon/1676355956647_delete.png'
				}],
			}
		},
		methods: {
			async addStar(index) { // 点赞
				const item =
					index.length > 1 ?
					this.recommendList[index[0]].list[index[1]] :
					this.recommendList[index[0]];
				const { code } = await updateHomeEval({
					...item,
					starter: item.flag === 1 ? 0 : 1,
				});
				if (code === 200) {
					const newItem = {
						...item,
						starter: item.flag === 1 ? item.starter - 1 : item.starter + 1,
						flag: item.flag === 1 ? 0 : 1,
					};
					if (index.length > 1) {
						this.recommendList[index[0]].list[index[1]] = newItem;
					} else {
						this.recommendList[index[0]] = newItem;
					}
					this.$forceUpdate();
				}
			},
			moreOpt(index) {
				this.showMoreOpt = true
				this.current = index
			},
			async deleteEval() {
				const index = this.current
				const item =
					this.current.length > 1 ?
					this.recommendList[index[0]].list[index[1]] :
					this.recommendList[index[0]];
				const { code, data } = await delHomeEval({ id: item.id });
				if (code === 200) {
					uni.showToast({
						icon: "success",
						title: "删除成功"
					})
					this.showMoreOpt = false
					if (index.length > 1) {
						this.recommendList[index[0]].list[index[
							1]] = { ...item, hide: true }
					} else {
						this.recommendList[index[0]] = { ...item, hide: true }
					}
					this.$forceUpdate();
				} else {
					uni.showToast({
						icon: "error",
						title: data
					})
				}
			},
			replyToEval(item) {
				this.$emit('replyToEval', item)
			},
			async onSelect(option) {
				switch (option.detail.name) {
					case '删除':
						await this.deleteEval();
						return;
					default:
						break;
				}
			}
		}
	}
</script>

<style scoped>
	.eval-card {
		margin-bottom: 16rpx;
	}
</style>
