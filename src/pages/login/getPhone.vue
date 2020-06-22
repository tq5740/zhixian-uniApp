<template>
	<view class="page-full">
		<view class="pass_box phone">
			<input class="pass_box_phone" type="number" placeholder="请输入手机号" v-model="phone" />
		</view>
		<view class="pass_box">
			<input cursor-spacing="20" v-model="verifyCode" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
			<span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
		</view>
		<view class="tips">
			<text>该手机号会用作管理员手机号，并作为后续审核进度查询依据</text>
		</view>
		<view class="btn" @tap="next"><text>下一步</text></view>
	</view>
</template>

<script>
	import User from '@/api/modules/user'
	import Publics from '@/api/modules/public'
	export default {
		data() {
			return {
				phone: "",
				verifyCodeTxt: "获取验证码",
				verifyCode: "",
			};
		},
		onLoad() {},
		methods: {
			// 获取验证码
			getVerifyCode() {
				if (!this.$mobileReg(this.phone) || !this.phone) {
					uni.showToast({
						icon: "none",
						title: "请输入正确的手机号码"
					});
					return;
				}
				if (this.verifyCodeTxt.length < 4) return;
				Publics.sendAuthCodeUser({
					phone: "HFDQBCWQAEQ" +
						this.phone
						.replace(/1/g, "Q")
						.replace(/2/g, "W")
						.replace(/3/g, "E")
						.replace(/4/g, "R")
						.replace(/5/g, "T")
						.replace(/6/g, "Y")
						.replace(/7/g, "U")
						.replace(/8/g, "I")
						.replace(/9/g, "O")
						.replace(/0/g, "P"),
					siteHierarchy: this.$store.state.configData.hierarchy
				});
				let num = 60;
				this.verifyCodeTxt = "60s";
				this.Interval = setInterval(() => {
					if (num == 1) {
						clearInterval(this.Interval);
						this.verifyCodeTxt = "重新获取";
					} else {
						num = num - 1;
						this.verifyCodeTxt = num + "s";
					}
				}, 1000);
			},
			next() {
				if (this.$isEmpty(this.phone)) {
					this.$toast("请输入手机号");
					return;
				}
				if (this.$isEmpty(this.verifyCode)) {
					this.$toast("请输入验证码");
					return;
				}
				User.queryRegByPhone({
					phone: this.phone,
					authCode: this.verifyCode
				}).then(data => {
					uni.setStorageSync("regOrg", data);
					uni.redirectTo({
						url: `/pages/login/orgReg?phone=${this.phone}`
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-full {
		background: #FFFFFF;
		padding: 0px 20upx;
	}

	// input{
	// 	border-radius: 10upx;
	//   background: #f2f2f2;
	// 	padding: 0px 20upx;
	// 	margin-top: 50upx;
	// 	font-size: 28upx;
	// }
	.phone {
		margin-top: 50upx;
	}

	.pass_box {
		$h: 88upx;
		height: $h;
		position: relative;
		font-size: 32upx;
		margin-bottom: 20upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: #f2f2f2;

		.pass_box_phone {
			width: 100%;
			padding-left: 20upx;
		}

		.pass_box_inp {
			// line-height: 88upx;
			width: 463upx;
			border-right: 1upx solid #ccc;
			padding-left: 20upx;
		}

		.pass_box_t {
			position: absolute;
			right: 10upx;
			top: 25upx;
			color: #42b983;
			display: inline-block;
			width: 214upx;
			text-align: center;
		}
	}

	.tips {
		font-size: 24upx;
		color: #FC703E;
		margin-top: 20upx;
		border: 1upx dashed #FC703E;
		border-radius: 10upx;
		padding: 20upx;
	}

	.btn {
		$h: 88upx;
		height: $h;
		line-height: $h;
		background: $color-main;
		color: #FFFFFF;
		border-radius: 10upx;
		text-align: center;
		font-size: 34upx;
		margin-top: 100upx;
	}
</style>
