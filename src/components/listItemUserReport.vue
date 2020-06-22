<template>
	<view class="user-report">
		<list-item  @onItemClick="onItemClick" :item="item">
			<template v-slot:content>
				<view class="data-item">
					<image :src="getImage(img)"></image>
					<view class="data-item-info">
						<view class="data-item-info-name uni-ellipsis">
							<text>{{name}}</text>
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
						</view>
					</view>
					<view class="data-item-state" :style="{background:stateBg}">
						<text>{{state}}</text>
					</view>
				</view>
			</template>
			<template v-slot:footer>
				<view class="data-footer van-hairline--top">
					<text space="emsp"> 测试成绩：</text>
					<text class="score">{{score}} </text>
					<text>最后学习时间：{{lastTime > 0 ? $formatDate(lastTime,"YYYY-MM-DD hh:mm:ss") : "未开始学习"}}</text>
				</view>
			</template>
		</list-item>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	export default {
		props: {
			item:{
				type:Object,
				default:undefined
			},
			name: {
				type: String,
				default: ""
			},
			img: {
				type: String,
				default: ""
			},
			progress:{
				type:Number,
				default:0
			},
			length:{
				type:Number,
				default:0
			},
			state: {
				type: String,
				default: ""
			},
			stateBg: {
				type: String,
				default: ""
			},
			score:{
				type:Number,
				default:0
			},
			lastTime:{
				type:Number,
				default:0
			},
			
		},
		data() {
			return {
			};
		},
		computed: {
			...mapState(["configData","defaultImg"])
		},
		methods: {
			onItemClick(item){
				this.$emit("onItemClick",item);
			},
			getImage: function(value) {
				if(!value) return "";
				if(value==this.defaultImg.logo||value==this.defaultImg.user)
					return value;
				else if(value.indexOf("http://")==-1&&value.indexOf("https://")==-1)
					return this.configData.imgDomain+value+this.$imgSize.width100;
				return value;
			},
			getWidth(v){
				return uni.upx2px(v)+"px";
			}
		},
	}
</script>

<style lang="scss" scoped>
	image{
		width: 80upx;height: 80upx;border-radius: 50%;margin-right: 20upx;
	}
	.data-item{
		background: #FFFFFF;padding: 40upx 20upx;font-size: $font-size-24;
		display: flex;
		&-info{
			flex-grow: 1;
			display: flex; flex-direction: column; justify-content: space-between;
			&-name{
				font-size:$font-size-30;font-weight:bold;
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
			.duration{
				&-title{
					color: $color-666;
				}
				&-time{
					color: #FC703E;
				}
			}
			
		}
		
		}
		&-state{
			$h:38upx;
			background: $color-main;
			width: 94upx;height: $h;line-height: $h;text-align: center;color: #FFFFFF; border-radius: 19upx;
		}
	}
	.data-footer{
		$h:80upx;
		position: relative;
		padding: 0px 20upx;
		background: #FFFFFF;
		height: $h;line-height: $h;
		font-size: $font-size-24;color: $color-999;
		.score{
			color:#6D9985;
			margin-right: 30upx;
		}
	}
</style>
