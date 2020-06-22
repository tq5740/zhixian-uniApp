<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建分类</text>
		</view>
		<search-select :dataList="orgList" @onPickerChoose="onPickerChoose" @onSearch="onSearch"></search-select>
		<view class="list">
			<tree ref="tree" root edit :dataList="categoryList" @onTreeChoose="onChooseTree"></tree>
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
	import puApi from "@/api/modules/public.js"
	export default {
		components: {
			searchSelect,bottomBtnList
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
				chooseItem:undefined
			};
		},
		onLoad() {
			this.$updateNavbarTitle("考试分类");
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
					this.getCategoryList(orgId);
				}else{
					all.choose=true;
					this.getCategoryList();
				}
				this.orgList=data;
			}).catch(err=>{
				uni.showToast({
					title:typeof err == "string"?err:JSON.stringify(err),
					icon:"none"
				})
			});
		},
		onShow(refresh) {
			if(refresh)
				this.getCategoryList(this.orgId);
		},
		methods:{
			async getCategoryList(orgId){
				uni.showLoading();
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				}else{
					this.canCreate = this.power.isCreate;
				}
				let rqData={};
				this.orgId=orgId;
				if(!this.$isEmpty(orgId))
					rqData.orgId=orgId;
				puApi.getExamCategoryListAdmin(rqData).then(data=>{
					this.isInterface = true;
					list2FilterList(data,"categoryTitle","categoryId");
					this.categoryList=[];
					this.$nextTick(()=>{
						uni.hideLoading();
						this.categoryList=data;
					})
				}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
							duration: 2000,
							icon: "none"
						});
					});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isUpdate){
					btnList.push({text:'编辑分类',icon:'iconbianji'});
				}
				if(power.isDelete){
					btnList.push({text:"删除分类",icon:"iconshanchu"});
				}
				return btnList;
			},
			onPickerChoose(val){
				this.getCategoryList(val);
			},
			onSearch(val){
				this.$refs.tree.search(val);
			},
			onChooseTree(val){
				this.chooseItem=val;
				this.$refs.btn.show();
			},
			onBtnClick({text}){
				if(text=="编辑分类"){
					uni.navigateTo({
						url:`/pages/manage/exam/category/edit?orgId=${this.chooseItem.orgId}&categoryId=${this.chooseItem.categoryId}&categoryTitle=${this.chooseItem.categoryTitle}`
					})
				}else if(text=="删除分类"){
					this.$refs.msg.show(`<span>是否删除“</span><span style="color: #000;font-weight: bold">${this.chooseItem.categoryTitle}</span><span>”？</span>`);
				}
			},
			onMsgConfirm(){
				uni.showLoading();
				puApi.postDeleteExamCategory(this.chooseItem.categoryId).then(data=>{
						uni.hideLoading();
						this.getCategoryList(this.orgId);
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
					url:`/pages/manage/exam/category/edit?create=true&orgId=${this.orgId}`
				})
			},
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
	
</style>
