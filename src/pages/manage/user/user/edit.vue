<template>
	<view class="user-detail">
		<info-list ref="infolist" :infolist="infolist"></info-list>

		<info-picker :text="deptText" showChoose title="企业部门" showSearch :dataList="deptDataList" required placeholder="请选择企业部门" @onPickerChoose="onPickerChoose($event,'deptId')"></info-picker>
		<info-picker :text="postText" showChoose title="企业岗位" showSearch ref="postPicker" :dataList="postDataList" placeholder="请选择组织岗位" @onPickerChoose="onPickerChoose($event,'postId')"></info-picker>
		<info-picker :text="hireDateText" title="入职时间" mode="date" @onPickerChoose="onPickerChoose($event,'hireDate')" placeholder="请选择日期"></info-picker>

		<view class="">
			<text class="btn" @tap="onSave">保存</text>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "../../../../api/modules/user.js"
import infoPicker from "../../../../components/infoPicker"

import { formatDate, list2FilterList, isChina } from "../../../../utils/utils"

function getInfoList() {
	return [
		[{
			title: "用户头像",
			el: "image",
			horizontal: true,
			canUpload: true,
			width: 120,
			placeholder: "手机拍照或上传",
			value: "",
			uploadType: 1,
			path: "/user/user/photo",
			key: "photo"
		}],
		[{
			title: "员工编号",
			el: "input",
			value: "",
			placeholder: "请填写员工编号",
			key: "employeeNumber"
		}, {
			title: "用户姓名",
			el: "input",
			required: true,
			value: undefined,
			placeholder: "请填写用户姓名",
			key: "name"
		}, {
			title: "手机号码",
			el: "input",
			required: true,
			value: undefined,
			placeholder: "请填写手机号码"
		}, {
			title: "电子邮箱",
			el: "input",
			value: "",
			placeholder: "请填写电子邮箱",
			key: "email"
		}], []
	]
}

export default {
	components: {
		infoPicker
	},
	computed: {
		noData() {
			return this.infolist.length == 0;
		},
		...mapState(['defaultImg'])
	},
	data() {
		return {
			deptId: "",
			deptText: "",
			postId: "",
			postText: "",
			hireDateText: "",
			deptDataList: [],
			postDataList: [],
			userId: undefined,
			infolist: [],
			isCreate: false
		}
	},
	onLoad({ user, create }) {
		this.$updateNavbarTitle("员工信息");
		let infolist = getInfoList();
		userApi.getDeptList().then(data => {
			list2FilterList(data, "deptName", "deptId");
			this.deptDataList = data;
		});
		if (create) {
			// 创建用户
			this.isCreate = true;
			infolist[1][2].key = "phone";
			this.onPickerChoose({
				value:this.$store.state.userInfo.org.orgId,
				text:this.$store.state.userInfo.org.orgName,
				item:{hierarchy:this.$store.state.userInfo.hierarchy}
			},"deptId");
		} else {
			user = JSON.parse(user);

			userApi.getQueryPostByHierarchy({ hierarchy: user.hierarchy }).then(data => {
				list2FilterList(data, "postName", "postId");
				this.postDataList = data;
			});

			infolist[0][0].value = user.photo || this.defaultImg.user;
			infolist[1][0].value = user.employeeNumber || "";
			infolist[1][1].value = user.name || "";
			infolist[1][2].value = user.phone || "";
			infolist[1][2].el = "text";
			infolist[1][3].value = user.email || "";
			infolist[1][3].el = user.email ? "text" : "input";
			this.deptId = user.deptId;
			this.deptText = user.deptName || "";
			this.postId = user.postId;
			this.postText = user.postName || "";
			this.hireDateText = this.$formatDate(user.hireDate, "YYYY-MM-DD");
			this.userId = user.userId;
		}
		this.infolist = infolist;
	},
	methods: {
		onPickerChoose(choose, key) {
			if (key == "deptId") {
				this.deptId = choose.value;
				this.deptText = choose.text;
				this.postId = "";
				this.postText = "";
				userApi.getQueryPostByHierarchy({ hierarchy: choose.item.hierarchy }).then(data => {
					list2FilterList(data, "postName", "postId");
					this.postDataList = data;
				});
			} else if (key == "postId") {
				this.postId = choose.value;
				this.postText = choose.text;
			} else if (key == "hireDate") {
				this.hireDateText = choose.value;
			}
		},
		onSave() {
			let data = this.$refs.infolist.getData();
			if (!data) return;
			data.deptId = this.deptId;
			data.postId = this.postId;
			data.hireDate = this.hireDateText;
			let r_ = undefined;
			uni.showLoading();
			if (this.isCreate) {
				if (!this.$mobileReg(data.phone)) {
					uni.showToast({
						icon: "none",
						title: "手机号格式错误"
					});
					return;
				}
				if (!this.deptId) {
					uni.showToast({
						icon: "none",
						title: "企业部门不能为空"
					});
					return;
				}
				if (!isChina(data.name)) {
					uni.showToast({
						icon: "none",
						title: "姓名只能输入中文字符"
					});
					return;
				}
				r_ = userApi.postCreateOrguser(data);
			}
			else {
				data.userId = this.userId;
				r_ = userApi.postUpdateOrguser(data);
			}
			if (r_) {
				r_.then(data => {
					this.$toast(`${this.isCreate ? '创建' : '修改'}成功`);
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
				})
			}
		}
	},
}
</script>

<style scoped lang="scss">
	$line-height: 88upx;
	.user-detail {
	  background-color: $color-f2;
	  height: 100%;
	}
	.btn {
	  display: block;
	  margin: 40upx auto;
	  width: 690upx;
	  height: $line-height;
	  text-align: center;
	  line-height: $line-height;
	  background: $color-main;
	  border-radius: 10upx;
	  font-size: $font-size-32;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: $color-white;
	}
</style>
