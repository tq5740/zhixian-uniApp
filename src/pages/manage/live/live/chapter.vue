<template>
	<view class="live-chapter page-full create-btn-padding-bottom">
		<view class="list-content">
			<template v-for="(d,i) of dataList">
				<list-item
				:item="d"
				 :btnList='d.state|getBtnList'
				 @onBtnClick="onBtnClick" @onItemClick="onItemClick"
				 :key="i">
					<template v-slot:content>
						<list-item-article :name="(d.liveType==1?'【直播】':'【课堂】')+d.liveChapterTitle" :tips="getTips(d)" tipsColor="#999999"
						:state='d.state|getState' :stateBgColor='d.state|getStateBg'>
							<template v-slot:intro>
								<view class="template">
									<text class="title">直播间模板类型：</text>
									<text class="template-text uni-ellipsis">{{d.templateType|getTemplate}}</text>
								</view>
							</template>
						</list-item-article>
					</template>
				</list-item>
			</template>
		</view>
		<view class="bottom-btn van-hairline--top">
			<view v-if="isCreateLive" class="back-btn" @tap="onBackClick">
				<text>保存</text>
			</view>
			<view v-if="isCreateLive" class="line"></view>
			<view class="create-btn" @tap="onCreateBtnClick">
				<text class="iconfont iconchuangjian"></text>
				<text>创建章节</text>
			</view>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import liveApi from "@/api/modules/live.js";
	import {getLiveTemplateType,getLiveChapterState} from "@/utils/utils.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	
	
	let getListFn=liveApi.getLiveChapterListAdmin.bind(liveApi);
	const templateType=getLiveTemplateType();
	const stateList=getLiveChapterState();
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				liveId:undefined,
				isCreateLive:false,//是否是创建直播进入
				dataList:[],
			};
		},
		filters:{
			getTemplate(type){
				return templateType.find(v=>{
					return v.id==type;
				}).text;
			},
			getState(state){
				return stateList.find(v=>{
					return v.id==state;
				}).text;
			},
			getStateBg(state){
				return stateList.find(v=>{
					return v.id==state;
				}).color;
			},
			getBtnList(state){
				// 1：未开始；2：正在直播；3：直播已结束/录播未开始；4：录播中；5：录播已结束 ;
				if(state==1){
					return [{text:"编辑",icon:"iconbianji"}];
				}else if(state==3){
					return [{text:"录播列表",icon:"iconluboliebiao"}];
				}else if(state==4){
					return [{text:"关闭录播",icon:"iconguanbilubo"}];
				}else if(state==5){
					return [{text:"开启录播",icon:"iconkaiqilubo"}];
				}
			}
		},
		onLoad({id,name,isCreateLive}) {
			this.$updateNavbarTitle(name);
			if(isCreateLive)
				this.isCreateLive=true;
			this.liveId=id;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true);
		},
		methods: {
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["liveId"]);
			},
			onRadioChange(val){
				this.type=val;
			},
			onInputConfirm(val,key){
				this[key]=val;
			},
			onBackClick(){
				uni.navigateTo({
					url:`/pages/manage/live/live/live`
				})
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/live/live/chapterDetail?liveChapterId=${item.liveChapterId}`
				})
			},
			onBtnClick({btn:{text},item}){
				if(text=="编辑"){
					uni.navigateTo({
						url:`/pages/manage/live/live/editChapter?liveChapterId=${item.liveChapterId}&liveId=${this.liveId}`
					})
				}else if(text=="关闭录播"){
					this.beganCloseLiveChapterVideoAdmin(item.liveChapterId,5);
				}else if(text=="开启录播"){
					this.beganCloseLiveChapterVideoAdmin(item.liveChapterId,4);
				}else if(text=="录播列表"){
					uni.navigateTo({
						url:`/pages/manage/live/live/videotape?liveChapterId=${item.liveChapterId}`
					})
				}
			},
			beganCloseLiveChapterVideoAdmin(liveChapterId,state){
				uni.showLoading();
				liveApi.postBeganCloseLiveChapterVideoAdmin({
					liveChapterId:liveChapterId,
					state:state
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
						url:`/pages/manage/live/live/editChapter?create=true&liveId=${this.liveId}`
					})
			},
			getTips: function(d) {
				return `主讲人：${d.speaker}  创建时间：${this.$formatDate(d.createTime,"YYYY-MM-DD hh:mm:ss")}`;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.live-chapter{
		min-height: calc(100% - #{$create-btn-height});
	}
	.template{
		font-size:$font-size-24 ;
		width: 100%;
		margin: 30upx 0px 22upx;
		color:#666666;
		&-text{
			color: #6D9985;
		}
	}
	.bottom-btn{
		position: fixed;bottom: 0upx;width: 100%;z-index: 10;
		display: flex;align-items: center;
		background: #ffffff;
		.create-btn{position: relative;width: 50%;border: none;flex-grow: 1;}
		.back-btn{
			height: $create-btn-height;
			line-height: $create-btn-height;
			text-align: center;width: 50%;
			font-size: 32upx;
			color: $color-main;
		}
		.line{
			height: 40upx;width: 2upx;background: #d8d8d8;
		}
	}
</style>
