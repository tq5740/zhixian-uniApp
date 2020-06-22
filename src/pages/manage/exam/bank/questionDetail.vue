<template>
	<view class="page-full">
		<list-item-question-detail :question="question" :options="options" :answer="answer" :analysis="analysis" :border="false" :type="type"
		:questionScenarioList="examQuestionScenarios"></list-item-question-detail>
		<no-data :isNoData="$isEmpty(type)"></no-data>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import {getQuestionType } from "@/utils/utils.js"
	export default {
		data() {
			return {
				question:"",
				options:"",
				answer:"",
				analysis:"",
				type:"",
				examQuestionScenarios:undefined
			};
		},
		onLoad({examQuestionId,isTemporary}) {
			this.$updateNavbarTitle("试题详情");
			let question=undefined;
			if(isTemporary){
				question=examApi.getQueryQuestionTemporaryAdmin(examQuestionId);
			}else{
				question=examApi.getQueryExamQuestionAdmin(examQuestionId);
			}
			question.then(data=>{
				this.options=data.options;
				this.analysis=data.analysis;
				this.answer=data.answer;
				this.type=data.type;
				this.examQuestionScenarios=data.examQuestionScenarios;
				let typeS=getQuestionType().find(v=>{
					return v.value==data.type;
				});
				this.question=`【${typeS.name}】${data.examQuestionTitle}`;
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title:typeof err == "string"?err:JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},
		methods:{
		}
	}
</script>

<style lang="scss" scoped>
</style>
