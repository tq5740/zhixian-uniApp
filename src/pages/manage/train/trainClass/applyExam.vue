<template>
	<view class="apply-exam page-full">
		<info-picker mode="time" title="考试开始时间" :text="startTime" placeholder="请选择" required @onPickerChoose="onPickerChoose"></info-picker>
		<view class="bottom-full-btn" @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import puApi from "@/api/modules/public.js"
	import infoPicker from "@/components/infoPicker.vue"
	export default {
		components: {
			infoPicker
		},
		data() {
			return {
				classId:undefined,
				orgId:undefined,
				startTime:undefined
			};
		},
		onLoad({orgId,classId}) {
			this.$updateNavbarTitle("申请考试");
			this.orgId=orgId;
			this.classId=classId;
		},
		methods: {
			onConfirm(){
				if(this.$isEmpty(this.startTime)){
					uni.showToast({
						title:"请选择开始时间",icon:"none"
					});return;
				}
				uni.showLoading();
				puApi.postApplyExam({
					classId:this.classId,
					orgId:this.orgId,
					startTime:this.startTime+":00"
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"申请成功"
					});
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			},
			onPickerChoose(choose) {
				this.startTime=choose.value;
			}
		},
	}
</script>

<style lang="scss">

</style>
