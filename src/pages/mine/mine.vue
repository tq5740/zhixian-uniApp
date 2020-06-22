<template>
	<div class="mine-index">
		<div class="header-wrapper" @tap="onItemCellTap('/pages/mine/edituser')">
			<div class="user-avatar-box">
				<img class="user-avatar" :src="configData.imgDomain + userInfo.photo+'/100x100'" v-if="userInfo.photo" alt="">
				<img class="user-avatar" src="/static/img/user/photo.png" alt="" v-else>
			</div>

			<div class="user-profile">
				<div class="user-subject">
					<span class="user-nickname">{{userInfo.name ? userInfo.name : ""}}</span>
					<span class="iconfont user-sex-icon iconnv-" v-if="userInfo && (userInfo.sex == 2)"></span>
					<span class="iconfont user-sex-icon iconnan-" v-if="userInfo && (userInfo.sex == 1)"></span>

					<img :src="isAuth ? '/static/img/user/YRZ.png' : '/static/img/user/WRZ.png'" class="idauth-img" alt="">

				</div>
				<div class="user-telephone">手机号码：{{userPhone}}</div>
			</div>
			<span class="iconfont icon-gengduo"></span>
		</div>

		<div class="cell-list">
			<!-- <cell-list-item icon="iconxiaoxi_xuanzhong" color="#FFAE00" title="我的消息" :value="''" @onTapCellListItem="onItemCellTap('/pages/mine/news/list')"></cell-list-item> -->
			<cell-list-item icon="iconshenfenrenzheng1" title="身份认证" @onTapCellListItem="onItemCellTap('/pages/mine/selectidauth')"></cell-list-item>
			<cell-list-item icon="iconqiye" :isBorder="false" title="我的企业" @onTapCellListItem="onGoToOrgDetail"></cell-list-item>

		</div>

		<div class="cell-list">
			<cell-list-item icon="icontoudijilu1" :isBorder="false" title="投递记录" @onTapCellListItem="onItemCellTap('/pages/manage/recruit/booking/booking')"></cell-list-item>
		</div>

		<div class="cell-list">
			<cell-list-item icon="iconqiehuanjiaose" title="切换角色" @onTapCellListItem="onGoToUser" :value="'切换到用户端'"></cell-list-item>
			<cell-list-item icon="iconchangjianwenti" title="常见问题" @onTapCellListItem="onItemCellTap('/pages/mine/setting/problem/list')"></cell-list-item>
			<cell-list-item icon="iconkefurexian1" @onTapCellListItem="onCustomServiceCellTap" title="客服热线" :value="configData.serviceTel"></cell-list-item>

			<cell-list-item icon="iconshezhi" :isBorder="false" @onTapCellListItem="onItemCellTap('/pages/mine/setting/index')" title="设置"></cell-list-item>
		</div>
		<bottom-btn-list ref="moreBtn" @onBtnClick="onBtnClick" @onHide="onBtnHide" :btnList="linkList"></bottom-btn-list>
	</div>
</template>

<script>
import cellListItem from "../../components/cellListItem"
import bottomBtnList from "@/components/bottomBtnList.vue"
import User from "../../api/modules/user"

