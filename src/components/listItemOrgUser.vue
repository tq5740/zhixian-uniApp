<template>
	<view>
		<view class="content">
			<image class="item-logo" :class="{'logo-circle':logoCircle}" :src="logoSrc"></image>
			<view class="item-info">
				<view class="item-name-state">
					<text class="item-name uni-ellipsis">{{name}}
						<text v-if="tag" class="item-tag">{{tag}}</text>
					</text>
					<slot name="state">
						<text @tap="onIconClick" v-if="state||stateIcon" class="item-state" :style="{'background':stateBgColor,color:stateColor}">
							<text v-if="stateIcon"  class="item-state-icon iconfont" :class="stateIcon" :style="{color:stateColor,'font-size':stateIconSize}"></text>
							{{state}}
						</text>
					</slot>
				</view>
				<slot name="intro">
					<view class="item-introductions uni-ellipsis">
						<text space="ensp">{{intro}}</text>
					</view>
				</slot>
			</view>
		</view>
		<slot name="tips">
			<view v-if="tips" class="tips" :style="{color:tipsColor}">
				<text space="ensp">{{tips}}</text>
			</view>
		</slot>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	export default {
		props: {
			logo: {
				type: String,
				default: ""
			},
			logoCircle:{//圆形login
				type: Boolean,
				default: false
			},
			name: {//名称
				type: String,
				default: ""
			},
			tag: {//标签
				type: String,
				default: ""
			},
			intro:{//简介
				type: String,
				default: ""
			},
			state:{//状态
				type: String,
				default: ""
			},
			stateColor:{//状态颜色
				type: String,
				default: ""
			},
			stateBgColor:{//状态背景颜色
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
			tips: {//提示语
				type: String,
				default: ""
			},
			tipsColor:{//提示语颜色
				type: String,
				default: ""
			}
		},
		computed: {
			logoSrc() {
				if(this.logo){
					if(this.logo==this.defaultImg.logo||this.logo==this.defaultImg.user)
						return this.logo;
					else if(this.logo.indexOf("http://")==-1&&this.logo.indexOf("https://")==-1)
						return this.configData.imgDomain+this.logo+this.$imgSize.width100;
					else
						return this.logo;
				}
			},
			...mapState(["configData","defaultImg"])
		},
		methods:{
			onIconClick(){
				this.$emit("onIconClick");
			}
		}
	}
</script>

<style scoped>
	.content,.item-name-state{display: flex;align-items: center;}
	.content{height: 160upx;padding: 0upx  20upx;background: #FFFFFF;}
	.item-logo{width: 80upx;height: 80upx;margin-right:20upx;}
	.logo-circle{border-radius: 50%;}
	.item-info{flex-grow: 1;}
	.item-name-state{justify-content: space-between;}
	.item-state-icon{font-size:24upx;padding-right: 8upx;}
	.item-state{display: inline-block;height:38upx;line-height: 38upx;min-width: 94upx;padding: 0px 11upx;box-sizing: border-box; text-align: center;border-radius:19upx;font-size:24upx;font-family:PingFang-SC-Medium;font-weight:500;color:#FFFFFF;}
	.item-name{display: inline-block;max-width: 400upx;flex-grow: 1; font-size:30upx;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(0,0,0,1);padding-bottom: 7upx;}
	.item-tag{font-size:24upx;color: #6D9985;
		height:38upx;line-height:38upx;
		background:#F0F9F5
		;border-radius:50upx;
		display: inline-block;
		padding: 0px 13upx;
		/* box-sizing: border-box; */
		margin-left: 10upx;
		font-weight: normal;
	}
	.item-introductions{max-width: 550upx; font-size:24upx;font-family:PingFang-SC-Medium;font-weight:500;color:#666666;padding-top: 7upx;}
	.tips{padding:0upx 0upx 24upx 120upx;font-size:24upx;font-family:PingFang-SC-Regular;font-weight:400;color: #FC703E;background: #FFFFFF;}
</style>
