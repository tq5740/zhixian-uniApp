<template>
	<div class="login">
		<div class="swipe-img-wrap">
			<img class="swipe-img" :src="bannerDataArr.length > 0 ? configData.imgDomain + bannerDataArr[0].img : 'https://i.weijiuye.com.cn/default/cdwork/banner.jpg'">
		</div>

		<div class="content-div">
			<div class="top-div">
				<div class="cn">欢迎登录</div>
				<div class="en">Welcome</div>
				<span class="border-top bor1"></span>
				<span class="border-top bor2"></span>
			</div>

			<!--  #ifdef MP-WEIXIN -->
			<button v-if="isPhoneNumber" class="wx" open-type="getPhoneNumber" @getphonenumber="getPhoneNumberWeiXin"><span
				 class="iconfont iconweixin1 icon-weixin1"></span>请绑定您的手机号码</button>
			<template v-if="!isPhoneNumber">
				<button v-if="!isAuthUserInfo" class="wx" open-type="getUserInfo" @getuserinfo="getUserInfoWeiXin"><span class="iconfont iconweixin1 icon-weixin1"></span>微信小程序快速登录</button>
				<button v-if="isAuthUserInfo" class="wx" @click="onGetUserInfoFun"><span class="iconfont iconweixin1 icon-weixin1"></span>微信小程序快速登录</button>
			</template>
			<div class="phone" @tap="toPhone()">手机号码和密码登录</div>
			<div class="phone reg" @tap="toOrgReg">企业注册</div>
			<!--  #endif -->

			<!--  #ifdef H5 -->
			<div class="wx" @tap="wxLoginAndH5()"><span class="iconfont iconweixin1 icon-weixin1"></span>微信用户快速登录</div>
			<div class="phone" @tap="toPhone()">手机号码和密码登录</div>
			<div class="phone reg" @tap="toOrgReg">企业注册</div>
			<!--  #endif -->
		</div>

		<div class="footer-div">
			<span v-if="select" class="iconfont iconyigouxuan icon-yigouxuan" @click="select = !select"></span>
			<span v-if="!select" class="iconfont iconweigouxuan icon-weigouxuan" @click="select = !select"></span>
			<span> 已阅读并同意</span>
			<span style="color: #42b983">《用户协议》</span>
		</div>
		
	</div>
</template>

<script>
	import {
		wxLogin,
		isEmojiCharacter,
		wxShare,
		getAppVersion,
		isWxBrowser
	} from "../../utils/utils";
	import md5 from "@/utils/md5.min.js";
	import Publics from "../../api/modules/public";
	import User from "../../api/modules/user";
	export default {
		data() {
			return {
				isAuthUserInfo: true,
				isPhoneNumber: false,
				select: true,
				bannerDataArr: [],
				userPhoto: "",
				code: "",
				codeAuth: "",
				infoRes: {},
				openId: "",
				phoneNum: "",
			}
		},
		computed: {
			configData() {
				return this.$store.state.configData;
			}
		},
		onLoad(options) {
		},
		methods: {
			toPhone() {
				if (!this.select) {
					this.$toast("请同意用户协议");
					return;
				}
				uni.navigateTo({
					url: '/pages/login/phone'
				});
			},
			toOrgReg() {
				if (!this.select) {
					this.$toast("请同意用户协议");
					return;
				}
				uni.navigateTo({
					url:`/pages/login/getPhone`
				});
			},
			wxLoginAndH5() {
				if (!this.select) {
					this.$toast("请同意用户协议");
					return;
				}
				wxLogin(this.$store.state.configData.wxAppId);
			},
			getBannerList() {
				const data = {
					type: 2,
					pageNum: 1,
					orgId: this.configData.orgId
				};
				Publics.getUserBannerList(data).then(res => {
					const resData = res;
					const len = resData.length;
					if (len < 5) {
						this.bannerDataArr = resData;
					} else {
						this.bannerDataArr = res.slice(0, 5);
					}
				});
			},

			// 完成登录
			onOAuth() {
				let _this = this;
				wx.login({
					provider: 'weixin',
					success: function(codeAuth) {
						User.oAuth({
							code: codeAuth.code,
							data: JSON.stringify(_this.infoRes),
							type: 2,
							lat: _this.$store.state.pos.lat,
							lng: _this.$store.state.pos.lng,
							device: 1,
							appId: _this.$store.state.configData.xcxAppId
						}).then(res => {
							if (res.isLogin === false) {
								_this.openId = res.user.openId;
								_this.unionId = res.user.unionId;
								_this.isPhoneNumber = true;
								_this.$toast("请绑定您的手机号码！");
							} else {
								if (!res.userAdministrator) {
									_this.$toast("你没有管理员权限！");
									return;
								}
								uni.setStorage({
									key: "user_token",
									data: res.token
								});
								_this.$store.dispatch("setUserInfo", res);
								// tabBar跳转
								uni.switchTab({
									url: "/pages/statistics/statistics"
								});
							}
						});
					}
				});
			},

			// 绑定手机号码
			bindUserPhone() {
				User.bindUserPhone({
					openId: this.openId,
					unionId: this.unionId,
					userName: isEmojiCharacter(this.infoRes.userInfo.nickName) ? "新用户" + this.phoneNum[7] + this.phoneNum[8] + this.phoneNum[
						9] + this.phoneNum[10] : this.infoRes.userInfo.nickName,
					photo: this.userPhoto,
					type: 2,
					siteHierarchy: this.$store.state.configData.hierarchy,
					phone: this.phoneNum
				}).then(res => {
					this.onOAuth();
				});
			},

			// 手机号码授权
			getPhoneNumberWeiXin(numberRes) {
				let _this = this;
				let data = {
					code: _this.code,
					appId: _this.$store.state.configData.xcxAppId,
					encryptedData: numberRes.detail.encryptedData,
					iv: numberRes.detail.iv
				}
				wx.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.infoRes = infoRes;
						uni.showLoading({
							title: '正在登录...'
						});
						User.userDecrypt(data).then(res => {
							_this.phoneNum = JSON.parse(res).phoneNumber;
							_this.photoToFile();
						})
					}
				});
			},

			// 头像转file
			photoToFile() {
				let _this = this;
				wx.getImageInfo({
					src: _this.infoRes.userInfo.avatarUrl,
					success(res) {
						uni.uploadFile({
							url:  Publics.upload(),
							filePath: res.path,
							name: 'file',
							formData: {
								file: "test",
								uploadType: '1',
								path: "/user/user/photo"
							},
							success(res) {
								_this.userPhoto = JSON.parse(res.data).data.url;
								_this.bindUserPhone();
							}
						})
					},
					fail(e) {
						console.log(e);
					}
				})
			},
			// 用户完成授权后登录
			onGetUserInfoFun() {
				let _this = this;
				wx.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.infoRes = infoRes;
						uni.showLoading({
							title: '正在登录...'
						});
						_this.onOAuth();
					}
				});
			},

			// 用户信息授权完成后
			getUserInfoWeiXin() {
				this.onGetUserInfoFun();
			}
		},

		// #ifdef MP-WEIXIN
		onShareAppMessage() {
			return {
				title: "管理中心"
			}
		},
		// #endif

		onShow() {
			this.$updateNavbarTitle("登录");
			this.getBannerList();

			// #ifdef H5
			if (getAppVersion() === "android" && isWxBrowser()) {
				this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
			}
			let variableSetTimeOut = setTimeout(() => {
				let ShareConfig = {};
				ShareConfig.title = "管理中心";
				ShareConfig.link = window.location.href;
				ShareConfig.imgUrl = this.$store.state.configData.imgDomain + this.$store.state.configData.siteLogo + "/100x100";
				ShareConfig.desc = "一个集招聘管理、培训管理、课程管理、直播管理、考试管理等于一体的管理平台！";
				wxShare(ShareConfig);
				clearTimeout(variableSetTimeOut)
			}, 1000);
			// #endif

			// #ifdef MP-WEIXIN
			let _this = this;
			wx.getSetting({
				success(res) {
					_this.isAuthUserInfo = !!res.authSetting["scope.userInfo"];
				}
			})
			wx.login({
				provider: 'weixin',
				success: function(codeRes) {
					_this.code = codeRes.code;
				}
			});
			// #endif
		}
	}
