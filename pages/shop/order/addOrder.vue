<template>
	<view class="order-detail-page" v-if="detail">
		<view style="background: #fff">
			<view class="detail-content">
				<van-card num="1" :desc="'简介:' + (detail.introduction||'-')" :title="detail.productName"
					:thumb="getProImage(detail.productImage || '')">
				</van-card>
				<van-divider />
				<van-cell title="消费积分" :value="currentSpecs.integral" :border="false" />
			</view>
		</view>
		<view class="contract-cell">
			<van-cell-group :border="false">
				<van-cell v-if="!editId" is-link title="规格" title-width="100rpx"
					:value="currentSpecs ? currentSpecs.text : '-'" @click="showSpecs = true">
				</van-cell>
				<van-cell v-else title="规格" title-width="100rpx" :value="currentSpecs.text">
				</van-cell>
				<van-cell title="配送" title-width="100rpx" value="普通快递"></van-cell>
				<van-cell title="运费" value="包邮"></van-cell>
				<van-cell is-link title="地址" :border="false" title-width="100rpx" :value="filedValue || '请选择地区'"
					@click="showSelectAddress = true"></van-cell>
			</van-cell-group>
			<van-popup round position="bottom" :show="showSelectAddress" @close="onAddrChange" class="pop-addr">
				<view style="line-height: 80rpx; padding:0 24rpx;display: flex;justify-content: space-between;">
					选择配送地址
					<view @tap="toAddr" v-if="address && address.length>0">
						<van-icon name="plus" size="32rpx" />
						新地址
					</view>
				</view>
				<van-cell-group v-if="address && address.length>0">
					<van-cell use-label-slot center clickable v-for="item in address" :key="item.id"
						:data-name="item.id" :border="false" @click="onAddrSelect">
						<template #title>
							<text>{{ item.receiver + " " + item.phone + " " }}</text>
							<van-tag mark type="danger" v-if="item.defaults === 1">默认</van-tag>
						</template>
						<template #label>
							{{ item.province + item.city + item.area + item.address }}
						</template>
						<radio slot="right-icon" :name="item.id" color='#F9CD90' :checked="selectAddress===item.id" />
					</van-cell>
				</van-cell-group>
				<van-empty v-else description="抱歉,您没有配置收货地址">
					<van-button round color="#c5abff" @click="toAddr">添加地址</van-button>
				</van-empty>

			</van-popup>
			<van-popup :show="showSpecs" round position="bottom" @close="showSpecs = false" v-if="specsColumns">
				<van-picker show-toolbar :columns="specsColumns" @confirm="selectSpecs" @cancel="showSpecs = false" />
			</van-popup>
			<van-dialog id="van-dialog" />
		</view>
		<view class="btn-box">
			<van-button @click="handelSubmit" round block color="#F9CD90">{{editId ? '确认修改':'确认兑换'}}</van-button>
		</view>
	</view>
</template>

<script>
	import OrderCard from "./components/OrderCard";
	import Recommend from "../components/Recommend.vue";
	import { addOrder2, updateOrderAddr } from "@/api/order";
	import { getAddressList, getConfigInfos } from "@/api/setting";
	import Dialog from "@/wxcomponents/vant/dialog/dialog";
	export default {
		components: {
			OrderCard,
			Recommend,
		},
		data() {
			return {
				detail: null,
				address: null,
				filedValue: "",
				showSelectAddress: false,
				selectAddress: null, // 选中的地址
				showSpecs: false,
				specsColumns: null,
				currentSpecs: null,
				editId: null
			};
		},
		methods: {
			toAddr() {
				uni.navigateTo({
					url: '/pages/user/address/address'
				})
			},
			getProImage(urls) {
				if (urls) {
					const imgs = urls.split(",");
					return imgs.length > 1 ? imgs[0] : urls;
				} else {
					return "";
				}
			},
			onAddrChange() {
				this.showSelectAddress = false;
				if (this.selectAddress) {
					const nowAddr = this.address.find((n) => n.id === this.selectAddress);
					this.filedValue =
						nowAddr.receiver +
						"," +
						nowAddr.phone +
						"," +
						nowAddr.province +
						nowAddr.city +
						nowAddr.area +
						nowAddr.address;
				}
			},
			onAddrSelect(event) {
				const { name } = event.currentTarget.dataset;
				this.selectAddress = Number(name);
				this.onAddrChange()
			},
			async getList() {
				const { data } = await getAddressList();
				this.address = data;
			},
			selectSpecs(event) {
				this.currentSpecs = event.detail.value;
				this.showSpecs = false;
			},
			async getTansfer() {
				const { data } = await getConfigInfos({
					key: "transfer",
				});
				this.transferList = data.map((n) => ({
					name: n.value,
					value: n.context,
				}));
				this.expressFee = data[0].context;
				this.currentTransf = data[0].value;
			},
			async handelSubmit() {
				if (!this.selectAddress) {
					uni.showToast({
						title: '请选择配送地址',
						icon: 'none'
					})
					return false
				}
				if (this.editId) {
					await this.updateOrder()
				} else {
					await this.addOrder()
				}
			},
			async addOrder() {
				Dialog.confirm({
						message: "确认使用" + this.currentSpecs.integral + "积分兑换",
					})
					.then(async () => {
						const result = await addOrder2({
							amountId: this.currentSpecs.value, // 规格id
							amount: 1, //数量
							expressFee: 0,
							integral: this.currentSpecs.integral,
							productId: this.detail.id,
							receiveAddress: this.filedValue,
							state: 0,
							status: 1,
						});
						if (result.code === 200) {
							Dialog.alert({
								title: "兑换成功",
								message: "可至“我的订单”中查看详情",
							}).then(() => {
								// on close
								uni.navigateBack({
									delta: 1,
								});
							});
						} else {
							uni.showToast({
								icon: "error",
								title: result.msg,
							});
						}
					})
					.catch(() => {
						// on cancel
					});
			},
			async updateOrder() {
				const { code, data } = await updateOrderAddr({ id: this.editId, receiveAddress: this.filedValue })
				if (code === 200) {
					Dialog.alert({
						title: "修改地址成功",
						message: "可至“我的订单”中查看详情",
					}).then(() => {
						// on close
						uni.navigateBack({
							delta: 1,
						});
					});
				}
			}
		},
		onLoad(option) {
			let _this = this;
			if (option.id) {
				this.editId = option.id
			}
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on("acceptDataFromOpenerPage", function(data) {
				if (data) {
					_this.detail = data;
					console.log(data)
					if (data.list && data.list.length > 0) {
						_this.specsColumns = data.list.map((m) => ({
							value: m.id,
							text: m.sizes ?
								m.colors ?
								m.sizes + "[" + m.colors + "]" :
								m.sizes : m.colors,
							integral: m.integral,
						}));
						_this.currentSpecs = _this.specsColumns[0];
					} else {
						_this.currentSpecs = {
							value: data.productId,
							text: data.sizes ?
								data.colors ?
								data.sizes + "[" + data.colors + "]" :
								data.sizes : data.colors,
							integral: data.integral
						};
						_this.filedValue = data.receiveAddress
					}
				}
			});
		},
		onShow() {
			this.getList();
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
		--cell-background-color: #f5f5f5;
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

	.pop-addr {
		min-height: 300rpx;
	}

	.btn-box {
		background-color: #f5f5f5;
		padding: 32rpx 80rpx;
		width: 100%;
	}
</style>
