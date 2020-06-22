<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<view class="picker">
			<data-picker  ref="picker" :dataList="categoryListToMove" @onPickerChoose="onPickerChoose" buttonTop showResetBtn showChoose showSearch></data-picker>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建部门</text>
		</view>
		<search-filter searchPlaceholder="请输入部门搜索" @onSearch="onSearch"></search-filter>
		<view class="list">
			<tree ref="tree" root edit :dataList="categoryList" @onTreeChoose="onChooseTree"></tree>
		</view>
		<bottom-btn-list ref="btn" @onBtnClick="onBtnClick" :btnList="getBtnList()"></bottom-btn-list>
		<bottom-btn-list ref="btn2" @onBtnClick="onBtnClick" :btnList="getBtnList2()"></bottom-btn-list>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import searchFilter from "@/components/searchFilter.vue"
	import bottomBtnList from "@/components/bottomBtnList.vue"
	import dataPicker from "@/components/dataPicker.vue"
	import {list2FilterList} from "@/utils/utils.js"
	import userApi from "@/api/modules/user.js"
	export default {
		components: {
			searchFilter,bottomBtnList,dataPicker
		},
		computed:{
			noData(){
				return this.categoryList.length == 0 && this.isInterface;
			}
		},
		data() {
			return {
				canCreate:false,
				orgList:[],
				orgId:undefined,
				categoryList:[],
				deptName:"",
				chooseItem:undefined,
				categoryListToMove:[],
			};
		},
		onLoad() {
			this.$updateNavbarTitle("部门");
			this.getCategoryList();
		},
		onShow(refresh) {
			if(refresh)
				this.getCategoryList();
		},
		methods:{
			async getCategoryList(){
				uni.showLoading();
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				}else{
					this.canCreate = this.power.isCreate;
				}
				let rqData={};
				userApi.getDeptList(rqData).then(data=>{
					list2FilterList(data,"deptName","deptId");
					this.categoryList=[];
					this.$nextTick(()=>{
						this.isInterface = true;
						uni.hideLoading();
						this.categoryList=data;
					})
				}).catch(err => {
						uni.hideLoading();
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isMove){
					btnList.push({text:"移动部门",icon:"iconyidongbumen"});
				}
				if(power.isUpdate){
					btnList.push({text:'编辑部门',icon:'iconbianji'});
				}
				if(power.isDelete){
					btnList.push({text:"删除部门",icon:"iconshanchu"});
				}
				return btnList;
			},
			getBtnList2(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isMove){
					btnList.push({text:"移动部门",icon:"iconyidongbumen"});
				}
				if(power.isDelete){
					btnList.push({text:"删除部门",icon:"iconshanchu"});
				}
				return btnList;
			},
			onSearch(val){
				if(val!=this.deptName){
					this.deptName=val;
					this.$refs.tree.search(val);
				}
			},
			onChooseTree(val){
				this.chooseItem=val;
				if(val.type==9){
					//部门
					this.$refs.btn.show();
				}else{
					this.$refs.btn2.show();
				}
			},
			onPickerChoose(choose){
				let rqData={
					deptId:this.chooseItem.deptId,
					parentId:choose.value
				}
				uni.showLoading();
				userApi.postMoveDept(rqData).then(data=>{
					uni.hideLoading();
					this.$toast("移动成功");
					this.getCategoryList();
				}).catch(err=>{
					uni.hideLoading();
				});
			},
			onBtnClick({text}){
				if(text=="编辑部门"){
					uni.navigateTo({
						url:`/pages/manage/organization/department/edit?deptId=${this.chooseItem.deptId}&deptName=${this.chooseItem.deptName}`
					})
				}else if(text=="删除部门"){
					this.$refs.msg.show(`<span>是否删除“</span><span style="color: #000;font-weight: bold">${this.chooseItem.deptName}</span><span>”？</span>`);
				}else if(text=="移动部门"){
					this.categoryListToMove=[];
					this.$nextTick(()=>{
						let list=JSON.parse(JSON.stringify(this.categoryList));
						this.deleteSelf(list,this.chooseItem.deptId);
						this.categoryListToMove=list;
					})
					this.$refs.picker.show();
				}
			},
			onMsgConfirm(){
				uni.showLoading();
				userApi.postDeleteDept({deptId:this.chooseItem.deptId}).then(data=>{
						uni.hideLoading();
						this.getCategoryList();
					}).catch(err => {
						uni.hideLoading();
					});
			},
			onCreateBtnClick(){
				uni.navigateTo({
					url:`/pages/manage/organization/department/edit?create=true`
				})
			},
			deleteSelf(list,condition){
				for (var i = 0; i < list.length; i++) {
					let v=list[i];
					if(v.deptId==condition){
						list.splice(i,1);
						return true;
					}else{
						if (v.children&&v.children.length>0)
							if(this.deleteSelf(v.children,condition)){
								return true;
							}
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-full{
		min-height: calc(100% - #{$create-btn-height});
		background: #FFFFFF;
	}
	.list{
		padding: 50upx 15upx 80upx 0px;
	}
	.picker{
		position: relative;
		z-index: 12;
	}
</style>
