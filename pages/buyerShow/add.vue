<template>
	<view class="add-recommend-page">
		<van-nav-bar title="仙女买家秀" class="navbar" fixed left-arrow @click-left="backPage"></van-nav-bar>
		<view></view>
		<view class="detail-card">
			<van-uploader @after-read="afterRead" max-count="5" :file-list="fileList" @delete="handleDelete">
				<view class="upload-card">
					<image src="/static/shop/upload.png" mode="aspectFit" style="width: 64rpx;height: 64rpx;" />
				</view>
			</van-uploader>
			<view class="detail-content">
				<view class="eval-input-title">
					<input type="text" v-model="add.title" placeholder="填写标题会更直观哦~">
				</view>
				<view class="eval-area">
					<textarea v-model="add.context" cols="30" rows="6" placeholder="添加正文~"
						@input="inputChange"></textarea>
				</view>
			</view>
			<view class="eval-tags">
				<view v-for="tag in recomdTag" :key="tag" @tap="checkTag(tag)" hover-class="navigator-class"
					:class="{'active':activeTag.includes((tag))}">{{tag}}</view>
			</view>
		</view>
		<view style="margin: 36rpx 12rpx;">
			<van-button round color="#BB81DA" block @tap="addEval">
				发布
			</van-button>
		</view>
	</view>

</template>

<script>
	import { deleteFile, uploadFile } from '@/api/file';
	import { getShowDetail, addShow, updateShow } from "@/api/activity";
	export default {
		data() {
			return {
				detail: null,
				recomdTag: ['#仙女买家秀', '#汀黛', '#酷酷的侏罗纪', '#家居', '#家纺'],
				activeTag: [],
				add: {
					"activityId": '',
					"context": "",
					"images": "",
					"title": ""
				},
				page: {
					current: 1,
					pageSize: 1,
				},
				fileList: null
			};
		},
		methods: {
			backPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			checkTag(value) {
				this.add.context += value
			},
			inputChange(event) {
				this.add.context = event.detail.value
			},
			handleDelete(event) {
				const {
					index
				} = event.detail;
				deleteFile({
					file: this.fileList[index].url
				}).then(res => {
					if (res.code === 200) {
						this.fileList = this.fileList.length > 1 ? this.fileList.splice(index, 1) : [];
					}
				});
			},
			async afterRead(event) {
				const {
					file
				} = event.detail;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				const { code, data } = await uploadFile({ area: 'buyerShow' }, file);
				if (code === 200) {
					if (this.fileList) {}
					this.fileList = this.fileList ? [...this.fileList, {
						url: data
					}] : [{
						url: data
					}]
					this.$forceUpdate()
					console.log(this.fileList)
				} else {
					uni.showToast({
						icon: 'none',
						title: '上传失败,请稍后重试'
					});
				}
			},
			async addEval() {
				if (!this.add.title || this.add.title.length < 2) {
					uni.showToast({
						icon: "none",
						title: '标题至少2字'
					})
					return;
				}
				if (!this.fileList || this.fileList.length < 1) {
					uni.showToast({
						icon: "none",
						title: '至少上传一张图片'
					})
					return;
				}
				if (!this.add.context || this.add.context.length < 2) {
					uni.showToast({
						icon: "none",
						title: '请输入正文再发布'
					})
					return;
				}
				const images = this.fileList ? this.fileList.map(m => m.url) : [];
				const {
					code
				} = this.add.activityId ? await addShow({ ...this.add, images: images.toString() }) :
					await updateShow({
						id: this.add.id,
						productName: this.add.title,
						details: this.add.context,
						type: 4,
						images: images.toString()
					})
				if (code === 200) {
					uni.showToast({
						title: '发布成功',
						success() {
							setTimeout(() => uni.navigateBack({
								delta: 1
							}), 1000)
						}
					})
				}
			},
			async getDetail(opt) {
				const { data } = await getShowDetail({ ...opt, ...this.page });
				if (data) {
					const { productName, details, id } = data.activityProduct
					this.add = { title: productName, context: details, id }
					this.fileList = data.activityProduct.images.split(",").map(n => ({ url: n }));
				}
			},
		},
		onLoad(opt) {
			if (opt.id) {
				this.getDetail(opt)
			} else {
				this.add.activityId = opt.activityId
			}
		}
	};
</script>

<style scoped>
	.add-recommend-page {
		height: auto;
		min-height: 100vh;
	}

	.eval-input-title {
		border-bottom: 2rpx dotted #797979;
		padding: 12rpx 0;
		margin-bottom: 24rpx;
	}

	.detail-card {
		padding: 32rpx;
		border-radius: 16rpx;
		background-color: #fff;
		margin-left: 12rpx;
		margin-right: 12rpx;
	}

	.detail-content {
		padding: 24rpx 0;
	}

	.eval-area {
		/* background-color: #f7f8fa; */
		display: flex;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.eval-area textarea {
		/* padding-left: 12rpx; */
		height: 500rpx;
		width: 100%;
	}

	.eval-tags {
		border-top: 2rpx dotted #797979;
		padding-top: 12rpx;
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.eval-tags>view {
		padding: 6rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		color: #737374;
	}

	.eval-tags>view+view {
		border-left: 2rpx dotted #73737460;
	}

	.eval-tags>view.active {
		color: #D695FF30;
		color: #666;
	}
</style>
<style>
	.upload-card {
		border: 4rpx dashed #73737460;
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 40rpx;
	}

	.upload-card text {
		padding-top: 8rpx;
		font-size: 26rpx;
	}
</style>