export default {
	components: {
		cellListItem, bottomBtnList
	},
	data() {
		return {
			userPhone: "",
			isAuth: false,
			linkList: [{ text: "切换到微就业", center: true }, { text: "切换到网络学院", center: true }]
		}
	},
	computed: {
		configData() {
			return this.$store.state.configData ? this.$store.state.configData : {};
		},
		userInfo() {
			return this.$store.state.userInfo ? this.$store.state.userInfo : {};
		}
	},
	onLoad() {
		this.userPhone = this.userInfo.phone.substr(0, 3) + "****" + this.userInfo.phone.substr(7, 4);
	},
	onShow() {
		uni.showTabBar({
			animation: false
		});
		if (uni.getStorageSync("setAuthState") || uni.getStorageSync("setAuthState") == "") {
			if (this.$store.state.userInfo) {
				const data = {
					userId: this.$store.state.userInfo.userId,
					token: this.$store.state.userInfo.token
				};
				User.queryUserinfoProgress(data).then(res => {
					this.isAuth = res.authState == 4 ? true : false;
					uni.setStorage({ key: "setAuthState", data: this.isAuth });
				});
			}
		}
		this.$updateNavbarTitle("我的");
	},
	methods: {
		onGoToUser() {
			// #ifdef H5
			location.replace("https://m.weijiuye.com.cn?token=" + this.$store.state.userInfo.token);
			// #endif
			
			// #ifdef MP-WEIXIN
			wx.navigateToMiniProgram({ appId: "wx0ff213c824cfca1f", path: "pages/index?token=" + this.$store.state.userInfo.token })
			// #endif
			// // 显示切换选项
			// uni.hideTabBar({
			// 	animation: false
			// })
			// this.$refs.moreBtn.show();
		},
		onBtnHide() {
			uni.showTabBar({
				animation: false
			});
		},
		onBtnClick(obj) {
			if (obj.text == "切换到微就业") {
				// // #ifdef H5
				location.replace("https://m.weijiuye.com.cn?token=" + this.$store.state.userInfo.token);
				// // #endif

				// // #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({ appId: "wx0ff213c824cfca1f", path: "pages/index?token=" + this.$store.state.userInfo.token })
				// // #endif
			} else if (obj.text == "切换到网络学院") {
				// // #ifdef H5
				location.replace("https://m.cdwork.cn?token=" + this.$store.state.userInfo.token);
				// // #endif

				// // #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({ appId: "wxb9cb944546d65f34", path: "pages/index?token=" + this.$store.state.userInfo.token })
				// // #endif
			}
			uni.showTabBar({ animation: false });
		},
		onGoToOrgDetail() {
			let dataJson = JSON.stringify({ orgVideo: this.userInfo.org.orgVideo, orgId: this.userInfo.org.orgId, orgImg: this.userInfo.org.orgImg })
			uni.navigateTo({ url: "/pages/detail/orgDetail?dataJson=" + dataJson + "&tabStatus=0" });
		},
		onCustomServiceCellTap() {
			uni.makePhoneCall({
				phoneNumber: this.configData.serviceTel
			});
		},
		onItemCellTap(e) {
			uni.navigateTo({ url: e });
		}
	}
}
</script>
<style lang="scss" scoped>
	.mine-index {
	  height: 100%;
	  background-color: #f2f2f2;
	  overflow: auto;
	  .cell-list {
	    width: 100%;
	    margin-top: 20upx;
	  }
	}

	.user-avatar-box {
	  width: 120upx;
	  height: 120upx;
	  border: 50%;
	  img {
	    width: 100%;
	    height: 100%;
	    border-radius: 50%;
	    margin: 20upx;
	  }
	  float: left;
	}
	.header-wrapper {
	  height: 160upx;
	  width: 100%;
	  background-color: #fff;
	}
	.user-profile {
	  font-size: 34upx;
	  float: left;
	  margin-top: 36upx;
	  margin-left: 40upx;
	}
	.user-telephone {
	  margin-top: 12upx;
	  font-size: 28upx;
	  color: #999999;
	}
	.user-sex-icon {
	  margin-left: 10upx;
	  font-size: 26upx;
	  flex-shrink: 0;
	}
	.icon-nv- {
	  color: rgb(255, 117, 169);
	}
	.icon-nan- {
	  color: rgb(18, 150, 219);
	}
	.icon-gengduo {
	  font-size: 26upx;
	  color: #808080;
	  float: right;
	  margin: 66upx 25upx;
	  flex-shrink: 0;
	}
	.icon-renzheng {
	  font-size: 50upx;
	  color: #42b983;
	}
	.idauth-img {
	  width: 147upx;
	  height: 38upx;
	  margin-left: 16upx;
	  vertical-align: bottom;
	}
</style>
