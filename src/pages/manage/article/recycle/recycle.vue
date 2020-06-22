<template>
	<view class="recycle">
		<search-filter searchPlaceholder="请输入文章名称搜索" 
		 @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		 <view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList()'
					@onItemClick="onItemClick" @onBtnClick="onBtnClick"  :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.articleTitle" :tips="d | getTips" tipsColor="#999999">
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
	import artApi from "@/api/modules/article.js"
	import {formatDate} from "@/utils/utils.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	let navTitle="文章回收站";
	let getListFn=artApi.getRecycleArticleListAdmin.bind(artApi);
	export default {
		components: {
			listItemArticle
		},
		filters:{
			getTips: function(item) {
				return `删除人：${item.updateUserName ||""}  删除时间：${formatDate(item.updateTime,"YYYY-MM-DD hh:mm:ss")}`;
			}
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				dataList:[],
				chooseItem:undefined
			}
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
						navTitle=`文章回收站(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let btnList=[{text:"恢复",icon:"iconhuifu"}];
				if(this.power.isDelete){
					btnList.push({text:"彻底删除",icon:"iconshanchu"});
				}
				return btnList;
			},
			onBtnClick({btn:{text},item}){
				this.chooseItem=item;
				if(text=="彻底删除"){
					this.$refs.msg.show(`<span>您确定要彻底删除文章“</span><span style="color: #000;font-weight: bold">${item.articleTitle}</span><span>”？</span>`,"delete");
				}else if(text=="恢复"){
                      this.$refs.msg.show(`<span>您确定要还原文章“</span><span style="color: #000;font-weight: bold">${item.articleTitle}</span><span>”？</span>`,"recovery"); 
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/article/article/detail?articleId=${item.articleId}`
				})
			},
			onMsgConfirm(flag){
				let r_=undefined;
				uni.showLoading();
				if("delete"==flag){
					r_=artApi.postDeleteArticleAdmin(this.chooseItem.articleId);
				}else if("recovery"==flag){
					r_=artApi.postRecoveryArticleAdmin(this.chooseItem.articleId);
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
		}
	}
</script>

<style scoped>
.intro{display: inline-block; font-size:24upx;padding: 25upx 0px 20upx;}
.intro-color-1{color: #666666;}
.intro-color-2{color: #FC703E;}
</style>
