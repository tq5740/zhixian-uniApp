<template>
	<view class="videotape page-full">
		<view class="tips">
			<text>温馨提示：录播具有时效性，请在结束直播后2小时内开启录播，否则无法开启录播。</text>
		</view>
		<view class="list-content">
			<template v-for="(d,i) of dataList">
				<list-item
				:item="d"
				 :btnList='d.videoState|getBtnList'
				 @onBtnClick="onBtnClick"
				 :key="i">
				<template v-slot:content>
					<list-item-article :name="(d.type==1?'【直播】':'【课堂】')+d.videoTitle" 
					:state="d.videoState==1?'录制完成':'录制中'" :stateBgColor="d.videoState==1?'#42B983':'#FFAE00'"
					:intro="'开始时间：'+$formatDate(d.startTime,'YYYY-MM-DD hh:mm:ss')" 
					:tips="'结束时间：'+$formatDate(d.endTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#666">
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
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import liveApi from "@/api/modules/live.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				liveChapterId:undefined,
				dataList:[]
			};
		},
		filters:{
			getBtnList(state){
				if(state==1){
					return [{text:"开启录播",icon:"iconkaiqilubo"}];
				}
			}
		},
		onLoad({liveChapterId}){
			this.$updateNavbarTitle("录播列表");
			this.liveChapterId=liveChapterId;
			this.getList();
		},
		methods: {
			getList() {
				liveApi.getLiveChapterRecordListAdminOfChapter(this.liveChapterId).then(data=>{
					this.dataList=data;
				})
			},
			onBtnClick({item}){
				uni.showLoading();
				liveApi.postDownloadLiveChapterAdmin({
					videoRecordId:item.videoRecordId,
					type:item.type,
					liveChapterId:item.liveChapterId
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:data,
						icon:"none"
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
		},
	}
</script>

<style lang="scss" scoped>
	.tips{
		color: #FC703E; font-size:$font-size-24;
		background: #FFF4F0;
		padding: 20upx;
	}
</style>
