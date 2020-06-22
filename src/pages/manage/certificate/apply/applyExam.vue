<template>
	<view class="apply-exam page-full">
		<info-text title="考试开始日期" :value="endDate"></info-text>
		<info-picker mode="selector" title="考试开始时间" :text="startTime" placeholder="请选择"  :dataList="startTimeList" required @onPickerChoose="onPickerChoose"></info-picker>
		<view class="bottom-full-btn"  @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import puApi from "@/api/modules/public.js"
	import infoText from "@/components/infoText.vue"
	import infoPicker from "@/components/infoPicker.vue"
	export default {
		components: {
			infoPicker,infoText
		},
		data() {
			return {
				classId:undefined,
				orgId:undefined,
				startTime:"",
				endDate:"",
				isRepair:false,//补考
				startTimeList:[[{ name: '8:00', value: "8:00" },{ name: '8:30', value: "8:30" },{ name: '9:00', value: "9:00" },{ name: '9:30', value: "9:30" },{ name: '10:00', value: "10:00" },{ name: '10:30', value: "10:30" },{ name: '11:00', value: "11:00" },{ name: '11:30', value: "11:30" },{ name: '12:00', value: "12:00" },{ name: '12:30', value: "12:30" },{ name: '13:00', value: "13:00" },{ name: '13:30', value: "13:30" },{ name: '14:00', value: "14:00" },{ name: '14:30', value: "14:30" },{ name: '15:00', value: "15:00" },{ name: '15:30', value: "15:30" },{ name: '16:00', value: "16:00" },{ name: '16:30', value: "16:30" },{ name: '17:00', value: "17:00" },{ name: '17:30', value: "17:30" },{ name: '18:00', value: "18:00" },{ name: '18:30', value: "18:30" },{ name: '19:00', value: "19:00" },{ name: '19:30', value: "19:30" },{ name: '20:00', value: "20:00" }]],
				disabled:false
			};
		},
		onLoad({orgId,classId,examId,endDate,isRepair}) {
			this.orgId=orgId;
			this.classId=classId;
			this.examId=examId;
			this.isRepair="true"===isRepair;
			if(this.isRepair){
				this.$updateNavbarTitle("申请补考");
			}else{
				this.$updateNavbarTitle("申请考试");
			}
			this.endDate=this.$formatDate(+endDate,"YYYY-MM-DD");
		},
		methods: {
			onConfirm(){
				if(this.disabled){
					this.$toast("已申请或者正在申请，请稍后再试");
					return;
				};
				if(this.$isEmpty(this.startTime)){
					uni.showToast({
						title:"请选择开始时间",icon:"none"
					});return;
				}
				this.disabled=true;//禁止重复点击
				let _r=undefined;
				let rqData={
						classId:this.classId,
						orgId:this.orgId,
						startTime:this.startTime+":00"
					};
				if(this.isRepair){
					rqData.examId=this.examId;
					_r=puApi.postApplyRepairExam(rqData);
				}else{
					_r=puApi.postApplyExam(rqData);
				}
				_r.then(data=>{
					uni.showToast({
						title:"申请成功"
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1500);
				}).catch(err => {
					this.disabled=false;//允许点击
				});
			},
			onPickerChoose(choose) {
				this.startTime=choose.value[0].value;
			}
		},
	}
</script>

<style lang="scss">
	.bottom-full-btn{
		z-index: 9;
	}
</style>
