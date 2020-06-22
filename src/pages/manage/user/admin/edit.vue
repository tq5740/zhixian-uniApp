<template>
	<view class="admin-edit">
		<info-input v-if="create" title="用户姓名" v-model="admin.text" :search="true" :searchList="adminList" @onChoose="onInputChoose" @onInput="onInput" placeholder="请输入姓名或手机号选择用户" :required="true"></info-input>
		<info-text v-else title="用户姓名" :value="admin.text"></info-text>
		<info-picker title="权限范围" showChoose showSearch :text="per.text" :value="per.value" @onPickerChoose="onPickerChoose($event,'per')" placeholder="请选择" :required="create" :dataList="perList"></info-picker>
		<info-picker title="角色名称" :text="role.text" :value="role.value" @onPickerChoose="onPickerChoose($event,'role')" placeholder="请选择" :required="create" :dataList="roleList" mode="selector"></info-picker>
		<view class="btn" @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
import infoInput from "@/components/infoInput.vue"
import infoText from "@/components/infoText.vue"
import infoPicker from "@/components/infoPicker.vue"
import userApi from "@/api/modules/user.js"
import {
	list2FilterList
} from "@/utils/utils.js"
export default {
	components: {
		infoInput,
		infoPicker,
		infoText
	},
	data() {
		return {
			create: false,
			perList: [],
			roleList: [],
			admin: {
				text: "",
				userId: ""
			},
			adminList: [],
			per: {
				text: "",
				value: ""
			},
			role: {
				text: "",
				value: ""
			}
		}
	},
	onLoad({
		create,
		user
	}) {
		userApi.getQueryUserPermissionDept().then(data => {
			list2FilterList(data, "deptName", "deptId");
			this.perList.splice(-1, 0, ...data);
		});
		userApi.getRoleList({
			pageNum: 1,
			pageSize: 99
		}).then(data => {
			list2FilterList(data.result, "roleName", "roleId");
			this.roleList.splice(-1, 0, ...data.result);
		});
		if (create) {
			this.create = true;
			this.$updateNavbarTitle("创建管理员");
				this.per.text=this.$store.state.userInfo.org.orgId;
				this.per.value=this.$store.state.userInfo.org.orgName;
		} else {
			let u = JSON.parse(user);
			this.$updateNavbarTitle(`管理员${u.name || ''}`);
			this.admin.text = u.name;
			this.admin.userId = u.userId;
			this.per.text = u.permissionDept;
			this.per.value = u.permissionDeptId;
			this.role.text = u.roleName;
			this.role.value = u.roleId;
		}

	},
	methods: {
		onInput(value) {
			if (!value) return;
			userApi.getQueryUserVague(value).then(data => {
				data.forEach(v => {
					v.name = `${v.name} - ${v.phone}`
				});
				this.adminList = data;
			})
		},
		onInputChoose(u) {
			this.admin.userId = u.userId;
			this.admin.text = u.name;
		},
		onPickerChoose(choose, flag) {
			if (flag == "per") {
				this.per.text = choose.text;
				this.per.value = choose.value;
			} else {
				this.role.text = choose.text;
				this.role.value = choose.value;
			}
		},
		onConfirm() {
			let rqData = {
				permissionDeptId: this.per.value,
				roleId: this.role.value,
				userId: this.admin.userId
			};
			uni.showLoading();
			let r_ = undefined;
			if (this.create) {
				r_ = userApi.postCreateUserAdminstrator(rqData);
			} else {
				r_ = userApi.postUpdateUserAdminstrator(rqData);
			}
			if (r_) {
				r_.then(data => {
					this.$toast(`${this.create ? '创建' : '修改'}成功`);
					setTimeout(() => {
						this._refreshPrePage();
						uni.navigateBack({ delta: 1 });
					}, 2000);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: "none"
					})
				})
			}
		}
	}
}
</script>

<style scoped>
	.admin-edit {
	  min-height: 100%;
	  background: #f2f2f2;
	}

	.info {
	  width: 100%;
	  background-color: #ffffff;
	}

	.btn {
	  width: 690upx;
	  height: 88upx;
	  line-height: 88upx;
	  text-align: center;
	  margin: 40upx auto;
	  background: #42b983;
	  border-radius: 10upx;
	  font-size: 32upx;
	  color: #ffffff;
	}
</style>
