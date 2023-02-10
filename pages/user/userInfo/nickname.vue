<template>
	<view class="name-page">
		<van-cell-group>
			<van-field label="昵称" type="nickname" :value="user.nickname||nickName" @blur="changeNickname" />
		</van-cell-group>
		<view style="width: 448rpx;margin: 80rpx auto;">
			<van-button @tap="update" round block color="#cca0ff">确定</van-button>
		</view>

	</view>
</template>

<script>
	import { userStore } from '@/store';
	import { updateUser } from '@/api/user.js';
	import { mapActions, mapState } from 'pinia';
	export default {
		data() {
			return {
				nickName: ''
			}
		},
		computed: {
			...mapState(userStore, ['user'])
		},
		methods: {
			...mapActions(userStore, ['setUser']),
			changeNickname(event) {
				if (event.detail.value) {
					this.nickName = event.detail.value
				}
			},
			async update() {
				const { code } = await updateUser({
					nickname: this.nickName,
					id: this.user.id
				});
				if (code === 200) {
					this.setUser({ ...this.user, nickname: this.nickName })
					uni.showToast({
						title: '设置成功'
					})
					return true;
				}
				return false;
			}
		},
		onLoad() {}
	}
</script>

<style scoped>
	.name-page {
		background: #fff;
	}
</style>
