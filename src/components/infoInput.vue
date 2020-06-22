<template>
	<view class="info-input">
		<view class="info-item" :class="{'van-hairline--bottom':borderBottom}">
			<view class="info-item-title">
				<text>{{title}}</text><text v-show="required" class="required">*</text>
			</view>
			<view class="info-item-content" >
				<!-- input -->
				<input  class="content" :type="type" :value="$isEmpty(value)?'':value"  :placeholder="placeholder" placeholder-class="tips content"
				 @confirm="onConfirm" @blur="onBlur" @input="onInput" @focus="focus=true"/>
				 <view v-show="search&&focus&&searchList.length>0" class="info-input-select">
				 	<template v-for="(o,i) of searchList">
						<view :key="i" @tap="onOptionClick(o)" class="info-input-option uni-ellipsis">
							<text>{{o.name}}</text>
						</view>
					</template>
				 </view>
			</view>	
		</view>
	</view>
</template>

<script>
	export default{
		model:{//小程序的编译不支持
			prop:"value",
			event:"onInputConfirm"
		},
		props: {
			title:{type:String,default:""},
			value:{type:[String,Number]},
			type:{type:String,default:"text"},
			placeholder:{type:String,default:""},
			required:{type:Boolean,default:false},
			borderBottom:{type:Boolean,default:true},
			search:{type:Boolean,default:false},//展示实时搜索列表
			searchList:{type:Array,default(){return [];}}//搜索列表
		},
		data(){
			return {focus:false}
		},
		methods: {
			onConfirm({detail:{value}}){
				this.$emit("onInputConfirm",value);
			},
			onBlur({detail:{value}}){
				this.$emit("onInputConfirm",value);
				setTimeout(() => {
					this.focus=false;
				}, 0);
			},
			onInput({detail:{value}}){
				this.$emit("onInput",value);
			},
			onOptionClick(o){
				this.$emit("onChoose",o);
				this.focus=false;
			}
		},
	}
</script>

<style scoped>
	.info-input{width: 100%;background: #FFFFFF;}
	.info-item{position: relative;margin-left: 30upx;height: 100upx;}
	.info-item-content,.info-item{display: flex;align-items: center;justify-content: space-between;}
	.info-item-content{width: 490upx;}
	.info-bottom-border{border-bottom: 1upx solid #D8D8D8;}
	.info-item-title,.content{font-size:30upx;font-family:PingFang-SC-Medium;}
	.info-item-title{color:#6D9985;}
	.content{padding-right: 30upx;}
	.ban{color: #666666;}
	.tips{color: #999999;}
	.required{color: #FC703E;}
	input{width: 100%;font-size: 30upx;}
	.info-input-select{height: 486upx;width: 460upx;
	position: absolute;top:100upx;z-index: 10;background: #FFFFFF;
	box-shadow:0px 2upx 10upx 0px rgba(0, 0, 0, 0.15);overflow: scroll;}
	.info-input-option{font-size: 28upx;color: #666666;height: 81upx;line-height:81upx;padding: 0px 60upx;}
</style>
