<template>
	<view class="page-full">
		<view class="config">
			<text>创建的直播是否需要审核</text>
			<switch :checked="checked" @change="onSwitchChange" color="#42B983" />
		</view>
		<view class="bottom-full-btn" @tap="onConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import liveApi from "@/api/modules/live.js"
	export default {
		data() {
			return {
				checked:false,
				liveConfigId:undefined
			};
		},
		onLoad() {
			this.$updateNavbarTitle("直播配置");
			liveApi.getQueryLiveConfigAdmin().then(data=>{
				this.checked=data.isAuditLive;
				this.liveConfigId=data.liveConfigId;
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
			onSwitchChange({detail:{value}}){
				this.checked=value;
			},
			onConfirm(){
				uni.showLoading();
				liveApi.postUpdateLiveConfigAdmin({
					isAuditLive:this.checked,
					liveConfigId:this.liveConfigId
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"修改成功"
					});
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
