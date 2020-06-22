<template>
	<view class="warch-record page-full">
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" 
					@onBtnClick="onBtnClick"  @onItemClick="onItemClick" :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.liveChapterTitle" :tips="'最后观看时间：'+$formatDate(d.updateTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999" :state="d.device==1?'手机':'电脑'" :stateColor="d.device==1?'#6D9985':'#F0A442'"  :stateIcon="d.device==1?'iconshouji':'icondiannao'">
							<template v-slot:intro>
								<view class="intro">
									<text>观看时长：</text>
									<text class="time">{{$formatDuration(d.length)}}</text>
									<text>角色：</text>
									<text class="role">{{d.role|getRole}}</text>
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
	let getListFn=liveApi.getLiveChapterRecordListAdmin.bind(liveApi);
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				liveId:undefined,
				userId:undefined,
				dataList:[],
			};
		},
		filters: {
			getRole(val){
				if(val==1){
					return "主讲人";
				}else if(val==2){
					return "助教"; 
				}else if(val==3){
					return "互动者"; 
				}else if(val==4){
					return "旁观者"; 
				}
			}
		},
		onLoad({liveId,userId,name}) {
			this.$updateNavbarTitle("观看记录-"+name);
			this.liveId=liveId;
			this.userId=userId;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["liveId","userId"]);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.intro{
		color: $color-666;font-size: $font-size-24;
		margin:27upx 0px 23upx;
		.time{
			color: #FC703E;margin-right: 27upx;
		}
		.role{
			color: #6D9985;
		}
	}
</style>
