<template>
	<view class="info-textarea">
		<view :class="{'info-item-textarea':true,'van-hairline--bottom':borderBottom}">
			<view class="info-item-title info-item-textarea-title van-hairline--bottom">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view class="info-item-content-textarea">
				<!-- rich-text -->
				<!--  #ifdef H5 -->
				<div  class="rich-text" v-html="value"></div>
				<!--  #endif -->
				
				<!--  #ifdef MP-WEIXIN -->
				<rich-text :nodes="value"></rich-text>
				<!--  #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			title:{type:String,default:""},
			value:{type:[Array,String],default:""},
			required:{type:Boolean,default:false},
			borderBottom:{type:Boolean,default:true},
		}
	}
</script>

<style scoped>
	.info-textarea{width: 100%;background: #FFFFFF;}
	.info-item-textarea{position: relative;}
	.info-item-textarea-title{position: relative; height: 100upx;line-height: 100upx;padding:0px 30upx;}
	.info-item-content-textarea{padding:30upx;}
	.info-item-content{width: 490upx;justify-content: space-between;}
	.info-item-title,.content{font-size:30upx;}
	.info-item-title{color:#6D9985;}
	.content{padding-right: 30upx;}
	.ban{color: #666666;}
	.tips{color: #999999;}
	.required{color: #FC703E;}
	rich-text,.rich-text{width: 100%;font-size: 30upx;min-height: 300upx;display: block;
	}
</style>
