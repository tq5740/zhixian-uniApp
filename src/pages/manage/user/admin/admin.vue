<template>
	<view class="admin-list page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter :showResetBtn="true" :filterList="filterList" searchPlaceholder="请输入姓名或手机号搜索" @onFilterMenuClick="onFilterMenuClick"
			@onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		 <view class="list-conten">
		 	<template v-for="(d,i) of dataList">
		 		<list-item :item="d" :btnList='getBtnList()'
					@onItemClick="onItemClick" @onBtnClick="onBtnClick"  :key="i">
					 <template v-slot:content>
						 <list-item-org-user :name="d.name" :tag="d.roleName" :logo="d.photo||defaultImg" :logoCircle="true" :intro="d.permissionDept">
						</list-item-org-user>
					  </template>
				 </list-item>
		 	</template>
		 </view>
		 <view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
		 	<text class="iconfont iconchuangjian"></text>
		 	<text>创建管理员</text>
		 </view>
		 <msg-modal ref="msgmodal" @onConfirm="onModalConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>
<script>
	import userApi from "@/api/modules/user.js"
	import {list2FilterList} from "@/utils/utils.js"
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	
	let navTitle=`员工`;
	let getListFn=userApi.getUserAdminstratorList.bind(userApi);
	export default {
		components: {
			listItemOrgUser
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user; 
			}
		},
		data() {
			return {
				canCreate:false,
				filterList: [{ name: "权限范围", type: "permissionDeptId",showChoose:true,showResetBtn:true}, { name: "角色名称", type: "roleName" }],
				pageNum: 1,
				pageTotal:2,
				permissionDeptId:undefined,
				roleName:undefined,
				query:undefined,
				dataList:[]
			}
		},
		onLoad() {
			this.getList();
			userApi.getQueryUserPermissionDept().then(data=>{
				list2FilterList(data,"deptName","deptId");
				data.unshift({name:"全部",value:null,choose:true});
				 this.$set(this.filterList[0],"children",data);
			});
			userApi.getRoleList({pageNum:1,pageSize:99}).then(data=>{
				list2FilterList(data.result,"roleName","roleName");
				data.result.unshift({name:"全部",value:null,choose:true});
				this.$set(this.filterList[1],"children",data.result);
			});
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true,false);
			else
				this.$updateNavbarTitle(navTitle);
		},
		onReachBottom() {
			this.getList();
		},
		methods:{
			/**
			 * 请求列表
			 */
			async getList(restart = false,rename=true) {
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				}else{
					this.canCreate = this.power.isCreate;
				}
				this._getListFromServer(getListFn,restart,["query","roleName","permissionDeptId"]).then(total=>{
					if(typeof total == "number"&&rename){
						navTitle=`员工(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isUpdate){
					btnList.push({text:'编辑',icon:'iconbianji'});
				}
				if(power.isDelete){
					btnList.push({text:"删除",icon:"iconshanchu"});
				}
				return btnList;
			},
			onItemClick(item) {
				uni.navigateTo({
					url: `/pages/manage/user/admin/detail?user=${JSON.stringify(item)}`
				})
			},
			onBtnClick({ btn, item }) {
				if (btn.text == "删除") {
					this.$refs.msgmodal.show(`<span>是否删除管理员“</span><span style="color: #000">${item.name||item.roleName}</span><span>”</span>`,item.userId);
				}
				if (btn.text == "编辑") {
					uni.navigateTo({
						url: `/pages/manage/user/admin/edit?user=${JSON.stringify(item)}`
					})
				}
			},
			/**消息框确定事件
			 * @param {Object} flag
			 */
			onModalConfirm(flag) {
				uni.showLoading();
				userApi.postDeleteUserAdminstrator(flag).then(data => {
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
			},
			onCreateBtnClick() {
				uni.navigateTo({
					url: `/pages/manage/user/admin/edit?create=true`
				})
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
		}
	}
</script>

<style lang="scss" scoped>
.admin-list {
 min-height: calc(100% - #{$create-btn-height});
	}
</style>
