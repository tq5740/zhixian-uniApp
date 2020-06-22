<template>
	<view class="page-full">
		<view class="config">
			<text>培训是否需要审核</text>
			<switch :checked="checked" @change="onSwitchChange" color="#42B983" />
		</view>
		<view class="bottom-full-btn" @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import trainApi from "@/api/modules/train.js"
	export default {
		data() {
			return {
				checked:false,
				trainConfigId:undefined
			};
		},
		onLoad() {
			this.$updateNavbarTitle("培训配置");
			trainApi.queryTrainConfigAdmin().then(data=>{
				this.checked=data.isAuditTrain;
				this.trainConfigId=data.trainConfigId;
			}).catch(err => {
				uni.hideLoading();
			});
		},
		methods:{
			onSwitchChange({detail:{value}}){
				this.checked=value;
			},
			onConfirm(){
				uni.showLoading();
				trainApi.updateTrainConfigAdmin({
					isAuditTrain:this.checked,
					trainConfigId:this.trainConfigId
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"修改成功"
					});
					setTimeout(()=>{
						uni.navigateBack({delta:1});
					},2000);
				}).catch(err => {
					uni.hideLoading();
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
