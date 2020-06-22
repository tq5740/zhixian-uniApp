<template>
	<view class="warch-record">
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.examTitle" :tips="'交卷时间：'+$formatDate(d.submitTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999" 
						:state="d.isMark==1?'已阅卷':'未阅卷'" :stateBgColor="d.isMark==1?'#42B983':'#B1B1B1'">
							<template v-slot:intro>
								<view class="intro">
									<text>状态：<text class="state" :style="{color:getExamStateColor(d.recordState)}">{{d.recordState|getExamState}}</text></text>
									<text v-if="d.recordState==2" class="score">考试成绩：<text style="color:#6D9985;">{{d.recordScore}}</text></text>
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
	import examApi from "@/api/modules/exam.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	let getListFn=examApi.getQueryExamRecordAdmin.bind(examApi);
	export default {
		components: {
			listItemArticle
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				examId:undefined,
				userId:undefined,
				dataList:[],
			};
		},
		filters:{
			getExamState(val){
				if(val==1){
					return "考试中";
				}else if(val==2){
					return "已交卷"; 
				}else if(val==3){
					return "考试异常"; 
				}else if(val==4){
					return "成绩计算中"; 
				}
			}
		},
		onLoad({examId,userId,name}) {
			this.$updateNavbarTitle(`${name}的考试记录`);
			this.examId=examId;
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
				this._getListFromServer(getListFn,restart,["examId","userId"]);
			},
			getExamStateColor(val){
				if(val==1||val==3){
					return "#FC703E";
				}else if(val==2){
					return "#6D9985"; 
				}else if(val==4){
					return "#FFAE00"; 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.intro{
		color: $color-666;font-size: $font-size-24;
		margin:27upx 0px 23upx;
		.score{
			margin-left: 27upx;
		}
	}
</style>
