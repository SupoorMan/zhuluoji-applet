<template>
	<view class="trans-page">
		<view class="image-view">
			<image style="height:307rpx;width: 509rpx;margin-left: 80rpx;"
				src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675048431166_transfer_title.png"
				mode="aspectFit"></image>
		</view>

		<view class="trans-content">
			<van-cell-group :border="false">
				<van-cell required label="下单平台" title-width="6.2em" :value="sourceText||'请选择'" placeholder="订单来源"
					is-link @tap="showSource = true" />
				<van-field required label="手机号码" :value="sourceText" placeholder="手机号"
					@change="onChange($event, 'phone')" />
				<van-field required label="订单编号" :value="add.orderNo" placeholder="请输入订单编号"
					@change="onChange($event, 'orderNo')" />
				<!-- <van-field required label="消费价格" type="number" :value="add.costs" placeholder="请输入消费价格" border="false"
					@change="onChange($event, 'costs')" /> -->
				<!-- <van-field label="备注" :value="add.remark" placeholder="请输入备注" type="textarea" autosize border="false"
					@change="onChange($event, 'remark')" /> -->
				<van-cell title="订单图片" :border="false" title-width="6.2em">
					<template #default>
						<van-uploader @after-read="afterRead" max-count="1" :file-list="fileList"
							@delete="handleDelete" />
					</template>
				</van-cell>

				<view class="tip-text">
					<text>
						您知悉并同意您下单的店铺在每一次转换中,根据您填写的订单号将
						该笔订单的商品名称和金额提供给"侏罗纪仙女VIP专属"用于订单转换和展示
					</text>
				</view>
			</van-cell-group>
			<view class="btn-box">
				<van-button @click="addOrder" block round color="#FFC9E0" custom-style="color:#6170AA;font-size:32rpx;">
					确认兑换
				</van-button>
				<view style='margin-top: 20rpx;'></view>
				<van-button color="#6170AA" block plain round custom-style="border-color:#FFC9E0;font-size:32rpx;"
					@tap="jumpTo('/pages/user/transferOrder/list')">
					转换记录
				</van-button>
				<text class="tip">*仅支持同一账号的订单号</text>
				<br>
				<text class="tip">如有疑问, 请联系客服</text>
			</view>
		</view>

		<view class="image-view">
			<view class="trans-content">

				<image style="height: 1330rpx;width: 750rpx;margin-left: -30rpx;"
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675049191531_trans_rule2.png"
					mode="aspectFit"></image>
			</view>
			<view class="trans-content">
				<image style="height: 564rpx;width: 750rpx;margin-left: -30rpx;"
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675048337824_trans_level.png"
					mode="aspectFit"></image>
				<image style="height: 1993rpx;width: 750rpx;margin-left: -30rpx;"
					src="https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675049107885_trans_rule1.png"
					mode="aspectFit"></image>
			</view>
		</view>
		<!-- 来源 -->
		<van-popup :show="showSource" round position="bottom" @close="showSource = false">
			<van-picker show-toolbar :columns="columns" @confirm="selectSource" @cancel="showSource = false" />
		</van-popup>
	</view>
</template>

<script>
	import { deleteFile, uploadFile } from "@/api/file";
	import { addOConvert } from "@/api/order";
	export default {
		data() {
			return {
				showSource: false,
				fileList: null,
				columns: [{
						text: "微信",
						value: 0,
					},
					{
						text: "淘宝",
						value: 1,
					},
					{
						text: "小红书",
						value: 2,
					},
					{
						text: "抖音",
						value: 3,
					},
					{
						text: "其他",
						value: 4,
					},
				],
				sourceText: null,
				add: {
					// costs: "",
					images: "",
					orderNo: '',
					phone: "",
					status: 0,
					type: "",
				},
			};
		},
		methods: {
			jumpTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			selectSource(event) {
				const { value, index } = event.detail;
				this.sourceText = value.text;
				this.add.type = value.value;
				this.showSource = false;
				this.$forceUpdate()
			},
			onChange(event, fieldName) {
				this.add[fieldName] = event.detail;
			},
			handleDelete(event) {
				const { index } = event.detail;
				deleteFile({ file: this.fileList[index].url }).then((res) => {
					if (res.code === 200) {
						this.fileList = [];
					}
				});
			},
			async addOrder() {
				const keys = Object.keys(this.add);
				for (var i = 0; i < keys.length; i++) {
					if (this.add[keys[i]] === "" && keys[i] !== "images") {
						uni.showToast({
							icon: "none",
							title: "必填项不能为空",
						});
						return false;
					}
				}
				const { code, data } = await addOConvert(this.add);
				if (code === 200) {
					uni.showToast({
						icon: "none",
						title: "提交成功",
						success: () => {
							uni.navigateBack({ delta: 1 });
						},
					});
				}
			},
			async afterRead(event) {
				const { file } = event.detail;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				const { code, data } = await uploadFile({ area: "ordertransfer" }, file);
				if (code === 200) {
					this.fileList = this.fileList ? [
						...this.fileList,
						{
							url: data,
						},
					] : [{
						url: data,
					}, ];
					this.add.images = data;
				} else {
					uni.showToast({
						icon: "none",
						title: "上传失败,请稍后重试",
					});
				}
			},
		},
	};
</script>

<style scoped>
	.trans-page {
		height: auto;
		min-height: 100vh;
		background: url('https://shuzhucloud-zhuluoji.oss-cn-hangzhou.aliyuncs.com/static/1675049227267_trans_bg.png') top center;
		background-size: contain;
	}

	.image-view {
		text-align: center;
	}

	.trans-content {
		margin: 30rpx;
		padding-top: 24rpx;
		border-radius: 24rpx;
		border: 2rpx solid #839EE1;
		box-shadow: 0rpx 0rpx 8rpx 8rpx #B1C6F5;
		background-color: #ffffff90;
		--cell-label-color: #6170AA;
		--field-label-color: #6170AA;
		--cell-text-color: #6170AA;
		--cell-label-font-size: 28rpx;
		--cell-background-color: transparent;
	}

	.tip-text {
		font-size: 20rpx;
		color: #6170AA;
		padding: 0rpx 40rpx 40rpx 40rpx;
	}

	.tip-text::before {
		content: '';
		position: relative;
		width: 16rpx;
		height: 16rpx;
		border-radius: 16rpx;
		border: 2rpx solid #6170AA;
		display: inline-block;
		margin-right: 16rpx;
	}

	.tip {
		font-size: 20rpx;
		color: #6170AA;
	}

	.btn-box {
		margin: 0 auto;
		padding: 32rpx 80rpx;
		width: 500rpx;
		text-align: center;
	}
</style>
<style></style>
