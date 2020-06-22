<template>
	<view class="course-studyreport page-full">
		<view class="list-content">
			<list-item-study-report v-for="(d,i) of dataList" :key="i"
				:title="d.courseChapterTitle" :progress="getProgress(d)" :length="getLength(d)" :score="getScore(d)" 
				:time1="getTime1(d)" time1Title="开始学习时间："
				:time2="getTime2(d)" time2Title="最后学习时间：" 
				:state="getState(d)" :stateBg="getStateBg(d)">
			</list-item-study-report>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import trainApi from "@/api/modules/train.js"
	import listItemStudyReport from "@/components/listItemStudyReport.vue"
	let getListFn=trainApi.getCourseChapterRecordListAdmin.bind(trainApi);
	export default {
		components: {
			listItemStudyReport
		},
		data() {
			return {
				pageNum: 1,
				pageTotal:2,
				courseId:undefined,
				userId:undefined,
				dataList:[],
			};
		},
		onLoad({courseId,userId,userName}) {
			this.$updateNavbarTitle(`学习报表-${userName}`);
			this.courseId=courseId;
			this.userId=userId;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["userId","courseId"]);
			},
			getWidth(v){
				return uni.upx2px(v)+"px";
			},
			getTime1(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.createTime == d.courseChapterRecord.updateTime ? '未开始学习' : d.courseChapterRecord.createTime;
					}
				}
				return "未开始学习";
			},
			getTime2(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.createTime == d.courseChapterRecord.updateTime ? '未开始学习' : d.courseChapterRecord.updateTime;
					}
				}
				return "未开始学习";
			},
			getState(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.state==2?'未完成':d.courseChapterRecord.state==3?'已完成':'未尝试'
					}
				}
				return "未尝试";
			},
			getStateBg(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.state==2?'#FFAE00':d.courseChapterRecord.state==3?'#42B983':'#B1B1B1';
					}
				}
				return "#B1B1B1";
			},
			getProgress(d){
				if(d){
					if(d.courseChapterRecord){
						
						return this.$getFloat(d.courseChapterRecord.progress*100,2);
					}
				}
				return 0;
			},
			getLength(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.length;
					}
				}
				return 0;
			},
			getScore(d){
				if(d){
					if(d.courseChapterRecord){
						return d.courseChapterRecord.score;
					}
				}
				return 0;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.course-studyreport{}
</style>
