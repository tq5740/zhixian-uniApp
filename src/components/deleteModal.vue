<template>
	<view v-show="showMark" class="delete-modal">
		<view class="mark"  @tap="onCancel" @touchmove.stop.prevent="onMove"></view>
		<view  class="delete-conten">
			<view class="title">
				<text class="title-text uni-ellipsis">{{title||delTitle}}</text>
			</view>
			<view class="delete-conten-txtarea">
				<text class="delete-requirement">请填写删除原因：</text>
				<textarea v-model="reason" placeholder="原因不能为空" :fixed="true" placeholder-class="placeholder-class"></textarea>
				<text class="btn" @tap="onDelete">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				reason:"",
				showMark:false,
				delTitle:""
			}
		},
		methods: {
			onDelete(){
				if(this.$isEmpty(this.reason)){
					uni.showToast({
						icon:"none",
						title:"请填写删除原因"
					});
					return;
				}
				this.$emit("onDelete",this.reason);
				this.onCancel();
			},
			show(delTitle){
				this.showMark=true;
				this.delTitle=delTitle;
			},
			onCancel(){
				this.reason = "";
				this.showMark=false;
			},
			clear() {
				this.reason = "";
			},
			onMove(){}
		}
	}
</script>

<style scoped>
	.mark{position: fixed;z-index: 10;}
	.delete-conten{position: fixed;bottom: 0upx;z-index: 10;background: #FFFFFF;width: 100%;}
	.title{height: 87upx;text-align: center;line-height: 87upx;margin-bottom: 50upx; border-bottom: 1upx solid #D8D8D8; font-size:30upx;font-family:PingFang-SC-Medium;font-weight:500;color:#666666;}
	.title-text{display: inline-block;width: 483upx; }
	.delete-requirement{font-size: 30upx;margin-left:30upx;}
	.btn{display:block;margin: 30upx auto; width:690upx;height:88upx;border-radius:10upx;text-align: center;line-height: 88upx; background:#42B983;font-size:32upx;font-family:PingFang-SC-Medium;font-weight:500;color:#FFFFFF;}
	textarea{ width: 690upx;height:200upx;box-sizing: border-box; padding: 30upx 20upx;margin:30upx auto 0upx; border:1upx solid rgba(216,216,216,1);border-radius:10upx;font-size:28upx;}
	.placeholder-class{font-size:28upx;font-family:PingFang-SC-Medium;font-weight:500;color:#999999}
</style>
