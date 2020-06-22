<template>
	<view class="content">
		<view class="item-name-state">
			<view class="item-name" :style="{'color':globalColor||nameColor}">
				<text class="item-text uni-ellipsis" :class="isRecommend ? '' : 'item-text1'">{{name}}</text>
				<img v-if="isRecommend" class="is-recommend" src="/static/img/isRecommend.png" alt="">
			</view>
			
			<text v-if="state||stateIcon" @tap="onIconClick"  class="item-state" :style="{'background':stateBgColor,color:stateColor}">
				<text v-if="stateIcon" class="item-state-icon iconfont" :class="stateIcon" :style="{color:stateColor,'font-size':stateIconSize}"></text>
				{{state}}
				<text v-if="isBanner" class="item-banner" style="background-color: #B1B1B1;">已关闭</text>
			</text>
		</view>
		<slot name="intro">
			<view v-if="intro" class="item-introductions uni-ellipsis" :style="{color:globalColor||introColor}">
				<text space="ensp">{{intro}}</text>
			</view>
		</slot>
		<view v-if="tips" class="tips" :style="{color:globalColor||tipsColor}">
			<text space="ensp">{{tips}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name: { //名称
				type: String,
				default: ""
			},
			intro: { //简介
				type: String,
				default: ""
			},
			introColor: { //简介颜色
				type: String,
				default: ""
			},
			nameColor: { //简介颜色
				type: String,
				default: ""
			},
			globalColor: { //全局颜色
				type: String,
				default: ""
			},
			state: { //状态
				type: String,
				default: ""
			},
			stateColor: { //状态颜色
				type: String,
				default: ""
			},
			stateBgColor: { //状态背景颜色
				type: String,
				default: ""
			},
			stateIcon:{//状态icon
				type: String,
				default: ""
			},
			stateIconSize:{//状态icon大小
				type: String,
				default: uni.upx2px(24)+"px"
			},
			tips: { //提示语
				type: String,
				default: ""
			},
			tipsColor: { //提示语颜色
				type: String,
				default: ""
			},
			isBanner: {
				type: Boolean,
				default: false
			},
			isRecommend: {
				type: [Number,Boolean],
				default: 0
			}
		},
		methods:{
			onIconClick(){
				this.$emit("onIconClick");
			}
		}
	}
</script>

<style scoped>
	.content,
	.item-name-state {
		display: flex;
		align-items: center;
	}
	.is-recommend {
		width: 32upx;
		height: 32upx;
		margin-left: 6upx;
	}
	.item-banner {}

	.content {
		max-height: 197upx;
		min-height: 154upx;
		padding: 33upx 20upx 25upx;
		box-sizing: border-box;
		background: #FFFFFF;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between
	}

	.item-name-state {
		height: 38upx;
		justify-content: space-between;
		width: 100%;
	}

	.item-state-icon {
		font-size: 24upx;
		padding-right: 8upx;
	}

	.item-state {
		display: inline-block;
		height: 38upx;
		line-height: 38upx;
		min-width: 94upx;
		padding: 0px 11upx;box-sizing: border-box;
		text-align: center;
		border-radius: 19upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #FFFFFF;
	}

	.item-name {
		max-width: 615upx;
		display: flex;
		align-items: center;
		flex-grow: 1;
		font-size: 30upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
	}
	.item-text {
		display: inline-block;
		max-width: 560upx;
	}
	.item-text1 {
		max-width: 600upx;
	}

	.item-introductions {
		height: 30upx;
		padding: 25upx 0px 25upx;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: #666666;
	}

	.tips {
		height: 30upx;
		font-size: 24upx;
		font-family: PingFang-SC-Regular;
		font-weight: 400;
		color: #FC703E;
		background: #FFFFFF;
	}
</style>
