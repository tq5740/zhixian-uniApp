<template>
	<view class="page-full">
		<edit-question ref="edit" :question="question" isEdit :examPointTitle="examPointTitle"></edit-question>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import editQuestion from "@/components/editQuestion.vue"
	import examApi from "@/api/modules/exam.js"
	export default {
		components: {
			editQuestion
		},
		data() {
			return {
				create:false,
				question:undefined,
				examPointTitle:[]
			};
		},
		onLoad({create,examQuestionId,point}) {
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建试题");
			}else{
				uni.showLoading();
				this.$updateNavbarTitle("编辑试题");
				try{
					this.examPointTitle=JSON.parse(point);
				}catch(e){
				}
				examApi.getQueryQuestionTemporaryAdmin(examQuestionId).then(data=>{
					this.examQuestionTemporaryId=data.examQuestionTemporaryId;
					let question={};
					question.examQuestionTitle=data.examQuestionTitle;
					question.options=data.options;
					question.answer=data.answer;
					question.analysis=data.analysis;
					question.type=data.type;
					question.diffculty=data.diffculty;
					question.examBankId=data.examBankId;
					question.examBankTitle=data.examBankTitle;
					question.orgId=data.orgId;
					question.examPointId=data.examPointId;
					question.examPointTitle=data.examPointTitle;
					question.examQuestionScenarios=data.examQuestionScenarios;
					this.question=question;
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			}
		},
		methods:{
			onToEdit(){
						let rqData=this.$refs.edit.getData();
						if(this.$isEmpty(rqData))return;
						
						if(rqData.answer)rqData.answer=JSON.stringify(rqData.answer);
						if(rqData.options)rqData.options=JSON.stringify(rqData.options);
						if(rqData.examPointId)rqData.examPointId=JSON.stringify(rqData.examPointId);
						if(rqData.questionScenarios){
							rqData.questionScenarios.forEach(v=>{
								v.answer=JSON.stringify(v.answer);
								v.options=JSON.stringify(v.options);
							});
							rqData.questionScenarios=JSON.stringify(rqData.questionScenarios);
						}
						
						let r_=undefined;
						uni.showLoading();
						if(this.create){
							r_=examApi.postCreateQuestionTemporaryAdmin(rqData);
						}else{
							rqData.examQuestionTemporaryId=this.examQuestionTemporaryId;
							r_=examApi.postUpdateQuestionTemporaryAdmin(rqData);
						}
						if(r_){
							r_.then(data=>{
								uni.hideLoading();
								uni.showToast({
									title:`${this.create?"创建":"修改"}成功`,
									complete:()=> {
										this._refreshPrePage();
									}
								});
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},2000)
							}).catch(err => {
								uni.hideLoading();
								uni.showToast({
									title:typeof err == "string"?err:JSON.stringify(err),
									duration: 2000,
									icon: "none"
								});
							});
						}
				}
		}
	}
</script>

<style lang="scss" scoped>
.page-full{
		padding-bottom: 1upx;
}
	.confirm-btn{
		$height:88upx;
		width:690upx;
		height:$height;
		line-height: $height;
		text-align: center;
		background:$color-main;
		border-radius:10upx;
		color: #fff;
		font-size: $font-size-32;
		margin: 40upx auto;
	}
</style>
