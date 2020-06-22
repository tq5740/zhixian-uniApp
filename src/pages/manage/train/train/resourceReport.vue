<template>
	<view class="train-resource-report page-full">
		<view class="list-content">
			<list-item-study-report v-for="(d,i) of dataList" :key="i" :item="d"
				:title="d.title" :progress="$getFloat(d.progress*100,2)" :length="d.length" :score="d.score" 
				time1Title="完成时间：" :time1="d.completeTime" 
				:state="d.state" :stateBg="d.state=='未完成'?'#FFAE00':d.state=='已完成'?'#42B983':'#B1B1B1'"
				@onItemClick="onItemClick">
			</list-item-study-report>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import listItemStudyReport from "@/components/listItemStudyReport.vue"
	import trainApi from "@/api/modules/train.js"
	export default {
		components: {
			listItemStudyReport
		},
		data() {
			return {
				trainId:undefined,
				userId:undefined,
				userName:undefined,
				dataList:[],
			};
		},
		onLoad({trainId,userId,userName}) {
			this.$updateNavbarTitle(`资源报表-${userName}`);
			this.trainId=trainId;
			this.userId=userId;
			this.userName=userName;
			this.getList();
		},
		methods: {
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				uni.showLoading({
					title:"加载中..."
				});
				trainApi.getDetailedTrainRecordAdmin({
					userId:this.userId,
					trainId:this.trainId
				}).then(data=>{
					this.isInterface=true;
					this.dataList=data;
					uni.hideLoading();
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						icon:"none"
					})
				});
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/train/train/studyReport?courseId=${item.id}&userId=${this.userId}&userName=${this.userName}`
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
</style>


