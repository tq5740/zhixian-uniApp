<template>
	<view class="adduser">
		<search-filter :value="searchText" :searchPlaceholder="placeholder" @onSearch="onSearch"></search-filter>
		<view class="user-tab">
			<text v-for="(u,i) of userTabList" @tap="onUserTabClick(u)" class="user-tab-item" :class="{'user-tab-choose':u.choose}" :key="i">
				{{u.name}}
			</text>
		</view>
		<scroll-view scroll-y class="data-content" @scrolltolower="getList">
			<view v-show="showTab=='bm'">
				<tree ref="bmTree" root :edit="false" :dataList="deptList" @onTreeChoose="onChooseTree"></tree>
				<no-data :isNoData="noDeptData"></no-data>
			</view>
			<view v-show="showTab=='gw'">
				<tree ref="gwTree" root :edit="false" :dataList="postList" @onTreeChoose="onChooseTree"></tree>
				<no-data :isNoData="noPostData"></no-data>
			</view>
			<view v-show="showTab=='nb'">
				<view v-for="(v,i) of orgUserList" class="user van-hairline--bottom" :key="i">
					<view class="left">
						<text class="name">{{v.name}}-{{v.phone}}</text>
						<text class="info">
							<text class="employeeNumber">工号：{{v.employeeNumber}}</text>
							<text>入职时间：{{$formatDate(v.createTime,"YYYY-MM-DD hh:mm:ss")}}</text>
						</text>
					</view>
					<view class="right">
						<text @tap="onItemChoose(v)" class="select iconfont" :class="{iconxuanzhong:v.choose,iconweixuanzhong:!v.choose}"></text>
					</view>
				</view>
				<no-data :isNoData="noOrgUserData"></no-data>
			</view>
			<view v-show="showTab=='zc'">
				<view v-for="(v,i) of regUserList" class="user van-hairline--bottom" :key="i">
					<view class="left">
						<text class="name">{{v.name}}-{{v.phone}}</text>
						<text class="info">
							<text>注册时间：{{$formatDate(v.regTime,"YYYY-MM-DD hh:mm:ss")}}</text>
						</text>
					</view>
					<view class="right">
						<text @tap="onItemChoose(v)" class="select iconfont" :class="{iconxuanzhong:v.choose,iconweixuanzhong:!v.choose}"></text>
					</view>
				</view>
				<no-data :isNoData="noRegUserData"></no-data>
			</view>
		</scroll-view>
		<view class="bottom-btn van-hairline--top">
			<text class="reset" @tap="onReset">重置</text>
			<text class="confirm" @tap="onConfirm">确定</text>
		</view>
	</view>
</template>

<script>
import userApi from "@/api/modules/user.js"
import trainApi from "@/api/modules/train.js"
import { list2FilterList } from "@/utils/utils.js"

let orgUserPage = {
	pageNum: 1,
	pageTotal: 2
}
let regUserPage = {
	pageNum: 1,
	pageTotal: 2
}

