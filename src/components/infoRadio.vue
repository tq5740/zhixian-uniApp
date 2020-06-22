<template>
	<view class="info-radio">
		<view class="info-item" :class="{'van-hairline--bottom':borderBottom}">
			<view class="info-item-title">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view class="info-item-content" >
				<!-- radio -->
				<radio-group @change="radioChange">
					<template v-for="(v,i) of options">
						<label class="radio" :key="i">
							<radio :value="v.value.toString()" :disabled="disabled" color="#42B983" :checked="v.checked||v.value==value" />
							<text>{{v.text}}</text>
						</label>
					</template>
				</radio-group>
			</view>	
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			title:{type:String,default:""},
			value:{type:[String,Number]},
			required:{type:Boolean,default:false},
			disabled:{type:Boolean,default:false},
			borderBottom:{type:Boolean,default:true},
			options:{type:Array,default(){return [];}},
		},
		data(){
			return {focus:false}
		},
		methods: {
			radioChange({detail:{value}}){
				this.$emit("onRadioChange",value);
			}
		},
	}
</script>

<style scoped lang="scss">
	.info-radio{width: 100%;background: #FFFFFF;}
	.info-item{position: relative;margin-left: 30upx;height: 100upx;}
	.info-item-content,.info-item,radio-group{display: flex;align-items: center;justify-content: space-between;}
	.info-item-content{width: 490upx;}
	.info-item-title{font-size:30upx;font-family:PingFang-SC-Medium;color:#6D9985;}
	.required{color: #FC703E;}
	radio-group{width: 100%;padding-right: 20upx;}
	.radio{font-size:$font-size-30 ;flex-grow: 1;}
</style>
