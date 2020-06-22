<template>
	<view class="content">
		<image class="headimg" :src="headimgSrc"></image>
		<view class="info">
			<view class="info-top">
				<view class="name-sex">
					<text class="name uni-ellipsis">{{name}}</text>
					<text class="sex iconfont" :class="{'iconnan-':sex==1,'iconnv-':sex==2}"></text>
				</view>
				<slot name="remark">
					<view v-if="remark" class="remark">
						<text>{{remark}}</text>
					</view>
				</slot>
			</view>
			<view v-if="tagList" class="tag-list">
				<text v-for="(tag,i) of tagList" class="tag" :key="i">{{tag}}</text>
			</view>
			<view v-if="interviewTime" class="interview-time">
				<text>面试时间：{{interviewTime}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	export default {
		props: {
			sex: {
				type: Number,
				default: 1//1男2女其它不知道
			},
			name:{type:String,default:""},
			headimg:{type:String,default:""},
			remark:{type:String,default:""},
			interviewTime:{type:String,default:""},
			tagList:{type:Array,default:undefined}
			
		},
		data() {
			return {
				
			};
		},
		computed: {
			headimgSrc() {
				if(this.headimg){
					if(this.headimg==this.defaultImg.headimg||this.headimg==this.defaultImg.user)
						return this.headimg;
					else if(this.headimg.indexOf("http://")==-1&&this.headimg.indexOf("https://")==-1)
						return this.configData.imgDomain+this.headimg+this.$imgSize.width100;
					else
						return this.headimg;
				}
			},
			...mapState(["configData","defaultImg"])
		},
	}
</script>

<style scoped lang="scss">
.content,.name-sex,.info-top{display: flex;}
.content{background: $color-white;padding: 40upx 20upx;}
.info{margin-left: 30upx;flex-grow: 1; display: flex;flex-direction: column;justify-content: space-between;}
.headimg{
	$len:100upx;
	height: $len;width: $len;
	border-radius: 50%;
}
.name-sex{margin-bottom: 10upx; align-items: center;}
.name{display: inline-block; font-size: $font-size-36;font-weight: bold;}
.sex{font-size: $font-size-20;margin-left: 10upx;}
.tag{
	$height: 44upx;
	display: inline-block;
	height:$height;line-height:$height;
	font-size: $font-size-26;
	background-color: $color-f2;
	color: $color-666;
	border-radius:22upx;
	padding: 0upx 19upx;
	margin-right: 16upx;
}
.interview-time{
	font-size: $font-size-28;
}
.remark{
	flex-grow: 1;
	color: $color-999;
	font-size: $font-size-24;
	text-align: right;
}
	
</style>
