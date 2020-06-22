<template>
	<view class="data-item" @tap="onItemClick">
			<view class="data-item-info">
				<view class="data-item-info-name">
					<text>{{title}}</text>
				</view>
				<view class="data-item-info-study">
					<view class="progress">
						<text class="progress-out"><text class="progress-in" :style="{width:getWidth(progress)}"></text></text>
						<text class="progress-text">{{progress||0}}%</text>
					</view>
					<view class="duration">
						<text class="duration-title">学习时长：</text>
						<text class="duration-time">{{$formatDuration(length)}}</text>
					</view>
					<view class="score">
						<text class="score-title">测试成绩：</text>
						<text class="score-text">{{isNaN(score)?"-":score}}</text>
					</view>
				</view>	
				<view class="study-time">
					<view class="study-time-start">
						<text>{{time1Title}}{{getTimeString(time1)}}</text>
					</view>
					<view v-if="time2" class="study-time-last">
						<text>{{time2Title}}{{getTimeString(time2)}}</text>
					</view>
				</view>
			</view>
			<view class="data-item-state" :style="{background:stateBg}">
				<text>{{state}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item:{
				type:Object,
				default:undefined
			},
			title:{type:String,default:""},
			progress:{
				type:Number,
				default:0
			},
			length:{
				type:Number,
				default:0
			},
			score:{
				type:Number,
				default:0
			},
			time1:{
				type:Number | String,
				default:0
			},
			time2:{
				type:Number | String,
				default:undefined
			},
			time1Title: {
				type: String,
				default: "开始学习时间："
			},
			time2Title: {
				type: String,
				default: "最后学习时间："
			},
			state: {
				type: String,
				default: ""
			},
			stateBg: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			onItemClick(item){
				this.$emit("onItemClick",this.item);
			},
			getWidth(v){
				return uni.upx2px(v)+"px";
			},
			getTimeString(time){
				if(time>0){
					return this.$formatDate(time,"YYYY-MM-DD hh:mm:ss");
				}else return time
			}
		},
	}
</script>

<style lang="scss" scoped>
	.data-item{
		background: #FFFFFF;
		padding: 30upx 20upx 20upx;
		font-size: $font-size-24;
		margin-bottom: 20upx;
		display: flex;
		&-info{
			width: 610upx;
			display: flex; flex-direction: column; justify-content: space-between;
			&-name{
				font-size:$font-size-30;font-weight:bold;
				margin-bottom: 33upx;
			}
			&-study{
				display: flex;
				.progress{
					display: flex;align-items:center;
					margin-right: 29upx;
					&-out{
						position: relative;
						display: inline-block;
						width: 100upx;height: 8upx;border-radius: 4upx;background: #D8D8D8;margin-right: 11upx;
					}
					&-in{
						position: absolute;left: 0px;top: 0px;
						display: inline-block;
						width: 50upx;
						height: 8upx;border-radius: 4upx;background:linear-gradient(90deg,#FFAE00 0%,#FC703E 100%);
					}
					&-text{
						color: #FC703E;
					}
				}
			}
			.duration{
				&-title{
					color: $color-666;
				}
				&-time{
					color: #FC703E;margin-right: 30upx;
				}
			}
			.score{
				&-title{
					color: $color-666;
				}
				&-text{
					color: #6D9985;
				}
			}
			.study-time{
				color:$color-999;
				>view{
					padding-top: 20upx;
				}
			}		
		}
		&-state{
			$h:38upx;
			background: $color-main;
			width: 94upx;height: $h;line-height: $h;text-align: center;color: #FFFFFF; border-radius: 19upx;
		}
	}
</style>
