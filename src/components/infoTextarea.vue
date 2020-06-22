<template>
	<view class="info-textarea">
		<view :class="{'info-item-textarea':true,'van-hairline--bottom':borderBottom}">
			<view class="info-item-title info-item-textarea-title van-hairline--bottom">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view class="info-item-content-textarea">
				<!-- textarea -->
			<view v-if="showTextarea">
				<!-- v-if避免苹果左边margin处显示textarea文本内容 -->
					<textarea  :focus="focus" @blur="onBlur" @confirm="onConfirm" :value="value" :placeholder="placeholder" :auto-height="true" :disabled="disabled" maxlength="-1" placeholder-class="tips content" />
			</view>
				<text  @tap="onShowTextArea" class="textarea-text" :class="{'tips':!value,'content':!value,'hidden':showTextarea}">{{value||placeholder}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		model:{
			prop:"value",
			event:"onTextAreaConfirm"
		},
		props: {
			title:{type:String,default:""},
			value:{type:String,default:""},
			placeholder:{type:String,default:""},
			required:{type:Boolean,default:false},
			borderBottom:{type:Boolean,default:true},
			disabled:{type:Boolean,default:false},
		},
		data() {
			return {
				showTextarea: false,//解决textarea层级过高的问题
				focus:false
			}
		},
		methods: {
			onConfirm({detail:{value}}){
				this.$emit("onTextAreaConfirm",value);
			},
			onBlur({detail:{value}}){
				this.showTextarea=false;
					this.focus=false;
				this.$emit("onTextAreaConfirm",value);
			},
			onShowTextArea(){
				this.showTextarea=true;
				setTimeout(()=>{
					this.focus=true;
				},100);
			}
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
	textarea{width: 100%;min-height: 300upx; font-size: 30upx;font-weight: normal;
		/* #ifdef MP-WEIXIN */
		padding: 0px;margin: 0px; border: none;border-radius: 0px;
		/* #endif */
	}
	.textarea-text{
		display: block;
		width: 100%;min-height: 300upx; font-size: 30upx;
		padding: 0px;margin: 0px; border: none;border-radius: 0px;
		position: relative;top: -1upx;
	}
	.hidden{
		display: none;
	}
</style>
