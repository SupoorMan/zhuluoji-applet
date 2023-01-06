<template>
	<view class="trans-page">
		<view class="" style="display: flex;justify-content: flex-end;padding: 24rpx 24rpx 0;">
			<navigator url="/pages/user/transferOrder/list">
				<van-icon name="description" color="#cea6fe" />
				&nbsp; 兑换记录
			</navigator>
		</view>
		<view class="trans-content">
			<van-cell-group inset>
				<van-field
					required
					label="来源"
					:value="sourceText"
					placeholder="订单来源"
					border="false"
					is-link
					readonly
					@tap="showSource = true"
				/>
				<van-field
					required
					label="订单编号"
					:value="add.orderNo"
					placeholder="请输入订单编号"
					border="false"
					@change="onChange($event, 'orderNo')"
				/>
				<van-field
					required
					label="消费价格"
					type="number"
					:value="add.costs"
					placeholder="请输入消费价格"
					border="false"
					@change="onChange($event, 'costs')"
				/>
				<van-field
					label="备注"
					:value="add.remark"
					placeholder="请输入备注"
					type="textarea"
					autosize
					border="false"
					@change="onChange($event, 'remark')"
				/>
			</van-cell-group>
		</view>
		<view class="trans-content">
			<van-cell-group inset>
				<van-cell title="订单图片" required title-width="6.2em">
					<template #default>
						<van-uploader
							@after-read="afterRead"
							max-count="1"
							:file-list="fileList"
							@delete="handleDelete"
						/>
					</template>
				</van-cell>
			</van-cell-group>
		</view>
		<view class="btn-box"><van-button @click="addOrder" round block color="#cea6fe">确认兑换</van-button></view>
		<!-- 来源 -->
		<van-popup :show="showSource" round position="bottom" @close="showSource = false">
			<van-picker show-toolbar :columns="columns" @confirm="selectSource" @cancel="showSource = false" />
		</van-popup>
	</view>
</template>

<script>
import { deleteFile, uploadFile } from '@/api/file';
import { addOConvert } from '@/api/order';
export default {
	data() {
		return {
			showSource: false,
			fileList: [],
			columns: [
				{
					text: '微信',
					value: 0
				},
				{
					text: '淘宝',
					value: 1
				},
				{
					text: '小红书',
					value: 2
				},
				{
					text: '抖音',
					value: 3
				},
				{
					text: '其他',
					value: 4
				}
			],
			sourceText: '',
			add: {
				costs: '',
				images: '',
				remark: '',
				status: 0,
				type: ''
			}
		};
	},
	methods: {
		selectSource(event) {
			const { value, index } = event.detail;
			this.sourceText = value.text;
			this.add.type = value.value;
			this.showSource = false;
		},
		onChange(event, fieldName) {
			this.add[fieldName] = event.detail;
		},
		handleDelete(event) {
			const { index } = event.detail;
			deleteFile({ file: this.fileList[index].url }).then(res => {
				if (res.code === 200) {
					this.fileList = [];
				}
			});
		},
		async addOrder() {
			const keys = Object.keys(this.add);
			for (var i = 0; i < keys.length; i++) {
				if (this.add[keys[i]] === '' && keys[i] !== 'remark') {
					uni.showToast({
						icon: 'none',
						title: '必填项不能为空'
					});
					return false;
				}
			}
			const { code, data } = await addOConvert(this.add);
			if (code === 200) {
				uni.showToast({
					icon: 'none',
					title: '兑换成功',
					success: () => {
						uni.navigateBack({ delta: 1 });
					}
				});
			}
		},
		async afterRead(event) {
			const { file } = event.detail;
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			const { code, data } = await uploadFile({ area: '订单转化' }, file);
			if (code === 200) {
				this.fileList.push({
					url: data
				});
				this.add.images = data;
			} else {
				uni.showToast({
					icon: 'none',
					title: '上传失败,请稍后重试'
				});
			}
		}
	}
};
</script>

<style scoped>
.trans-page {
	height: auto;
	min-height: 100vh;
}
.trans-content {
	padding-top: 24rpx;
}
.btn-box {
	margin-top: 180rpx;
	padding: 32rpx 80rpx;
	width: 100%;
}
</style>
<style></style>
