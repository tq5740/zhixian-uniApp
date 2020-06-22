<template>
	<div class="mine-setting">
		<div class="cell-list">
			<cell-list-item title="账户与安全" @onTapCellListItem="onItemCellTap('safety')"></cell-list-item>

			<cell-list-item :isBorder="false" title="第三方登录" @onTapCellListItem="onItemCellTap('third')"></cell-list-item>
		</div>

		<div class="cell-list">
			<!-- <cell-list-item title="关于我们" @onTapCellListItem="onItemCellTap('about')"></cell-list-item> -->

			<!-- <cell-list-item title="常见问题" @onTapCellListItem="onItemCellTap('problem/list')"></cell-list-item> -->

			<cell-list-item :isBorder="false" title="建议反馈" @onTapCellListItem="onItemCellTap('opinion')"></cell-list-item>
		</div>

		<div class="btn-wrapper" v-if="userInfo">
			<button class="quit-btn" @tap="quitLogin">退出登录</button>
		</div>

	</div>
</template>

<script>
import cellListItem from "../../../components/cellListItem"
export default {
	components: {
		cellListItem
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo
		}
	},
	methods: {
		quitLogin() {
			uni.removeStorageSync("user_token");
			this.$store.commit("setUserInfo", null);
			uni.navigateTo({ url: "/pages/login/index" });
		},
		onItemCellTap(url) {
			if (url.includes("safety") || url.includes("third")) {
				if (!this.userInfo) {
					this.$toast("请先登录！");
					return;
				}
			}
			uni.navigateTo({ url: '/pages/mine/setting/' + url });
		}
	},
	onShow() {
		this.$updateNavbarTitle("设置");
	}
}
</script>
<style lang="scss" scoped>
	.mine-setting {
	  height: 100%;
	  background-color: #f2f2f2;
	  overflow: auto;
	  .cell-list {
	    margin-bottom: 20upx;
	    width: 100%;
	    border-radius: 10upx;
	  }
	  .out-login {
	    width: 100%;
	    height: 90upx;
	    line-height: 90upx;
	    margin-top: 20upx;
	    font-size: 34upx;
	    background-color: #ffffff;
	    color: #fc703e;
	    text-align: center;
	  }
	}
	.btn-wrapper {
	  padding: 0 30upx;
	}
	.quit-btn {
	  width: 100%;
	  height: 88upx;
	  border-radius: 10upx !important;
	  font-size: 34upx;
	  line-height: 88upx;
	  margin-top: 40upx;
	  border: none;
	  color: #fff;
	  background-color: #e94f4f;
	}
</style>
