<template>
	<view class="info-picker">
		<view :class="{'info-item':true,'van-hairline--bottom':borderBottom}">
			<view class="info-item-title">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view class="info-item-content">
				<!-- picker -->
				<template v-if="mode">
					<data-picker class="info-item-content" ref="picker" :mode="mode" :start="start" :end="end" :dataList="dataList" :value="value" @onPickerChoose="onPickerChoose">
						<view class="info-item-content" @tap="onPickerClick">
							<text class="content uni-ellipsis" :class="{'tips':!value&&!text}">{{text||value||placeholder}}</text>
							<text class="iconfont icongengduo content tips"></text>
						</view>
					</data-picker>
				</template>
				<template v-else>
					<view class="info-item-content" @tap="onPickerClick">
						<text class="content  uni-ellipsis" :class="{'tips':!value&&!text}">{{text||value||placeholder}}</text>
						<text class="iconfont icongengduo content tips"></text>
					</view>
					<data-picker  ref="picker" buttonTop :showChoose="showChoose" :showSearch="showSearch" showResetBtn :value="value" :dataList="dataList" @onPickerChoose="onPickerChoose" :banEmpty="required"></data-picker>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import dataPicker from "./dataPicker.vue"

	export default {
		components: {
			dataPicker
		},
		props: {
			title:{type:String,default:""},
			value:{type:[String,Number,Array],default:""},
			text:{type:[String,Number],default:""},
			placeholder:{type:String,default:""},
			mode:{type:String},
			start:{type:String},//mode = date,表示有效时间范围的开始
			end:{type:String},//mode = date时,表示有效时间范围的结束
			borderBottom:{type:Boolean,default:true},
			required:{type:Boolean,default:false},//必填项，//是否禁止空选择(未选择不可点击确定)
			showChoose:{type:Boolean,default:false},//是否显示选择结果，作用于datapicker组件
			showSearch: { type: Boolean, default: false },//是否使用搜索，作用于datapicker组件
			target:{type:Object},//选择器将影响的数据对象
			dataList: {
				type: Array,//mode无值或为selector时有效。数组元素需包含name、value属性
			},
		},
		methods: {
			onPickerClick(){
				this.$refs.picker.show(this.target);
			},
			onPickerClose(){
				this.$refs.picker.onClose();
			},
			onReset(){
				this.$refs.picker.onReset();
			},
			/**picker选中完毕
			 * @param {Object} choose
			 */
			onPickerChoose(choose) {
				this.$emit("onPickerChoose",choose);
			}
		}
	}
</script>

<style scoped>
	.info-picker{width: 100%;background: #FFFFFF;}
	.info-item {
		position: relative;
		margin-left: 30upx;
		height: 100upx;
	}

	.info-item-content,
	.info-item {
		display: flex;
		align-items: center;justify-content: space-between;
	}

	.info-item-content {
		width: 490upx;
		justify-content: space-between;
	}
	.info-item-title,
	.content {
		font-size: 30upx;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
	}

	.info-item-title {
		color: #6D9985;
	}

	.content {
		padding-right: 30upx;
	}

	.ban {
		color: #666666;
	}

	.tips {
		color: #999999;
	}
	.required {
		color: #FC703E;
	}
</style>

