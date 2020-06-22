<template>
	<div class="login">
		<div class="loading" v-if="changeLoading">
			<p>角色切换中,请稍候...</p>
		</div>

		<div class="pass_box1">
			<input cursor-spacing="20" v-model="phone" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入手机号码">
		</div>

		<div class="pass_box1">
			<input cursor-spacing="20" v-model="password" class="pass_box_inp" type="password" placeholder="请输入密码">
		</div>

		<div class="pass_box" v-if="imgVerifyCode">
			<input cursor-spacing="20" v-model="answerCode" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
			<img class="pass_box_t" :src="imgSrcDomain + imgVerifyCode" alt="" srcset="" @tap="imageCode">
		</div>

		<div class="forget_pass" @click="checked = !checked">
			<span v-if="checked" class="iconfont iconyigouxuan icon-yigouxuan"></span>
			<span v-if="!checked" class="iconfont iconweigouxuan icon-weigouxuan"></span>记住密码
		</div>

		<button class="btn" @tap="loginFunc" :loading="loading">登录</button>

		<div class="setlogin_box" :style="{'margin-bottom':imgVerifyCode ?  '55px' :''}">
			<div class="setlogin_box_t1">
				<span @tap="forgetPW">忘记密码？</span>
			</div>
			<!-- <div class="setlogin_box_t2">
				<span @tap="registerFunc">立即注册</span>
			</div> -->
		</div>
	</div>
</template>

<script>
import User from "../../api/modules/user";
import md5 from "@/utils/md5.min.js";
import { wxLogin } from "../../utils/utils";

