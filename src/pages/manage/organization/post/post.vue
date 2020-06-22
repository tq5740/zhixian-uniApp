<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建岗位</text>
		</view>
		<search-filter searchPlaceholder="请输入岗位搜索" @onSearch="onSearch"></search-filter>
		<view class="list">
			<tree ref="tree" root edit :dataList="categoryList" @onTreeChoose="onChooseTree"></tree>
		</view>
		<bottom-btn-list ref="btn" @onBtnClick="onBtnClick" :btnList="getBtnList()"></bottom-btn-list>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import searchFilter from "@/components/searchFilter.vue"
	import bottomBtnList from "@/components/bottomBtnList.vue"
	import {list2FilterList} from "@/utils/utils.js"
	import userApi from "@/api/modules/user.js"
	export default {
		components: {
			searchFilter,bottomBtnList
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
				postName:"",
				chooseItem:undefined,
				categoryListToMove:[],
			};
		},
		onLoad() {
			this.$updateNavbarTitle("岗位");
			this.getCategoryList();
		},
		onShow(refresh) {
			if(refresh)
				this.getCategoryList(refresh);
		},
		methods:{
			async getCategoryList(refresh){
				if(refresh){
					this.postName="";
				}
				uni.showLoading();
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				}else{
					this.canCreate = this.power.isCreate;
				}
				let rqData={};
				userApi.getQueryPostTree(rqData).then(data=>{
					list2FilterList(data,"postName","postId");
					this.categoryList=[];
					this.$nextTick(()=>{
						this.isInterface = true;
						uni.hideLoading();
						this.categoryList=data;
						// if(!this.$isEmpty(this.postName)){
						// 	this.$nextTick(()=>{
						// 		this.$refs.tree.search(this.postName);
						// 	})
						// }
					})
				}).catch(err => {
					uni.hideLoading();
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isUpdate){
					btnList.push({text:'编辑岗位',icon:'iconbianji'});
				}
				if(power.isDelete){
					btnList.push({text:"删除岗位",icon:"iconshanchu"});
				}
				return btnList;
			},
			onSearch(val){
				if(val!=this.postName){
					this.postName=val;
					this.$refs.tree.search(val);
				}
			},
			onChooseTree(val){
				this.chooseItem=val;
				this.$refs.btn.show();
			},
			onBtnClick({text}){
				if(text=="编辑岗位"){
					uni.navigateTo({
						url:`/pages/manage/organization/post/edit?postId=${this.chooseItem.postId}&postName=${this.chooseItem.postName}`
					})
				}else if(text=="删除岗位"){
					this.$refs.msg.show(`<span>是否删除“</span><span style="color: #000;font-weight: bold">${this.chooseItem.postName}</span><span>”？</span>`);
				}else if(text=="移动岗位"){
					this.categoryListToMove=[];
					this.$nextTick(()=>{
						let list=JSON.parse(JSON.stringify(this.categoryList));
						this.deleteSelf(list,this.chooseItem.postId);
						this.categoryListToMove=list;
					})
					this.$refs.picker.show();
				}
			},
			onMsgConfirm(){
				uni.showLoading();
				userApi.postDeletePost({postId:this.chooseItem.postId}).then(data=>{
						uni.hideLoading();
						this.getCategoryList();
					}).catch(err => {
						uni.hideLoading();
					});
			},
			onCreateBtnClick(){
				uni.navigateTo({
					url:`/pages/manage/organization/post/edit?create=true`
				})
			},
			deleteSelf(list,condition){
				for (var i = 0; i < list.length; i++) {
					let v=list[i];
					if(v.postId==condition){
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
</style>
