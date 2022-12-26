<template>
	<view class="info-page">
		<view class="title">
			<van-icon name="label" color="#cea6fe" />
			基础信息
		</view>
		<van-cell
			is-link
			title="昵称"
			:value="user.nickname || '用户名'"
			link-type="navigateTo"
			url="/pages/input/index"
		/>
		<van-cell
			is-link
			title="性别"
			:value="user.gender === 0 ? '女' : '男'"
			@click="showSelectSex = true"
		/>
		<van-cell
			is-link
			title="生日"
			:value="user.birthday || '请选择生日'"
			@click="showSelectYear = true"
		/>
		<van-cell
			is-link
			title="地区"
			:value="fieldValue || '请选择地区'"
			@click="showSelectAddress = true"
		/>

		<van-cell
			v-if="!user.phone"
			is-link
			title="手机号"
			value="授权手机号"
			link-type="navigateTo"
			url="/pages/user/authorization/index"
		/>
		<van-cell v-else title="手机号" :value="user.phone" />
		<van-cell
			is-link
			title="收货地址"
			link-type="navigateTo"
			url="/pages/user/address/address"
		/>
		<view class="title">
			<van-icon name="label" color="#cea6fe" />
			第三方账号信息
		</view>
		<van-cell is-link title="DY账号" value="请输入DY账号" />
		<van-cell is-link title="TB账号" value="请输入TB账号" />
		<van-cell
			is-link
			title="小红书账号"
			value="请输入小红书账号"
			link-type="navigateTo"
			url="/pages/user/redbook/redbook"
		/>
		<!-- 性别 -->
		<van-popup :show="showSelectSex" round position="bottom" @close="showSelectSex = false">
			<van-picker
				show-toolbar
				:columns="columns"
				@confirm="selectSex"
				@cancel="showSelectSex = false"
			/>
		</van-popup>
		<!-- 生日 -->
		<van-popup :show="showSelectYear" round position="bottom" @close="showSelectYear = false">
			<van-datetime-picker
				type="date"
				:value="currentDate"
				:min-date="minDate"
				:max-date="maxDate"
				:formatter="formatter"
				@cancel="showSelectYear = false"
				@confirm="confirmYear"
			/>
		</van-popup>
		<!-- 地区 -->
		<van-popup
			:show="showSelectAddress"
			round
			position="bottom"
			@close="showSelectAddress = false"
		>
			<van-area
				:value="fieldValue"
				title="地区"
				:area-list="areaList"
				@confirm="onFinish"
				@close="showSelectAddress = false"
			/>
		</van-popup>
	</view>
</template>

<script>
import { updateUser } from '@/api/user/user.js';
import { areaList } from '@vant/area-data';
import dayjs from 'dayjs';

export default {
	// components: { CascaderAddress },
	data() {
		return {
			showSelectYear: false,
			showSelectSex: false,
			showSelectAddress: false,
			columns: [
				{
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
			user: null
		};
	},
	onLoad(options) {},
	onShow() {
		this.user = getApp().globalData.user;
		console.log('useinfo', this.user);
	},
	methods: {
		async selectSex(event) {
			const { value, index } = event.detail;
			console.log(value, index);
			const success = await this.update({ gender: value.value });
			if (success) {
				this.user.gender = value.value;
			}
			this.showSelectSex = false;
		},
		async confirmYear(event) {
			const birthday = dayjs(event.detail).format('YYYY-MM-DD');
			console.log(birthday);
			const success = await this.update({ birthday: birthday });
			if (success) {
				this.user.birthday = birthday;
			}
			this.showSelectYear = false;
		},
		async onFinish(event) {
			console.log(event.values);
			this.fieldValue = event.values;
			const textArr = event.values.map(n => n.name);

			const success = await this.update({
				province: textArr[0],
				city: textArr[1],
				country: textArr[2]
			});
			if (success) {
				this.addresstext = textArr.join('/');
			}
			this.showSelectAddress = false;
		},
		async update(userinfo) {
			const { code } = await updateUser({ ...userinfo, id: this.user.id });
			if (code === 200) {
				return true;
			}
			return false;
		}
	}
};
</script>

<style>
.info-page {
	background: #fff;
}

.title {
	line-height: 80rpx;
	padding-left: 32rpx;
	font-weight: 600;
}
</style>
