<template>
	<view class="add-address" v-if="add">
		<van-cell-group>
			<van-field required label="收件人" :value="add.receiver" placeholder="请输入收件人" border="false"
				@change="onChange($event, 'receiver')" />
			<van-field required label="手机号" type="number" :value="add.phone" placeholder="请输入手机号" border="false"
				@change="onChange($event, 'phone')" />
			<van-cell required label="选择地址" :value="add.province + add.city + add.area" placeholder="选择地址"
				border="false" is-link readonly @tap="showSelectAddress = true" />
			<van-field required label="详细地址" :value="add.address" placeholder="请输入详细地址" type="textarea" autosize
				border="false" @change="onChange($event, 'address')" />
			<van-cell title="设为默认">
				<template #default>
					<van-switch :checked="add.defaults === 1" @change="setDefault" size="40rpx"
						active-color="#e5d4ff" />
				</template>
			</van-cell>
		</van-cell-group>
		<!-- <van-cell-group inset> -->
		<view class="read-address">
			<view class="title">粘贴文本识别</view>
			<view>
				<textarea v-model="copyValue"></textarea>
				<van-button size="mini" color="#c5abff" class="read-button" style="float: right;" @tap="getArea">
					识别信息
				</van-button>
			</view>
		</view>

		<view class="button">
			<van-button type="default" block round color="linear-gradient(to right, #cca0ff, #eadefc)" @tap="toAdd">
				{{ add.id ? '确认修改' : '确认添加' }}
			</van-button>
		</view>

		<!-- 地区 -->
		<van-popup :show="showSelectAddress" round position="bottom" @close="showSelectAddress = false">
			<van-area :value="fieldValue" title="请选择省市区" :area-list="areaList" @confirm="onFinish"
				@close="showSelectAddress = false" />
		</van-popup>
	</view>
</template>

<script>
	import { areaList } from 'area-data';
	import { addAddress, updateAddress } from '@/api/setting';
	import { userStore } from '@/store'
	import { mapState } from 'pinia'
	export default {
		data() {
			return {
				add: null,
				areaList: areaList,
				showSelectAddress: false,
				fieldValue: ''
			};
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			onChange(event, fieldName) {
				this.add[fieldName] = event.detail;
			},
			setDefault(event) {
				this.add.defaults = event.detail ? 1 : 0;
			},
			async onFinish(event) {
				this.fieldValue = event.detail.values[2].code;
				const textArr = event.detail.values.map(n => n.name);
				this.add = {
					...this.add,
					province: textArr[0],
					city: textArr[1],
					area: textArr[2]
				};
				this.showSelectAddress = false;
			},
			getArea() {
				if (!this.copyValue) return
				const regex =
					'(.*?)(?<province>[^\x00-\xff]+省|.+自治区)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<area>[^市]+市|[^县]+县|[^旗]+旗|[^区]+区)(?<address>.*)';
				const regPhone = /1[3-9][0-9]\d{8}/;
				const value = this.copyValue.replaceAll('\r', '').replaceAll('\n', '');
				const result = value.match(regex);
				const receiver = result.groups.address.match(/^(.*?) [^\x00-\xff]{2-4} (.*?)$/);
				const phone = result.groups.address.match(regPhone);
				if (result.groups) {
					const { province, city, area, address } = result.groups;
					this.add = {
						...this.add,
						province,
						city,
						area,
						address: phone ? address.replace(phone, '') : address,
						phone: phone ? phone[0] : ''
					};
				}
				console.log(result, receiver, phone);
			},
			async toAdd() {
				const keys = Object.keys(this.add);
				for (var i = 0; i < keys.length; i++) {
					if (this.add[keys[i]] === '') {
						uni.showToast({
							icon: 'none',
							title: '必填项不能为空'
						});
						return false;
					}
				}
				let result = '';
				if (this.add.id) {
					result = await updateAddress(this.add);
				} else {
					result = await addAddress(this.add);
				}
				if (result.code === 200) {
					uni.showToast({
						icon: 'none',
						title: (this.add.appletUserId ? '更新' : '添加') + '成功！'
					});
					uni.navigateBack({ delta: 1 });
				} else {
					uni.showToast({
						icon: 'error',
						title: result.msg
					});
				}
			}
		},
		onLoad(option) {
			let _this = this;
			if (option.id) {
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.on('acceptDataFromOpenerPage', function(data) {
					if (data) {
						_this.add = { ...data };
					}
				});
			} else {
				_this.add = {
					address: '',
					appletUserId: this.user.id,
					area: '',
					city: '',
					defaults: 0,
					phone: '',
					province: '',
					receiver: ''
				}
			}
		}
	};
</script>

<style>
	.add-address {
		background: #fff;
		height: 100%;
		--cell-label-color: #565656;
		--cell-label-font-size: 28rpx;
	}

	.button {
		width: 448rpx;
		margin: 80rpx auto;
	}

	.read-address {
		margin: 32rpx;
		background-color: #f5f5f5;
		/* border: 2rpx solid #454545; */
		border-radius: 16rpx;
		overflow: hidden;
		padding: 24rpx;
		--card-background-color: #f5f5f5;
	}

	.title::before {
		content: '|';
		margin-right: 4rpx;
	}

	.read-button {
		border: 2rpx solid #454545;
		border-radius: 24rpx;
		overflow: hidden;
		padding: auto 12rpx;
	}
</style>