export default {
	data() {
		return {
			imgVerifyCode: "",
			phone: "",
			password: "",
			answerCode: "",
			checked: false,
			loading: false,
			changeLoading: false,
			wxlogin: wxLogin
		}
	},
	computed: {
		imgSrcDomain() {
			return this.$store.state.configData.imgDomain;
		}
	},
	methods: {
		// 忘记密码;
		forgetPW() {
			uni.redirectTo({ url: "/pages/login/getpaw" })
		},
		wxLoginAndH5() {
			wxLogin(this.$store.state.configData.wxAppId);
		},
		// 登录
		loginFunc() {
			if (!this.phone || !this.password) {
				uni.showToast({
					icon: "none",
					title: "请输入正确的手机号码或密码"
				});
				return;
			}
			if (this.loading === true) return;
			this.loading = true;
			var data = {
				lat: this.$store.state.pos.lat,
				lng: this.$store.state.pos.lng,
				device: 1,
				phone: this.phone,
				password: md5(this.password).toUpperCase()
			};
			if (this.imgVerifyCode) {
				data.answerCode = this.answerCode;
				this.userLogin(data);
			} else {
				User.imageCode({ phone: this.phone }).then(res => {
					if (res.errorTimes >= 5) {
						this.imgVerifyCode = res.url;
						this.loading = false;
						uni.setStorage({ key: "imgVerifyCode", data: res.url });
					} else {
						this.loading = true;
					}
					if (res.errorTimes == 5 && this.answerCode == "") {
						uni.showToast({
							icon: "none",
							title: "密码错误超过5次,请输入验证码登录!"
						});
					} else {
						this.userLogin(data);
					}
				})
			}
		},
		imageCode() {
			this.loading = false;
			User.imageCode({ phone: this.phone }).then(res => {
				if (res.errorTimes >= 5) {
					uni.setStorage({ key: "imgVerifyCode", data: res.url });
					this.imgVerifyCode = res.url;
					this.loading = false;
				} else {
					this.loading = true;
				}
			})
		},
		userLogin(data) {
			if (this.imgVerifyCode && this.answerCode === "") {
				this.loading = false;
				uni.showToast({
					icon: "none",
					title: "请输入验证码"
				});
				return;
			}
			User.userLogin(data).then(res => {
				if (this.checked === true) {
					let accountInfo = {
						lat: this.$store.state.pos.lat,
						lng: this.$store.state.pos.lng,
						phone: this.phone,
						password: this.getCharcode(this.password)
					};
					uni.setStorage({ key: "accountInfo", data: accountInfo });
				} else {
					uni.removeStorage({ key: 'accountInfo' })
				}
				uni.removeStorage({ key: 'imgVerifyCode' });
				if (!res.userAdministrator) {
					this.$toast("你没有管理员权限！");
					return;
				}
				uni.setStorage({ key: "user_token", data: res.token });
				this.$store.dispatch("setUserInfo", res);
				// tabBar跳转
				uni.switchTab({ url: "/pages/statistics/statistics" });
			})
			this.loading = false;
		},
		// 加密
		getCharcode(str) {
			return str.replace(/./g, function (a) {
				return String.fromCharCode(a.charCodeAt(0) + 5);
			});
		},
		// 解密密码
		charcode(str) {
			return str.replace(/./g, function (a) {
				return String.fromCharCode(a.charCodeAt(0) - 5);
			});
		},
		// 注册
		registerFunc() {
			uni.redirectTo({ url: "/pages/login/reg" })
		}
	},
	// #ifdef H5
	mounted() {
		let dom = document.getElementsByTagName("input")[0];
		dom.setAttribute('pattern', '[0-9]*');
	},
	// #endif
	onShow() {
		this.$updateNavbarTitle("手机号登录");
	},
	created() {
		if (uni.getStorageSync("imgVerifyCode")) {
			this.imgVerifyCode = uni.getStorageSync("imgVerifyCode");
		}
		if (uni.getStorageSync("user_token")) {
			let data = { token: uni.getStorageSync("user_token") };
			User.getUserByToken(data).then(res => {
				if (!res.userAdministrator) {
					this.$toast("你没有管理员权限！");
					return;
				}
				this.$store.dispatch("setUserInfo", res);
				uni.setStorage({ key: "user_token", data: res.token });
				// tabBar跳转
				uni.switchTab({ url: "/pages/statistics/statistics" });
			}).catch(e => {
				this.changeLoading = false;
				uni.showToast({
					icon: "none",
					title: "登录失败,请重新登录"
				});
				uni.removeStorageSync('user_token');
			})
		}
		let accountInfos = uni.getStorageSync("accountInfo");
		if (accountInfos) {
			this.phone = accountInfos.phone;
			this.password = this.charcode(accountInfos.password);
			this.checked = true;
		}
	}
}
</script>
<style lang="scss" scoped>
	.margin_b_20 {
	  margin-bottom: 20upx;
	}
	.icon-yigouxuan {
	  color: #42b983;
	}
	.icon-yigouxuan,
	.icon-weigouxuan {
	  font-size: 28upx;
	}
	.login {
	  min-height: 100%;
	  .loading {
	    position: fixed;
	    top: 0;
	    left: 0;
	    min-height: 100%;
	    width: 100%;
	    background: #f2f2f2;
	    color: #666;
	    z-index: 99999;
	    .van-loading {
	      margin: auto;
	      margin-top: 60%;
	    }
	    p {
	      text-align: center;
	      margin-top: 10upx;
	      font-size: 28upx;
	    }
	  }
	  background: #fff;
	  min-height: 100%;
	  padding: 40upx 20upx 200upx 20upx;
	  font-size: 24upx;
	  .btn {
	    width: 710upx;
	    height: 88upx;
	    border-radius: 10upx !important;
	    font-size: 34upx;
	    line-height: 88upx;
	    margin-bottom: 50upx;
	    border: none;
	    color: #fff;
	    background-color: #42b983;
	  }
	  .pass_box {
	    height: 88upx;
	    font-size: 32upx;
	    margin-bottom: 50upx;
	    display: flex;
	    align-items: center;
	    overflow: hidden;
	    .pass_box_inp {
	      height: 100%;
	      width: 450upx;
	      background: #f2f2f2;
	      border-radius: 10upx;
	      padding: 20upx;
	    }
	    .pass_box_t {
	      color: #42b983;
	      width: 240upx;
	      margin-left: 20upx;
	      height: 84upx;
	      border-radius: 10upx;
	    }
	  }
	  .pass_box1 {
	    height: 88upx;
	    font-size: 32upx;
	    margin-bottom: 20upx;
	    display: flex;
	    align-items: center;
	    overflow: hidden;
	    .pass_box_inp {
	      height: 100%;
	      width: 100%;
	      background: #f2f2f2;
	      border-radius: 10upx;
	      padding: 20upx;
	    }
	    .pass_box_t {
	      color: #42b983;
	      width: 240upx;
	      margin-left: 20upx;
	      height: 84upx;
	      border-radius: 10upx;
	    }
	  }
	  .forget_pass {
	    font-size: 26upx;
	    color: #999;
	    text-align: left;
	    margin-bottom: 30upx;
	    margin-top: 50upx;
	    span {
	      padding-right: 15upx;
	    }
	  }
	  .setlogin_box {
	    color: #999;
	    margin-bottom: 218upx;
	    display: flex;
	    .setlogin_box_t1,
	    .setlogin_box_t2 {
	      flex: 1;
	      margin-top: 30upx;
	      font-size: 26upx;
	    }
	    .setlogin_box_t2 {
	      text-align: right;
	      color: #42b983;
	    }
	  }
	}

	.login_way {
	  text-align: center;
	  color: #999;
	  margin-bottom: 60upx;
	  font-size: 26upx;
	}
	.icon_uni {
	  text-align: center;
	  .home_icon_N {
	    font-size: 80upx;
	    color: #1bcb44;
	  }
	}

	.wx-div {
	  margin: auto;
	  width: 80upx;
	  height: 80upx;
	  position: relative;
	}
	.wx {
	  opacity: 0;
	  position: absolute;
	  margin: auto;
	  width: 80upx;
	  height: 80upx;
	  z-index: 99999;
	}
	.login-weixin {
	  position: absolute;
	  top: 0;
	  left: 0;
	}
</style>
