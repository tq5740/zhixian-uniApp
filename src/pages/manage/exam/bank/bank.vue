<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入题库名称搜索" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" 
					:btnList="getBtnList()"
					@onBtnClick="onBtnClick"  @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-article :name="d.examBankTitle" :tips="'创建人：'+d.createUserName+'  创建时间：'+$formatDate(d.createTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999">
							<template v-slot:intro>
								<view class="intro">
									<text class="paperNumber">{{d.paperNumber}}套试卷</text>
									<text>试题数量：<text class="questionNumber">{{d.questionNumber}}</text></text>
								</view>
							</template>
						</list-item-article>
					</template>
				 </list-item>
			 </template>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建题库</text>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	
	let getListFn=examApi.getExamBankListAdmin.bind(examApi);
	let navTitle=`题库`;
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				canCreate:false,
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				sortBy:false,
				sortField:"createTime",
				dataList:[],
			};
		},
		onLoad() {
			this.getList();
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
				this._getListFromServer(getListFn,restart,["query","sortBy","sortField"]).then(total=>{
					if(typeof total == "number"){
						navTitle=`题库(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/exam/bank/bankDetail?bank=${JSON.stringify(item)}`
				})
			},
			onBtnClick({btn:{text},item}){
				if(text=="编辑"){
					uni.navigateTo({
						url:`/pages/manage/exam/bank/editBank?bank=${JSON.stringify(item)}`
					})
				}else if(text=="删除"){
					this.$refs.msg.show(`如果删除该题库，将删除该题库下所有试题、知识点！该操作不可恢复，确认删除吗？`,item.examBankId);
				}else if(text=="组卷"){
					uni.navigateTo({
						url:`/pages/manage/exam/bank/tactics?examBankId=${item.examBankId}`
					})
				}else if(text=="查看试题"){
					uni.navigateTo({
						url:`/pages/manage/exam/bank/question?examBankId=${item.examBankId}&title=${item.examBankTitle}`
					})
				}else if(text=="查看试卷"){
					uni.navigateTo({
						url:`/pages/manage/exam/bank/testPaper?examBankId=${item.examBankId}&title=${item.examBankTitle}&paperNumber=${item.paperNumber}`
					})
				}
				
			},
			onCreateBtnClick(){
				uni.navigateTo({
					url:`/pages/manage/exam/bank/editBank?create=true`
				})
			},
			
			onMsgConfirm(id){
				let r_=undefined;
				uni.showLoading();
				examApi.postDeleteExamBankAdmin(id).then(data=>{
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
			/**搜索
			 * @param {Object} value 搜索关键字
			 */
			onSearch(value) {
				if (this.query != value) {
					this.query = value;
					this.getList(true);
				}
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[{text:`组卷`,icon:"iconzujuan",iconColor:"#3BC7CE",textColor:"#666666"}];
				if(power.isAudit){
					btnList.push({text:"审核",icon:"iconshenhe"});
				}
				if(power.isUpdate){
					btnList.push({text:`编辑`,icon:"iconbianji"});
				}
				if(power.isDelete){
					btnList.push({text:"删除",icon:"iconshanchu"});
				}
				btnList.push({text:`查看试题`,icon:"iconbaoming"});
				btnList.push({text:`查看试卷`,icon:"iconshijuanguanli"});
				return btnList;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-full{
		min-height: calc(100% - #{$create-btn-height});
	}
	
	.intro{
		margin: 20upx 0px 17upx;
		font-size: $font-size-24;
		.paperNumber{
			$height:34upx;
			height: $height;
			line-height: $height;
			display: inline-block;
			padding: 0px 12upx;
			margin-right: 15upx;
			border-radius:50upx;
			border:1upx solid #6D9985;
			color: #6D9985;
			background: #F0F9F5;
		}
		.questionNumber{
			color: #FC703E;
		}
	}

</style>
