<template>
	<view class="order-detail-page">
		<view style="background: #fff;">
			<view class="detail-content">
				<van-card
					num="1"
					:desc="detail.introduction"
					:title="detail.productName"
					:thumb="detail.productImage"
				>
					<template #price>
						<text>规格：{{ detail.amount }}</text>
					</template>
				</van-card>
				<van-divider />
				<van-cell title="消费积分" :value="detail.integral" :border="false" />
			</view>
		</view>
		<view class="contract-cell">
			<van-cell-group :border="false">
				<van-cell title="配送" title-width="100rpx">
					<template #default>
						<text>普通快递</text>
					</template>
				</van-cell>
				<van-cell title="运费">
					<template #default>
						<text>运费（快递）：￥0.00</text>
					</template>
				</van-cell>

				<van-cell
					is-link
					title="地址"
					:border="false"
					title-width="100rpx"
					:value="filedValue || '请选择地区'"
					@click="showSelectAddress = true"
				></van-cell>
			</van-cell-group>
			<van-popup round position="bottom" :show="showSelectAddress" @close="onAddrChange">
				<van-radio-group :value="selectAddress">
					<view style="line-height: 80rpx;padding-left: 24rpx;">选择配送地址</view>
					<van-cell-group>
						<van-cell
							use-label-slot
							center
							clickable
							v-for="item in address"
							:key="item.id"
							:data-name="item.id"
							:border="false"
							@click="onAddrSelect"
						>
							<template #title>
								<text>{{ item.receiver + ' ' + item.phone + ' ' }}</text>
								<van-tag mark type="danger" v-if="item.defaults === 1">
									默认
								</van-tag>
							</template>
							<template #label>
								{{ item.province + item.city + item.area + item.address }}
							</template>
							<van-radio slot="right-icon" :name="item.id" />
						</van-cell>
					</van-cell-group>
				</van-radio-group>
			</van-popup>
			<van-dialog id="van-dialog" />
		</view>
		<view class="btn-box">
			<van-button @click="addOrder" round block color="#F9CD90">确认兑换</van-button>
		</view>
	</view>
</template>

<script>
import OrderCard from './components/OrderCard';
import Recommend from '../components/Recommend.vue';
import { getOrder, addOrder2 } from '@/api/order';
import { getAddressList } from '@/api/setting/setting';
import Dialog from '@/wxcomponents/vant/dialog/dialog';
export default {
	components: { OrderCard, Recommend },
	data() {
		return {
			detail: null,
			filedValue: '',
			showSelectAddress: false,
			selectAddress: null, // 选中的地址
			address: null,
			expressFee: 0
		};
	},
	methods: {
		onAddrChange() {
			this.showSelectAddress = false;
			if (this.selectAddress) {
				const nowAddr = this.address.find(n => n.id === this.selectAddress);
				this.filedValue =
					nowAddr.receiver +
					',' +
					nowAddr.phone +
					',' +
					nowAddr.province +
					nowAddr.city +
					nowAddr.area +
					nowAddr.address;
			}
		},
		onAddrSelect(event) {
			const { name } = event.currentTarget.dataset;
			this.selectAddress = name;
		},
		async getList() {
			const { data } = await getAddressList();
			this.address = data;
		},
		async addOrder() {
			if (!this.selectAddress) {
				uni.showToast({
					icon: 'none',
					title: '请选择配送地址'
				});
				return;
			}
			Dialog.confirm({
				message: '确认使用' + this.detail.integral + '积分兑换'
			})
				.then(async () => {
					const result = await addOrder2({
						amount: 1,
						expressFee: this.expressFee,
						integral: this.detail.integral,
						productId: this.detail.id,
						receiveAddress: this.filedValue,
						state: 0,
						status: 1
					});
					if (result.code === 200) {
						Dialog.alert({ title: '兑换成功', message: '可至“我的订单”中查看详情' });
					} else {
						uni.showToast({
							icon: 'error',
							title: result.msg
						});
					}
				})
				.catch(() => {
					// on cancel
				});
		}
	},
	onLoad(option) {
		let _this = this;
		this.getList();
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('acceptDataFromOpenerPage', function(data) {
			if (data) {
				_this.detail = data;
			}
		});
	}
};
</script>

<style>
.order-detail-page {
	height: 100%;

	background: #f5f5f5;
	display: flex;
	align-items: center;
	flex-direction: column;
}
.detail-content {
	margin: 0 16rpx 24rpx 16rpx;
	width: 716rpx;
	background-color: #f5f5f5;
	border-radius: 16rpx;
	overflow: hidden;
	padding: 12rpx 0;
	--card-background-color: #f5f5f5;
	--cell-background-color: #f5f5f5·;
	--cell-line-height: 28rpx;
	--cell-font-size: 26rpx;
	--divider-margin: 8rpx;
}
.van-card__thumb {
	background-color: #ffffff;
}
.contract-cell {
	padding-top: 24rpx;
	flex: 1;
	width: 100%;
	background-color: #ffffff;
	--cell-background-color: #ffffff;
}
.btn-box {
	background-color: #f5f5f5;
	padding: 32rpx 80rpx;
	width: 100%;
}
</style>
