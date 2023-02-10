<template>
	<view class="address-page">
		<view class="addresslist">
			<view class="address-unit" v-for="item in list" :key="item.id">
				<van-swipe-cell @close="onClose" async-close rightWidth="40" :name="item.id">
					<van-cell-group inset>
						<van-cell use-label-slot center is-link @tap="toEdit(item)">
							<template #title>
								<text>{{ item.receiver + ' ' + item.phone + ' ' }}</text>
								<van-tag mark type="danger" v-if="item.defaults === 1">
									默认
								</van-tag>
							</template>
							<template #label>
								{{ item.province + item.city + item.area + item.address }}
							</template>
							<van-icon slot="right-icon" name="edit" class="custom-icon" />
						</van-cell>
					</van-cell-group>
					<view slot="right" class="delete">删除</view>
				</van-swipe-cell>
			</view>

			<van-empty description="暂无地址信息" v-if="list.length === 0" />
			<van-dialog id="van-dialog" />
		</view>
		<view class="button">
			<van-button type="default" block round color="linear-gradient(to right, #cca0ff, #eadefc)" @tap="toAdd">
				新增地址
			</van-button>
		</view>
	</view>
</template>

<script>
	import { getAddressList, delAddress } from '@/api/setting';
	import Dialog from '@/wxcomponents/vant/dialog/dialog';
	export default {
		data() {
			return {
				list: []
			};
		},
		methods: {
			toEdit(item) {
				uni.navigateTo({
					url: '/pages/user/address/add?id=' + item.id,
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', item);
					}
				});
			},
			toAdd() {
				uni.navigateTo({
					url: '/pages/user/address/add'
				});
			},
			onClose(event) {
				const { position, instance, name } = event.detail;
				let addrs = this.list
				switch (position) {
					case 'cell':
						instance.close();
						break;
					case 'right':
						Dialog.confirm({
							message: '确定删除吗？'
						}).then(async () => {
							const { code } = await delAddress({ id: name })
							if (code === 200) {
								uni.showToast({
									icon: 'success',
									title: '删除成功'
								})
							}
							instance.close();
							const index = addrs.findIndex(n => n.id === name)
							if (index > -1) {
								addrs.splice(index, 1)
							}
						});
						break;
				}
			},
			async getList() {
				const { data } = await getAddressList();
				this.list = data;
			}
		},
		onShow() {
			this.getList();
		}
	};
</script>

<style>
	.address-page {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #f9f9f9;
	}

	.addresslist {
		flex: 1;
		width: 100%;
	}

	.address-unit {
		position: relative;
		padding-top: 32rpx;
	}

	.delete {
		background-color: #fc817c;
		height: inherit;
		width: 40px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 24rpx;
	}

	.button {
		width: 448rpx;
		margin: 0 auto;
	}
</style>
