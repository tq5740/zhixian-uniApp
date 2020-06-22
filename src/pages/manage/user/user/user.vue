<template>
	<view class="user-list page-full create-btn-padding-bottom">
		<search-filter :showResetBtn="true" :filterList="filterList" searchPlaceholder="请输入姓名或手机号搜索" @onFilterMenuClick="onFilterMenuClick" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		<view class="list-conten" :class="{'create-btn-padding-bottom':canCreate}">
			<template v-for="(u,i) of dataList">
				<list-item :item="u" :btnList='getBtnList()' @onItemClick="onItemClick" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-org-user :name="u.name" :logo="u.photo||defaultImg.user" :logoCircle="true" :intro="u.deptName" :tips="u | getTips" :tipsColor="u.state==2?'#FC703E':'#999999'" :state="u | getState" :stateBgColor="u | getStateColor">
						</list-item-org-user>
					</template>
				</list-item>
			</template>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建用户</text>   
		</view>
		<examine-modal ref="examinemodal" :title="'审核员工“'+user.name+'”'" @onExamine="onExamine"></examine-modal>
		<view class="picker">
			<data-picker  ref="pickerDept" :dataList="deptListToMove" @onPickerChoose="onPickerChoose($event,1)" buttonTop showResetBtn showChoose showSearch searchPlaceholder="请输入部门名称搜索"></data-picker>
		</view>
		<view class="picker">
			<data-picker  ref="pickerPost" :dataList="postListToMove" @onPickerChoose="onPickerChoose($event,2)" buttonTop showResetBtn showChoose showSearch searchPlaceholder="请输入岗位名称搜索"></data-picker>
		</view>
		<msg-modal ref="msgmodal" @onConfirm="onModalConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "@/api/modules/user.js"
import { formatDate, list2FilterList } from "@/utils/utils"
import examineModal from "@/components/examineModal.vue"
import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import dataPicker from "@/components/dataPicker.vue"

let navTitle = "员工";
let getListFn = userApi.getOrguserList.bind(userApi);

