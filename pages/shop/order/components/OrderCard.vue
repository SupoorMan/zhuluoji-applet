<template>
	<view @click="toDetail">
		<van-card :thumb="firstImage" custom-class="pro-card">
			<view slot="title" class="title">
				<view>{{ order.productName }}</view>
				<view class="order-status">{{ orderState[order.status] }}</view>
			</view>
			<view slot="desc" class="price">
				{{ order.integral }}
				<text class="unit">积分</text>
			</view>
			<view slot="footer" @click.stop>
				<!-- 			<van-button size="mini" class="button" round open-type="contact"
					v-if="order.status === 1 || order.status === 2">&nbsp;找客服&nbsp;</van-button> -->
				<van-button size="mini" class="button" round v-for="btn in buttons[order.status]" :key="btn.key"
					@tap="clickButton(btn.key)">
					&nbsp;{{ btn.name }}&nbsp;
				</van-button>

				<!-- <van-button size="mini" @click.prevent.stop="clickButton(6)">去评价</van-button> -->
			</view>
		</van-card>
	</view>
</template>

<script>
	import { updateStatus } from "@/api/order";
	export default {
		props: {
			order: {
				type: Object,
			},
		},
		computed: {
			firstImage() {
				if (this.order && this.order.productImage) {
					const imgs = this.order.productImage.split(",");
					return imgs.length > 1 ? imgs[0] : this.order.productImage;
				} else {
					return "";
				}
			},
		},
		data() {
			return {
				orderState: {
					"-1": "已取消",
					0: "未支付",
					1: "待发货",
					2: "待收货",
					3: "已完成",
				},
				buttons: {
					1: [{
							name: "找客服",
							key: 1,
						},
						// {
						// 	name: "催发货",
						// 	key: 2,
						// },
						{
							name: "改地址",
							key: 3,
						},
						// {
						// 	name: "取消订单",
						// 	key: 4,
						// },
					],
					2: [{
							name: "找客服",
							key: 1,
						},
						{
							name: "确认收货",
							key: 5,
						},
					],
					// 3: [{
					// 	name: "去评价",
					// 	key: 6,
					// }, ],
					"-1": [{
							name: "删除订单",
							key: 7,
						},
						{
							name: "重新兑换",
							key: 8,
						},
					],
				},
			};
		},
		methods: {
			toDetail() {
				uni.navigateTo({
					url: '/pages/shop/order/detail?id=' + this.order.id
				})
			},
			updateOrder(record) {
				updateStatus({
					...this.order,
					...record,
				}).then((res) => this.$emit("update", res.code === 200));
			},
			clickButton(key) {
				switch (key) {
					case 2: // 催发货
						break;
					case 3: // 改地址
						const order = this.order
						uni.navigateTo({
							url: '/pages/shop/order/addOrder?id=' + order.id,
							success: function(res) {
								// 通过eventChannel向被打开页面传送数据
								res.eventChannel.emit('acceptDataFromOpenerPage', order);
							}
						})
						// this.$emit('changeAddress')
						break;
					case 4: // 取消订单
						uni.showModal({
							content: "确认取消该订单吗",
							success: (res) => {
								if (res.confirm) {
									this.updateOrder({
										status: -1,
									});
								}
							},
						});
						break;
					case 5: // 确认收货
						this.updateOrder({
							status: 3,
						});
						break;
					case 6: // 去评价
						uni.navigateTo({
							url: "/pages/shop/userReviews/add?id=" + this.order.id,
						});
						return;
					case 7: // 删除订单
						uni.showModal({
							content: "确认删除该订单吗",
							success: (res) => {
								if (res.confirm) {
									this.updateOrder({
										state: -1,
									});
								}
							},
						});
						break;
					case 8: // 重新兑换
						uni.navigateTo({
							url: "/pages/shop/detail?productId=" + this.order.productId,
						});
						break;
					default:
						break;
				}
			},
		},
	};
</script>

<style>
	.pro-card {
		border-radius: 16rpx;
		margin-top: 16rpx;
	}

	.title,
	.price {
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
	}

	.title {
		height: 118rpx;
		justify-content: space-between;
	}

	.order-status {
		color: #ff6a5f;
		width: 120rpx;
		text-align: right;
	}

	.price {
		align-items: center;
		color: #ff6600;
	}

	.unit {
		color: #666;
		margin-left: 4rpx;
	}

	.button {
		--button-mini-font-size: 22rpx;
		--button-mini-min-width: 120rpx;
		padding: 0 8rpx;
	}

	.van-button {
		padding: 0 12rpx !important;
	}
</style>
