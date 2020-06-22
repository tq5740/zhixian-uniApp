<template>
	<view class="auth-edit">
		<info-list ref="infolist" :infolist="infolist"></info-list>
		<view class="btn" @tap="onToEdit">
			<text>确定</text>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "@/api/modules/user.js"

export default {
	computed: {
		noData() {
			return this.infolist.length == 0;
		}
	},
	data() {
		return {
			infolist: [],
			auth: {}
		}
	},
	onLoad({
		item
	}) {
		item = JSON.parse(item);
		this.auth = item;
		this.$updateNavbarTitle("用户" + item.name);
		this.infolist = [
			[{
				title: "姓名",
				el: "input",
				value: item.name,
				key: "name"
			}, {
				title: "身份证号",
				el: "input",
				value: item.idNumber,
				key: "idNumber"
			}]
		]
	},
	methods: {
		onToEdit() {
			let data = this.$refs.infolist.getData();
			data.userId = this.auth.userId;
			uni.showLoading();
			userApi.postUpdateUserAuth(data).then(data => {
				this.$toast("修改成功");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		}
	}
}
</script>

<style>
	.auth-edit {
	  background: #f2f2f2;
	  height: 100%;
	}
	.btn {
	  width: 690upx;
	  height: 88upx;
	  background: #42b983;
	  border-radius: 10upx;
	  margin: 40upx auto;
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  color: #ffffff;
	  font-weight: 500;
	  text-align: center;
	  line-height: 88upx;
	}
</style>