export default {
	data() {
		return {
			courseId: undefined,
			deptList: [],
			postList: [],
			orgUserList: [],
			regUserList: [],
			userTabList: [
				{ name: "内部员工", placeholder: "请输入姓名或手机号搜索", key: "nb", choose: true },
				{ name: "部门", placeholder: "请输入部门名称搜索", key: "bm", choose: false },
				{ name: "岗位", placeholder: "请输入岗位名称搜索", key: "gw", choose: false },
				{ name: "注册用户", placeholder: "请输入姓名或手机号搜索", key: "zc", choose: false }],
			placeholder: "请输入姓名或手机号搜索",
			searchText: undefined,
			showTab: "nb",
			orgUserQuery: undefined,
			regUserQuery: undefined,
			isInterfaceDept: false,
			isInterfacePost: false,
			isInterfaceOrgUser: false,
			isInterfaceRegUser: false,
		};
	},
	computed: {
		noDeptData() {
			return this.deptList.length == 0 && this.isInterfaceDept;
		},
		noPostData() {
			return this.postList.length == 0 && this.isInterfacePost;
		},
		noOrgUserData() {
			return this.orgUserList.length == 0 && this.isInterfaceOrgUser;
		},
		noRegUserData() {
			return this.regUserList.length == 0 && this.isInterfaceRegUser;
		}
	},
	onLoad({ courseId }) {
		this.$updateNavbarTitle("添加用户");
		this.courseId = courseId;
		this.getOrgUserList();
		uni.showLoading();
		userApi.getDeptList().then(data => {
			this.isInterfaceDept = true;
			list2FilterList(data, "deptName", "deptId");
			this.deptList = data;
			uni.hideLoading();
		}).catch(err => {
			uni.hideLoading();
			uni.showToast({
				title: typeof err == "string" ? err : JSON.stringify(err),
				icon: "none"
			})
		});
		userApi.getQueryPostTree().then(data => {
			this.isInterfacePost = true;
			list2FilterList(data, "postName", "postId");
			this.postList = data;
		}).catch(err => {
			uni.showToast({
				title: typeof err == "string" ? err : JSON.stringify(err),
				icon: "none"
			})
		});
	},
	methods: {
		onUserTabClick(tab) {
			if (tab.choose) return;
			this.userTabList.forEach(v => {
				v.choose = false;
			})
			tab.choose = true;
			this.showTab = tab.key;
			this.placeholder = tab.placeholder;
			if (tab.key == "nb") {
				if (this.orgUserList.length == 0)
					this.getOrgUserList();
			}
			if (tab.key == "zc") {
				if (this.regUserList.length == 0)
					this.getRegUserList();
			}
		},
		onItemChoose(item) {
			this.$set(item, "choose", !item.choose);
		},
		onChooseTree(item) { },
		getList() {
			if (this.showTab == "nb") {
				this.getOrgUserList();
			}
			if (this.showTab == "zc") {
				this.getRegUserList();
			}
		},
		onSearch(value) {
			if (this.showTab == "bm") {
				this.$refs.bmTree.search(value);
			} else if (this.showTab == "gw") {
				this.$refs.gwTree.search(value);
			} else if (this.showTab == "nb") {
				if (this.orgUserQuery != value) {
					this.orgUserQuery = value;
					this.getOrgUserList(true);
				}
			} else if (this.showTab == "zc") {
				if (this.regUserQuery != value) {
					this.regUserQuery = value;
					this.getRegUserList(true);
				}
			}
		},
		getOrgUserList(restart = false) {
			if (restart) {
				orgUserPage.pageNum = 1;
				orgUserPage.pageTotal = 2;
			}
			if (orgUserPage.pageNum > orgUserPage.pageTotal) {
				uni.showToast({
					icon: "none",
					title: "已全部加载"
				});
				return;
			}
			uni.showLoading({
				title: "加载中"
			});
			let rqData = {
				pageNum: orgUserPage.pageNum,
				pageSize: 10
			}
			if (this.orgUserQuery)
				rqData.query = this.orgUserQuery;
			userApi.getOrguserList(rqData).then(data => {
				this.isInterfaceOrgUser = true;
				if (restart) {//搜索条件变更
					this.orgUserList = data.result;
				} else {
					this.orgUserList.splice(this.orgUserList.length, 0, ...data.result);
				}
				++orgUserPage.pageNum;
				if (orgUserPage.pageTotal != data.pages || orgUserPage.pageTotal == 2) {
					orgUserPage.pageTotal = data.pages;
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},
		getRegUserList(restart = false) {
			if (restart) {
				regUserPage.pageNum = 1;
				regUserPage.pageTotal = 2;
			}
			if (regUserPage.pageNum > regUserPage.pageTotal) {
				uni.showToast({
					icon: "none",
					title: "已全部加载"
				});
				return;
			}
			uni.showLoading({
				title: "加载中"
			});
			let rqData = {
				pageNum: regUserPage.pageNum,
				pageSize: 10
			}
			if (this.regUserQuery)
				rqData.query = this.regUserQuery;
			userApi.getRecentlyRegList(rqData).then(data => {
				this.isInterfaceRegUser = true;
				if (restart) {//搜索条件变更
					this.regUserList = data.result;
				} else {
					this.regUserList.splice(this.regUserList.length, 0, ...data.result);
				}
				++regUserPage.pageNum;
				if (regUserPage.pageTotal != data.pages || regUserPage.pageTotal == 2) {
					regUserPage.pageTotal = data.pages;
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},
		onReset() {
			if (this.showTab == "bm") {
				this.$refs.bmTree.resetChoose();
			} else if (this.showTab == "gw") {
				this.$refs.gwTree.resetChoose();
			} else if (this.showTab == "nb") {
				this.orgUserList.forEach(v => {
					this.$set(v, "choose", false);
				})
			} else if (this.showTab == "zc") {
				this.regUserList.forEach(v => {
					this.$set(v, "choose", false);
				})
			}
		},
		onConfirm() {
			// 只报当前显示的tab
			let rqData = {
				courseId: this.courseId,
				regMode: 1
			}
			let ids = "";
			if (this.showTab == "bm") {
				this.$refs.bmTree.getAllChoose().forEach(v => {
					ids = ids + v.value + ",";
				});
				if (this.$isEmpty(ids)) {
					uni.showToast({
						title: "请选择部门", icon: "none"
					});
					return;
				}
				ids = ids.substring(0, ids.length - 1);
				rqData.orgDepIds = ids;
			} else if (this.showTab == "gw") {
				this.$refs.gwTree.getAllChoose().forEach(v => {
					ids = ids + v.value + ",";
				});
				if (this.$isEmpty(ids)) {
					uni.showToast({
						title: "请选择岗位", icon: "none"
					}); return;
				}
				ids = ids.substring(0, ids.length - 1);
				rqData.orgPortIds = ids;
			} else if (this.showTab == "nb") {
				this.orgUserList.forEach(v => {
					if (v.choose)
						ids = ids + v.userId + ",";
				});
				if (this.$isEmpty(ids)) {
					uni.showToast({
						title: "请选择用户", icon: "none"
					}); return;
				}
				ids = ids.substring(0, ids.length - 1);
				rqData.userIds = ids;
			} else if (this.showTab == "zc") {
				this.regUserList.forEach(v => {
					if (v.choose)
						ids = ids + v.userId + ",";
				});
				if (this.$isEmpty(ids)) {
					uni.showToast({
						title: "请选择用户", icon: "none"
					}); return;
				}
				ids = ids.substring(0, ids.length - 1);
				rqData.userIds = ids;
			}
			uni.showLoading({
				title: "请稍等"
			});
			trainApi.postCreateCourseRecordAdmin(rqData).then(data => {
				this.$toast("添加成功");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},

	},
}
</script>

<style lang="scss" scoped>
	.adduser {
	  height: 100%;background: #fff;
	}
	.user-tab {
	  display: flex;
	  justify-content: space-between;
	  padding: 30upx 42upx 50upx;
	  &-item {
	    $h: 70upx;
	    display: inline-block;
	    width: 144upx;
	    height: $h;
	    line-height: $h;
	    text-align: center;
	    font-size: $font-size-26;
	    background: #eeeeee;
	    color: $color-666;
	    border-radius: 35upx;
	  }
	  &-choose {
	    background: $color-main;
	    color: #ffffff;
	  }
	}
	.data-content {
	  height: calc(100% - 90upx - 150upx - 98upx);
	  padding-bottom: 20upx;
	  box-sizing: border-box;
	}
	.user {
	  position: relative;
	  margin: 0px 30upx;
	  padding: 30upx 0px 27upx;
	  box-sizing: border-box;
	  height: 144upx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  .select {
	    font-size: $font-size-40;
	  }
	  .left {
	    width: 600upx;
	    height: 100%;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	  }
	  .name {
	    font-size: $font-size-30;
	    font-weight: bold;
	  }
	  .info {
	    font-size: $font-size-24;
	    color: $color-999;
	  }
	  .employeeNumber {
	    margin-right: 29upx;
	  }
	}
	.bottom-btn {
	  $h: 98upx;
	  position: fixed;
	  bottom: 0;
	  width: 100%;
	  height: $h;
	  text {
	    display: inline-block;
	    width: 50%;
	    text-align: center;
	    height: $h;
	    line-height: $h;
	  }
	  .confirm {
	    background: $color-main;
	    color: #ffffff;
	  }
	  .reset {
	    color: $color-main;
	  }
	}
</style>
