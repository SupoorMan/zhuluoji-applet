<template>
	<view class="add-recommend-page" v-if="detail">
		<!-- 标题 -->
		<van-nav-bar title="发表评价" class="navbar" fixed left-arrow @click-left="backPage" />
		<view></view>
		<van-card num="1" :thumb="getProImage(detail.productImage || '')" custom-class="pro-card">
			<view slot="title" class="title">
				<view>{{ detail.productName }}</view>
				<view class="order-price">{{ detail.integral }} 积分</view>
			</view>
			<template #price>
				<text>规格：{{ detail.sizes }}</text>
			</template>
		</van-card>
		<view class="detail-card">
			<view class="" style="position: relative; top: -24rpx">
				<van-divider contentPosition="center" dashed>请填写客观真实的评价</van-divider>
			</view>
			<view class="eval-tags">
				<view v-for="tag in recomdTag" :key="tag" @tap="checkTag(tag)"
					:class="{ active: activeTag.includes(tag) }">{{ tag }}</view>
			</view>
			<view class="detail-content">
				<view class="eval-area">
					<van-icon name="edit" size="16" />
					<textarea v-model="content" cols="30" rows="6" placeholder="从多个角度评价产品，可以帮助更多想了解的人~"
						@input="inputChange"></textarea>
				</view>
				<van-uploader @after-read="afterRead" image-fit="scaleToFit" max-count="5" :file-list="fileList"
					@delete="handleDelete">
					<view class="upload-card">
						<image src="/static/shop/upload.png" mode="aspectFit" style="width: 64rpx; height: 64rpx">
						</image>
						<text>上传图片/视频（视频请短于15s）</text>
					</view>
				</van-uploader>
				<view class="no-name-box">
					<van-checkbox :value="noName" @change="onChange" icon-size="32rpx">匿名
					</van-checkbox>
					<text>匿名会隐藏头像和昵称</text>
				</view>
			</view>
		</view>
		<view style="margin: 36rpx 12rpx">
			<van-button round color="#BB81DA" block @tap="addEval"> 发布 </van-button>
		</view>
	</view>
</template>

<script>
	import { getOrders } from "@/api/order";
	import { addEvaluate } from "@/api/review";
	import { deleteFile, uploadFile } from "@/api/file";
	export default {
		data() {
			return {
				detail: null,
				recomdTag: [
					"直观感受",
					"做工工艺",
					"气味味道",
					"物流包装",
					"面料手感",
					"尺码效果",
				],
				activeTag: [],
				content: "",
				noName: false,
				fileList: null,
			};
		},
		methods: {
			backPage() {
				uni.navigateBack({
					delta: 1,
				});
			},
			checkTag(type) {
				if (this.activeTag.includes(type)) {
					this.activeTag = this.activeTag.filter((m) => m !== type);
				} else {
					this.activeTag.push(type);
				}
			},
			inputChange(event) {
				this.content = event.detail.value;
			},
			onChange(event) {
				console.log(event.detail);
				this.noName = event.detail;
			},
			getProImage(urls) {
				if (urls) {
					const imgs = urls.split(",");
					return imgs.length > 1 ? imgs[0] : urls;
				} else {
					return "";
				}
			},
			handleDelete(event) {
				const { index } = event.detail;
				deleteFile({
					file: this.fileList[index].url,
				}).then((res) => {
					if (res.code === 200) {
						this.fileList =
							this.fileList.length > 1 ? this.fileList.splice(index, 1) : [];
					}
				});
			},
			async afterRead(event) {
				const { file } = event.detail;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				const { code, data } = await uploadFile({
						area: "productEval",
					},
					file
				);
				if (code === 200) {
					this.fileList = this.fileList ? [
						...this.fileList,
						{
							url: data,
						},
					] : [{
						url: data,
					}, ];
					this.images = data;
				} else {
					uni.showToast({
						icon: "none",
						title: "上传失败,请稍后重试",
					});
				}
			},
			async getDetail(opt) {
				const { data } = await getOrders(opt);
				if (data) {
					this.detail = data.records[0];
				}
			},
			async addEval() {
				if (!this.content || this.content.length < 2) {
					uni.showToast({
						icon: "none",
						title: "请输入评价再发布",
					});
					return;
				}
				const { code } = await addEvaluate({
					message: this.content, // 评价消息
					productId: this.detail.productId, // 积分商品id
					state: 0, // 状态: 0.正常 1.删除 2.隐藏
					status: this.noName ? 1 : 0,
					type: this.activeTag.toString(), // 评价类型
					images: this.fileList && this.fileList.length > 0 ?
						this.fileList.map((n) => n.url).toString() : "",
				});
				if (code === 200) {
					uni.showToast({
						title: "评价成功",
						success() {
							setTimeout(
								() =>
								uni.navigateBack({
									delta: 1,
								}),
								1000
							);
						},
					});
				}
			},
		},
		onLoad(opt) {
			this.getDetail(opt);
		},
	};
</script>

<style scoped>
	.add-recommend-page {
		height: auto;
		min-height: 100vh;
	}

	.title {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.order-price {
		color: #f56122;
	}

	.detail-card {
		border-radius: 16rpx;
		background-color: #fff;
		margin-left: 12rpx;
		margin-right: 12rpx;
		--divider-margin: 0;
		--divider-font-size: 22rpx;
	}

	.eval-tags {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		padding: 10rpx 64rpx;
	}

	.eval-tags>view {
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
		border: 2rpx dashed #73737460;
		font-size: 22rpx;
		margin: 8rpx 12rpx;
		color: #33333356;
	}

	.eval-tags>view.active {
		background-color: #d695ff30;
		color: #666;
	}

	.detail-content {
		padding: 24rpx 32rpx;
	}

	.no-name-box {
		display: flex;
		justify-content: space-between;
		padding-top: 36rpx;
		padding-bottom: 12rpx;
		font-size: 26rpx;
	}

	.no-name-box>text {
		color: #777;
		font-size: 26rpx;
	}

	.eval-area {
		/* background-color: #f7f8fa; */
		display: flex;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.eval-area textarea {
		padding-left: 12rpx;
		height: 220rpx;
	}
</style>
<style>
	.pro-card {
		border-radius: 16rpx;
		margin-top: 16rpx;
		margin-left: 12rpx;
		margin-right: 12rpx;
		--card-background-color: #fff;
		/* --card-thumb-size: 136rpx; */
	}

	.van-card__content {
		min-height: 136rpx !important;
		max-height: 136rpx !important;
	}

	.van-card__thumb {
		background-color: #f9f9f9;
		border-radius: 12rpx;
	}

	.upload-card {
		border: 4rpx dashed #73737460;
		width: 660rpx;
		height: 192rpx;
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
