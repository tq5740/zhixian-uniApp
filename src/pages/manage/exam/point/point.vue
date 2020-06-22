<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建知识点</text>
		</view>
		<search-select :dataList="orgList" @onPickerChoose="onPickerChoose" @onSearch="onSearch"></search-select>
		<view class="list">
			<tree ref="tree" root edit :lazy="false" @onTreeChoose="onChooseTree" @onBranchClick="onBranchClick"></tree>
		</view>
		<bottom-btn-list ref="btn" @onBtnClick="onBtnClick" :btnList="getBtnList()"></bottom-btn-list>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import searchSelect from "@/components/searchSelect.vue"
	import bottomBtnList from "@/components/bottomBtnList.vue"
	import {list2FilterList} from "@/utils/utils.js"
	import userApi from "@/api/modules/user.js"
	import examApi from "@/api/modules/exam.js"
	
	let getListFn=examApi.getPointListAdmin.bind(examApi);
	export default {
		components: {
			searchSelect,bottomBtnList
		},
		data() {
			return {
				canCreate:false,
				orgList:[],
				orgId:undefined,
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				dataList:[],
				chooseItem:undefined
			};
		},
		onLoad() {
			this.$updateNavbarTitle("知识点管理");
			userApi.getQueryMyorgList().then(data=>{
				list2FilterList(data,"orgName","orgId");
				
				let all={name:"全部企业",value:null};
				data.unshift(all);
				let orgId=this.$store.state.userInfo.org.orgId;
				let org=data.find(v=>{
					return v.orgId==orgId;
				});
				if(org){
					org.choose=true;
					this.orgId=orgId;
				}else{
					all.choose=true;
				}
				this.getList();
				this.orgList=data;
			}).catch(err=>{
				uni.showToast({
					title:typeof err == "string"?err:JSON.stringify(err),
					icon:"none"
				})
			});
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true);
		},
		methods:{
			/**
			 * 请求列表
			 */
			async getList(restart = false) {
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				}else{
					this.canCreate = this.power.isCreate;
				}
				this._getListFromServer(getListFn,restart,["orgId","query"],30,(data)=>{
					list2FilterList(data,"examPointTitle","examPointId");
				}).then(total=>{
					if(typeof total == "number"){
						this.$refs.tree.updateShowList(this.dataList);
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
			onPickerChoose(val){
				this.orgId=val;
				this.getList(true);
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
			onChooseTree(val){
				this.chooseItem=val;
				this.$refs.btn.show();
			},
			onBranchClick({open,item}){
				if(!open||item.requestChildren)return;
				// 请求下级数据 TODO
				examApi.getPointListAdmin({pageNum:1,pageSize:50,examPointId:item.examPointId}).then(data=>{
					list2FilterList(data.result,"examPointTitle","examPointId");
					if(data.result.length<1)return;
					this.addChildren(item.examPointId,this.dataList,data.result);
					this.$refs.tree.updateShowList(this.dataList);
				})
			},
			findSelf(item,list){
				for (let s of list) {
					if(s==item)return true;
					else{
						if(s.children&&s.children.length>0){
							let r=this.findSelf(item,s.children);
							if(r){
								return r;
							}
						}
					}
				}
				return false;
			},
			addChildren(examPointId,list,repalceList){
				for (let l of list) {
					if(l.examPointId==examPointId){
						l.children=repalceList;
						// 配合小程序，小程序传递回来的item不再是this.dataList里的
						l.requestChildren=true;//已请求过下级
						l.open=true;
					}else if(l.children&&l.children.length>0){
						this.addChildren(examPointId,l.children,repalceList);
					}
				}
			},
			onBtnClick({text}){
				if(text=="编辑"){
					uni.navigateTo({
						url:`/pages/manage/exam/point/edit?orgId=${this.chooseItem.orgId}&examPointId=${this.chooseItem.examPointId}&examPointTitle=${this.chooseItem.examPointTitle}`
					})
				}else if(text=="删除"){
					this.$refs.msg.show(`<span>是否删除“</span><span style="color: #000;font-weight: bold">${this.chooseItem.examPointTitle}</span><span>”？</span>`);
				}
			},
			onMsgConfirm(){
				uni.showLoading();
				examApi.postDeleteExamPointAdmin(this.chooseItem.examPointId).then(data=>{
						uni.hideLoading();
						this.getList(true);
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
							duration: 2000,
							icon: "none"
						});
					});
			},
			onCreateBtnClick(){
				if(this.$isEmpty(this.orgId)){
					uni.showToast({
						title:"请选择企业",icon:"none"
					});return;
				}
				uni.navigateTo({
					url:`/pages/manage/exam/point/edit?create=true&orgId=${this.orgId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-full{
		background: #FFFFFF;
		min-height: calc(100% - #{$create-btn-height});
	}
	.list{
		padding: 50upx 15upx 80upx 0px;
	}
	
</style>
