<template>
	<view class="signup">
		<search-filter :filterList="filterList" searchPlaceholder="请输入文章名称搜索" :searchDataList="searchDataList"
		 @onFilterMenuClick="onFilterMenuClick" @onSearchInput="onSearchInput" @onSearchDataClick="onSearchDataClick"></search-filter>
		 <view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList()'
					@onItemClick="onItemClick" @onBtnClick="onBtnClick"  :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.realName+'-'+d.phone" :intro="d | getIntro" 
						:tips="d | getTips" tipsColor="#FC703E" :state="d.state | getState" :stateBgColor="d.state | getStateBgColor">
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
	import {formatDate,getArticleRegState} from "@/utils/utils.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	
	
	const stateList=getArticleRegState();
	let navTitle="报名列表";
	let getListFn=artApi.getArticleRegListAdmin.bind(artApi);
	
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				filterList:[{name:"全部",value:undefined,type:"state"}, {value: 2,name: "未通过",type:"state"},{value: 3,name: "审核中",type:"state"},{value: 4,name: "已通过",type:"state"}],
				pageNum: 1,
				pageTotal:2,
				articleId:undefined,
				state:undefined,
				dataList:[],
				searchDataList:[],
				chooseItem:undefined
			}
		},
		filters:{
			getIntro: function(item) {
				return `报名时间：${formatDate(item.createTime,"YYYY-MM-DD hh:mm:ss")}`;
			},
			getTips: function(item) {
				return item.remarks;
			},
			getState(state){
				return stateList.find(v=>{
					return v.id==state;
				}).text;
			},
			getStateBgColor(state){
				return stateList.find(v=>{
					return v.id==state;
				}).color;
			},
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
		methods: {
			/**
			 * 请求列表
			 */
			async getList(restart = false,rename=true) {
				if(!this.power){
					this.power=await this._getPower();
				}
				this._getListFromServer(getListFn,restart,["articleId","state"]).then(total=>{
					if(typeof total == "number"&&rename){
						navTitle=`报名列表(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[];
				if(power.isAudit){
					btnList.push({text:"审核",icon:"iconshenhe"});
				}
				if(power.isDelete){
					btnList.push({text:"删除",icon:"iconshanchu"});
				}
				return btnList;
			},
			onBtnClick({btn:{text},item}){
				if(text=="删除"){
					this.chooseItem=item;
					this.$refs.msg.show(`<span>是否删除用户“</span><span style="color: #000;font-weight: bold">${item.realName}</span><span>”？</span>`);
				}else if(text=="审核"){
					uni.navigateTo({
						url:`/pages/manage/article/signup/detail?item=${JSON.stringify(item)}&examine=true`
					})
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/article/signup/detail?item=${JSON.stringify(item)}`
				})
			},
			onMsgConfirm(flag){
				uni.showLoading();
				artApi.postDeleteArticleRegAdmin({articleId:this.chooseItem.articleId,phone:this.chooseItem.phone}).then(data=>{
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
			onFilterMenuClick(obj) {
				if (this[obj.type] != obj.value) {
					this[obj.type] = obj.value;
					this.getList(true);
				}
			},
			onSearchDataClick(art){
				if(this.articleId!=art.articleId){
					this.articleId=art.articleId
					this.getList(true);
				}
			},
			onSearchInput(value){
				let rqData={
					pageNum:1,
					pageSize:99,
					query:value
				}
				artApi.getArticleListAdmin(rqData).then(data => {
					this.searchDataList=[];
					data.result.forEach(v=>{
						this.searchDataList.push({name:v.articleTitle,articleId:v.articleId});
					});
				}).catch(err => {
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.signup{}
</style>