export default {
	components: {
		examineModal, listItemOrgUser,dataPicker
	},
	computed: {
		...mapState(['defaultImg'])
	},
	data() {
		
		return {
			canCreate: false,
			user: {},
			dataList: [],
			pageNum: 1,
			pageTotal: 2,
			query: "",
			deptId: "",
			postId: "",
			filterList: [{ name: "所在部门", type: "deptId", showChoose: true,showResetBtn:true,children:[] }, { name: "所在岗位", type: "postId", showChoose: true,showResetBtn:true }],
			deptListToMove:[],
			postListToMove:[]
		}
	},
	onLoad() {
		this.getList();
		this.deptList=[];
		this.postList=[];
		let dep = userApi.getDeptList();
		let post = userApi.getQueryPostTree();
		// 为了小程序点击重置能够正常渲染视图，filterList要同时赋值
		let filterList = [{ name: "所在部门", type: "deptId", showChoose: true,showResetBtn:true }, { name: "所在岗位", type: "postId", showChoose: true,showResetBtn:true }];
		Promise.all([dep, post]).then(([depList, postlist]) => {
			list2FilterList(depList, "deptName", "deptId");
			this.deptList=JSON.parse(JSON.stringify(depList));
			depList.unshift({ name: "全部", value: null, choose: true });
			filterList[0].children=depList;
			list2FilterList(postlist, "postName", "postId");
			this.postList=JSON.parse(JSON.stringify(postlist));
			postlist.unshift({ name: "全部", value: null, choose: true });
			filterList[1].children=postlist;
			this.filterList=filterList;
		});
	},
	onShow(refresh) {
		if (refresh)
			this.getList(true, false);
		else
			this.$updateNavbarTitle(navTitle);
	},
	onReachBottom() {
		this.getList();
	},
	filters: {
		getTips: function (u) {
			if (u.state == 2) {
				return u.reason;
			} else {
				return `入职时间：${formatDate(u.hireDate, "YYYY-MM-DD")}  岗位：${u.postName||"-"}`;
			}
		},
		getState: function (u) {
			switch (u.state) {
				case 2:
					return "未通过";
				case 3:
					return "待审核";
				case 4:
					return "已通过";
			}
		},
		getStateColor: function (u) {
			switch (u.state) {
				case 2:
					return "#FC703E";
				case 3:
					return "#FFAE00";
				case 4:
					return "#42B983";
			}
		}
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false, rename = true) {
			if (!this.power) {
				this.power = await this._getPower();
				this.canCreate = this.power.isCreate;
			} else {
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["query", "deptId", "postId"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `员工(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList() {
			if (!this.power) return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				btnList.push({ text: "编辑", icon: "iconbianji" });
			}
			// if (power.isMove) {
			// 	btnList.push({ text: "移动部门", icon: "iconyidongbumen" });
			// 	btnList.push({ text: "移动岗位", icon: "iconyidongbumen",iconColor:"#3BC7CE" });
			// }
			if (power.isReset) {
				btnList.push({ text: "重置密码", icon: "iconzhongzhimima" });
			}
			if (power.isAudit) {
				btnList.push({ text: "审核员工", icon: "iconshenhe" });
			}
			if (power.isDelete) {
				btnList.push({ text: "删除员工", icon: "iconshanchu" });
			}
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: "/pages/manage/user/user/detail?user=" + JSON.stringify(item)
			})
		},
		onBtnClick({ btn, item }) {
			this.user = item;
			if (btn.text == "重置密码")
				this.$refs.msgmodal.show(`<span>确定要将此用户的密码重置为：</span><span style="color: #000">cdjy9957</span><span>吗？</span>`, "resetpwd");
			if (btn.text == "审核员工") {
				this.$refs.examinemodal.show();
				this.$refs.examinemodal.clear();
			}
			if (btn.text == "删除员工") {
				this.$refs.msgmodal.show(`<span>是否删除员工“</span><span style="color: #000">${item.name}</span><span>”</span>`, "delete");
			}
			if (btn.text == "编辑") {
				uni.navigateTo({
					url: `/pages/manage/user/user/edit?user=${JSON.stringify(item)}`
				})
			}
			if (btn.text == "移动部门") {
				this.deptListToMove=[];
				this.$nextTick(()=>{
					let list=JSON.parse(JSON.stringify(this.deptList));
					this.deleteSelf(list,item.deptId,"deptId");
					this.deptListToMove=list;
				});
				this.$refs.pickerDept.show();
			}
			if (btn.text == "移动岗位") {
				this.postListToMove=[];
				this.$nextTick(()=>{
					let list=JSON.parse(JSON.stringify(this.postList));
					if(!this.$isEmpty(item.postId))
						this.deleteSelf(list,item.postId,"postId");
					this.postListToMove=list;
				});
				this.$refs.pickerPost.show();
			}
		},
		onPickerChoose(choose,type){
			// type:1-部门,2-岗位
			let rqData={
				userIds:JSON.stringify([this.user.userId])
			}
			uni.showLoading();
			let r_=undefined;
			if(type==1){
				rqData.deptId=choose.value;
				r_=userApi.postUpdateBatchDept(rqData);
			}else{
				rqData.postId=choose.value
				r_=userApi.postUpdateBatchPost(rqData);
			}
			r_.then(data=>{
				uni.hideLoading();
				this.$toast("移动成功");
				this.getList(true);
			}).catch(err=>{
				uni.hideLoading();
			});
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: `/pages/manage/user/user/edit?create=true`
			})
		},
		/**消息框确定事件
		 * @param {Object} flag
		 */
		onModalConfirm(flag) {
			if (flag == "resetpwd") {
				// 重置密码
				userApi.postResetPwd(this.user.userId).then(data => {
					uni.showToast({
						title: "重置成功",
						icon: "none"
					});
				}).catch(err => {
					uni.hideLoading();
				});
			} else if (flag == "delete") {
				userApi.postDeleteOrgUser(this.user.userId).then(data => {
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
				});
			}
		},
		/**
		 * 审核
		 */
		onExamine(result) {
			let state = result.pass ? 4 : 2;
			userApi.postAuditOrgUser({ userId: this.user.userId, state: state, reason: result.reason }).then(data => {
				this.user.state = state;
				this.user.reason = result.reason;
				uni.showToast({
					icon: "none",
					title: "审核成功"
				});
			}).catch(err => {
				uni.hideLoading();
			});
		},
		onFilterMenuClick(obj) {
			if (this[obj.type] != obj.value) {
				this[obj.type] = obj.value;
				this.getList(true);
			}
		},
		/**搜索
		 * @param {Object} value 搜索关键字
		 */
		onSearch(value) {
			if (this.query != value) {
				this.query = value;
				this.getList(true);
			}
		},
		deleteSelf(list,condition,key){
			for (var i = 0; i < list.length; i++) {
				let v=list[i];
				if(v[key]==condition){
					list.splice(i,1);
					return true;
				}else{
					if (v.children&&v.children.length>0)
						if(this.deleteSelf(v.children,condition,key)){
							return true;
						}
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.user-list {
	  background: #f2f2f2;
	  min-height: calc(100% - #{$create-btn-height});
	}
</style>