</script>
<style lang="scss" scoped>
	.login {
		min-height: 100%;
		background-color: #f2f2f2;

		.icon-weixin1 {
			margin-right: 10upx;
		}

		.wx {
			display: inline-block;
			height: 88upx;
			width: 550upx;
			margin: auto;
			background-color: #42b983;
			color: #fff;
			margin-bottom: 40upx;
			outline: none;
			line-height: 88upx;
			border-radius: 10upx;
			margin-top: 100upx;
			font-size: 32upx;
		}

		.phone {
			font-size: 32upx;
			color: #42b983;
			border: 2upx solid #42b983;
			display: inline-block;
			height: 88upx;
			width: 550upx;
			margin: auto;
			margin-bottom: 30upx;
			outline: none;
			line-height: 88upx;
			border-radius: 10upx;
		}

		.reg {
			font-size: 26upx;
			border: none;
			text-decoration: underline;
			background: transparent;
		}
		.reg::after{
			border: none;
		}
		.swipe-img-wrap {
			height: 350upx;
			width: 100%;

			img {
				width: 100%;
				height: 100%;
			}
		}
	}

	.content-div {
		width: 100%;
		text-align: center;
	}

	.border-top {
		height: 2upx;
		width: 120upx;
		position: absolute;
	}

	.bor1 {
		left: 160upx;
		top: 20upx;
	}

	.bor2 {
		right: 160upx;
		top: 20upx;
	}

	.top-div {
		position: relative;
		margin-top: 100upx;
	}

	.cn {
		font-size: 34upx;
		color: rgb(102, 102, 102);
	}

	.en {
		font-size: 24upx;
		color: rgb(153, 153, 153);
	}

	.footer-div {
		width: 100%;
		text-align: center;
		position: absolute;
		bottom: 82upx;
		font-size: 24upx;
		color: rgb(153, 153, 153);
	}

	.icon-yigouxuan {
		font-size: 24upx;
		color: #42b983;
		display: inline-block;
		margin-right: 15upx;
	}

	.icon-weigouxuan {
		font-size: 24upx;
		display: inline-block;
		margin-right: 15upx;
	}
	
	.dialog{
		&-body{
			position: absolute;left: 50%;top: 50%;
			transform: translate(-50%,-50%);
			background: #FFFFFF;
			width: 500upx;height: 480upx;border-radius:20upx;
			overflow: hidden;
			&-title{
				font-size: 26upx;text-align:center;
				margin-top: 80upx;
			}
			&-image{
				width: 324upx;height: 181upx;margin:50upx auto 0upx;
				image{
					width: 100%;height: 100%;
				}
			}
			&-btn{
				$h:88upx;
				position: absolute;bottom: 0px;display: flex;height: $h;
				width: 100%;
				font-size: 28upx;
				.cancel{
					width: 50%;
					color: #999999;
					text-align: center;line-height: $h;
				}
				.confirm{
					width: 50%;
					button{
						font-size: 28upx;
						text-align: center;line-height: $h;
						background: $color-main;color: #FFFFFF;height: 100%;border-radius: 0px;
					}
					button::after{
						border: none;
					}
				}
			}
		}
	}
</style>
