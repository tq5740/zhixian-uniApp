<template>
	<view class="live-recycle page-full">
		<search-filter searchPlaceholder="请输入考试标题搜索" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList()'
					@onBtnClick="onBtnClick" :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.examTitle" :tips='"删除人："+d.updateUserName+" 删除时间："+$formatDate(d.updateTime,"YYYY-MM-DD hh:mm:ss")' tipsColor="#999999">
							<template v-slot:intro>
								<view class="intro">
									<text class="intro-color-1">删除原因：</text><text class="intro-color-2">{{d.reason||''}}</text>
								</view>
							</template>
						</list-item-article>
					  </template>
				 </list-item>
			 </template>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	
	let getListFn=examApi.getRecycleExamListAdmin.bind(examApi);
	let navTitle=`考试回收站`;
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				dataList:[],
				chooseItem:undefined
			};
		},
		onLoad() {
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow() {
			this.$updateNavbarTitle(navTitle);
		},
		methods: {
			/**
			 * 请求列表
			 */
			async getList(restart = false) {
				if(!this.power){
					this.power=await this._getPower();
				}
				this._getListFromServer(getListFn,restart,["query"]).then(total=>{
					if(typeof total == "number"){
						navTitle=`考试回收站(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let btnList=[];
				btnList.push({text:`恢复`,icon:"iconhuifu"});
				if(this.power.isDelete){
					btnList.push({text:`彻底删除`,icon:"iconshanchu"});
				}
				return btnList;
			},
			onBtnClick({btn:{text},item}){
				this.chooseItem=item;
				if(text=="恢复"){
					this.$refs.msg.show(`<span>是否还原考试“</span><span style="color: #000;font-weight: bold">${item.examTitle}</span><span>”？</span>`,text);
				}else if(text=="彻底删除"){
					this.$refs.msg.show(`<span>是否彻底删除考试“</span><span style="color: #000;font-weight: bold">${item.examTitle}</span><span>”？</span>`,text);
				}
			},
			onMsgConfirm(text){
				uni.showLoading();
				let  r_=undefined;
				if(text=="恢复"){
					r_ = examApi.postRecoverExamAdmin({
						examId:this.chooseItem.examId
					});
				}else if(text=="彻底删除"){
					r_ = examApi.postDeleteExamAdmin({
						examId:this.chooseItem.examId
					});
				}
				if(r_){
					r_.then(data=>{
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
		},
	}
</script>

<style lang="scss">
.intro{display: inline-block; font-size:24upx;padding: 25upx 0px 20upx;}
.intro-color-1{color: #666666;}
.intro-color-2{color: #FC703E;}
</style>
