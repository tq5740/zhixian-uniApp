<template>
	<view class="page-full">
		<view class="list-conten">
			<list-item-question-detail v-for="(q,i) of dataList" :key="i"
			:question="q |getQuestionTitle(i)"
			:options="q.options" :answer="q.answer" :analysis="q.analysis" :border="true" :type="q.questionType"
			:showAnalysis="false" :score="q.score" :questionScenarioList="q.examQuestionScenarios"
			titleBgColor="#fff">
			</list-item-question-detail>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import {getQuestionType } from "@/utils/utils.js"
	const typeList=getQuestionType();
	
	export default {
		data() {
			return {
				number:undefined,
				examBankId:undefined,
				dataList:[],
			};
		},
		filters:{
			getQuestionTitle(v,i){
				let type=typeList.find((t)=>{
					return t.value==v.questionType;
				});
				return `${i+1}、【${type.name}】${v.examQuestionTitle}`;
			}
		},
		onLoad({examBankId,number}) {
			this.$updateNavbarTitle(`第${number}套试卷`);
			this.number=number;
			this.examBankId=examBankId;
			this.getList();
		},
		methods:{
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				uni.showLoading();
				examApi.getExamPaperListAdmin({number:this.number,examBankId:this.examBankId}).then(data=>{
					uni.hideLoading()
					this.dataList=data;
				});
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
