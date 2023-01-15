<template>
	<view class="info-page">
		<view class="title">
			<van-icon name="label" color="#cea6fe" />
			基础信息
		</view>
		<van-cell is-link title="昵称" :value="user.nickname || '用户名'" link-type="navigateTo" url="/pages/input/index" />
		<van-cell is-link title="性别" :value="user.gender === 0 ? '女' : '男'" @click="showSelectSex = true" />
		<van-cell is-link title="生日" :value="user.birthday || '请选择生日'" @click="showSelectYear = true" />
		<van-cell is-link title="地区" :value="user.address || '请选择地区'" @click="showSelectAddress = true" />

		<van-cell v-if="!user.phone" is-link title="手机号" value="授权手机号" link-type="navigateTo"
			url="/pages/user/authorization/index" />
		<van-cell v-else title="手机号" :value="user.phone" />
		<van-cell is-link title="收货地址" link-type="navigateTo" url="/pages/user/address/address" />
		<view class="title">
			<van-icon name="label" color="#cea6fe" />
			第三方账号信息
		</view>
		<van-cell is-link title="DY账号" :value="user.dyId || '请输入DY账号'" @click="openChangeZh('DY账号')" />
		<van-cell is-link title="TB账号" :value="user.tbId || '请输入TB账号'" @click="openChangeZh('TB账号')" />
		<van-cell is-link title="小红书账号" :value="user.redbookId || '请输入小红书账号'" @click="openChangeZh('小红书账号')" />
		<!-- 性别 -->
		<van-popup :show="showSelectSex" round position="bottom" @close="showSelectSex = false">
			<van-picker show-toolbar :columns="columns" @confirm="selectSex" @cancel="showSelectSex = false" />
		</van-popup>
		<!-- 生日 -->
		<van-popup :show="showSelectYear" round position="bottom" @close="showSelectYear = false">
			<van-datetime-picker type="date" :value="currentDate" :min-date="minDate" :max-date="maxDate"
				:formatter="formatter" @cancel="showSelectYear = false" @confirm="confirmYear" />
		</van-popup>
		<!-- 地区 -->
		<van-popup :show="showSelectAddress" round position="bottom" @close="showSelectAddress = false">
			<van-area :value="fieldValue" title="地区" :area-list="areaList" @confirm="onFinish"
				@close="showSelectAddress = false" />
		</van-popup>
		<!-- 添加账号 -->
		<van-dialog use-slot :title="'绑定'+changeZhType" :show="showAddzh" show-cancel-button @confirm="submitChangeZh"
			@close="showAddzh=false">
			<view class="account-input">
				<input type="text" auto-focus :placeholder="'请输入'+changeZhType" @input="handelInput" />
			</view>
		</van-dialog>
	</view>
</template>

<script>
	import { updateUser } from '@/api/user.js';
	import { areaList } from 'area-data';
	import dayjs from 'dayjs';
	import { userStore } from '@/store';
	import { mapActions, mapState } from 'pinia';
	export default {
		data() {
			return {
				showSelectYear: false,
				showSelectSex: false,
				showSelectAddress: false,
				showAddzh: false, // 添加账号
				columns: [{
						text: '男',
						value: 1
					},
					{
						text: '女',
						value: 0
					}
				],
				currentDate: new Date().getTime(),
				maxDate: new Date().getTime(),
				minDate: new Date('1940-01-01').getTime(),
				formatter(type, value) {
					if (type === 'year') {
						return `${value}年`;
					}
					if (type === 'month') {
						return `${value}月`;
					}
					return value;
				},
				areaList: areaList,
				fieldValue: '',
				changeZhType: '',
				inputAccout: '', // 绑定的账号
			};
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			...mapActions(userStore, ['setUser']),
			async selectSex(event) {
				const {
					value,
					index
				} = event.detail;
				console.log(value, index);
				const success = await this.update({
					gender: value.value
				});
				if (success) {
					this.user.gender = value.value;
				}
				this.showSelectSex = false;
			},
			async confirmYear(event) {
				const birthday = dayjs(event.detail).format('YYYY-MM-DD');
				const success = await this.update({
					birthday: birthday
				});
				if (success) {
					this.user.birthday = birthday;
				}
				this.showSelectYear = false;
			},
			openChangeZh(type) {
				this.showAddzh = true
				this.changeZhType = type
			},
			handelInput(event) {
				this.inputAccout = event.detail.value
			},
			async submitChangeZh() {
				const key = { 'DY账号': 'dyId', 'TB账号': 'tbId', '小红书账号': 'redbookId', }
				const name = key[this.changeZhType]
				if (this.inputAccout) {
					await this.update({
						[name]: this.inputAccout
					});
					this.showAddzh = false
				}
			},
			async onFinish(event) {
				this.fieldValue = event.detail.values;
				const textArr = event.detail.values.map(n => n.name);
				await this.update({
					address: textArr.join(' ')
				});
				this.showSelectAddress = false;
			},
			async update(userinfo) {
				const { code } = await updateUser({
					...userinfo,
					id: this.user.id
				});
				if (code === 200) {
					this.setUser({ ...this.user, ...userinfo })
					uni.showToast({
						title: '设置成功'
					})
					return true;
				}
				return false;
			}
		}
	};
</script>

<style scoped>
	.info-page {
		background: #fff;
	}

	.title {
		line-height: 80rpx;
		padding-left: 32rpx;
		font-weight: 600;
	}

	.account-input {
		margin: 32rpx;
		border-radius: 12rpx;
		background-color: #F5F5F5;
		line-height: 80rpx;
		height: 80rpx;
	}

	.account-input input {
		padding-left: 12rpx;
		line-height: 80rpx;
		height: 80rpx;
	}
</style>
