<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入试题名称搜索" 
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" 
					:btnList="getBtnList()"
					@onBtnClick="onBtnClick"  @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-question :type="d.type" :title="d.examQuestionTitle" :difficulty="d.diffculty"
						:point="d.examPointTitle"
						:bank="d.examBankTitle"></list-item-question>
					</template>
				 </list-item>
			</template>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<!-- <view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建试题</text>
		</view> -->
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import listItemQuestion from "@/components/listItemQuestion.vue"
	import examApi from "@/api/modules/exam.js"
	import {getQuestionType,getQuestionDifficulty,list2FilterList} from "@/utils/utils.js"
	let getListFn=examApi.getQuestionTemporaryListAdmin.bind(examApi);
	let navTitle=`临时试题`;
	export default {
		components: {
			listItemQuestion
		},
		data() {
			
			let filterList=[{name:"所在题库",type:"examBankId",children:[]},{name:"试题题型",type:"type",children:[]}];
			
			return {
				canCreate:false,//是否显示创建按钮
				filterList:filterList,
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				type:undefined,
				diffculty:undefined,
				dataList:[],
			};
		},
		onLoad() {
			this.getList();
			let typeList=getQuestionType().concat([]);
			typeList.unshift({name:"全部",value:undefined,choose:true});
			examApi.getQueryExamBankTitleAdmin().then(data=>{
				list2FilterList(data,"examBankTitle","examBankId");
				data.unshift({name:"全部",value:null,choose:true});
				this.$set(this.filterList[0], "children", data);
				this.filterList[1].children=typeList;
			});
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true,false);
			else
				this.$updateNavbarTitle(navTitle);
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
				this._getListFromServer(getListFn,restart,["examBankId","query","type"]).then(total=>{
					if(typeof total == "number"&&rename){
						navTitle=`临时试题(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isUpdate){
					btnList.push({text:`编辑`,icon:"iconbianji"});
				}
				if(power.isAudit){
					btnList.push({text:`加入正式试题`,icon:"iconshenhe"});
				}
				if(power.isDelete){
					btnList.push({text:`删除`,icon:"iconshanchu"});
				}
				return btnList;
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/exam/bank/questionDetail?examQuestionId=${item.examQuestionTemporaryId}&isTemporary=true`
				})
			},
			onBtnClick({btn:{text},item}){
					if(text=="编辑"){
						uni.navigateTo({
							url:`/pages/manage/exam/temporaryQuestion/edit?examQuestionId=${item.examQuestionTemporaryId}&point=${item.examPointTitle}`
						})
					}else if(text=="删除"){
						this.$refs.msg.show(`此操作将永久删除该试题，确认删除吗？`,item.examQuestionTemporaryId);
					}else if(text=="加入正式试题"){
						uni.navigateTo({
							url:`/pages/manage/exam/temporaryQuestion/examine?examQuestionId=${item.examQuestionTemporaryId}`
						})
					}
			},
			onMsgConfirm(id){
				let r_=undefined;
				uni.showLoading();
				examApi.postDeleteQuestionTemporaryAdmin({
					examQuestionTemporaryIds:JSON.stringify([id])
				}).then(data=>{
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
				uni.navigateTo({
					url:`/pages/manage/exam/temporaryQuestion/edit?create=true`
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
	.page-full{
		min-height: calc(100% - #{$create-btn-height});
	}
	.block{
		margin-bottom: 20upx;
	}
</style>
