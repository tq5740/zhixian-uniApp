<template>
	<view class="page-full">
		<view class="config">
			<text>创建的试卷是否需要审核</text>
			<switch :checked="isAuditExam" @change="onSwitchChange($event,'isAuditExam')" color="#42B983" />
		</view>
		<view class="config">
			<text>是否开启人脸识别</text>
			<switch :checked="isOpenAi" @change="onSwitchChange($event,'isOpenAi')" color="#42B983" />
		</view>
		<view class="bottom-full-btn" @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	export default {
		data() {
			return {
				isAuditExam:false,
				isOpenAi:false,
				examConfigId:undefined
			};
		},
		onLoad() {
			this.$updateNavbarTitle("考试配置");
			examApi.getQueryExamConfigAdmin().then(data=>{
				this.isAuditExam=data.isAuditExam;
				this.isOpenAi=data.isOpenAi;
				this.examConfigId=data.examConfigId;
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
			onSwitchChange({detail:{value}},key){
				this[key]=value;
			},
			onConfirm(){
				uni.showLoading();
				examApi.postUpdateExamConfigAdmin({
					isAuditExam:this.isAuditExam,
					isOpenAi:this.isOpenAi
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"修改成功"
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						});
					},2000);
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
</script>

<style lang="scss" scoped>
	.config{
		height: 100upx;
		display: flex;align-items: center;justify-content: space-between;
		padding: 0upx 30upx;
		background: #FFFFFF;
		color: #6D9985;
		font-size:$font-size-30;
	}
</style>
