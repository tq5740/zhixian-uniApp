<template>
    <view class="page-full">
		<view class="online">
			<image src="../../static/img/noData.png"></image>
			<text>即将上线</text>
		</view>
	</view>
</template>
<script>
export default {
	onLoad() {
	},
    onShow() {
		uni.showTabBar({
			animation:false
		});
    }
}
</script>
<style scoped>
	.page-full{
		background: #FFFFFF;
	}
	image{
		margin:0px auto 50upx;
		width: 288upx;
		height: 240upx;
	}
	.online{
		color: #427059;
		font-size: 30upx;
		position: absolute;top: 50%;left: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		width: 100%;
		display: flex;flex-direction: column;
	}
</style>


