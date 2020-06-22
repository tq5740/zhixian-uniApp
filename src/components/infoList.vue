<template>
	<view class="infolist">
		<view class="info-list">
			<block v-for="(v,i) of infolist" :key="i">
				<template v-for="(vv,j) of v">
					<view :key="vv.title" :class="{'block':(v.length-1)==j && (infolist.length-1)!=i}">
						<!-- text -->
						<template v-if="vv.el=='text'">
							<info-text :title="vv.title" :value="vv.value" :required="vv.required"></info-text>
						</template>
						<!-- input -->
						<template v-if="vv.el=='input'">
							<info-input :title="vv.title" :value="vv.value" :placeholder="vv.placeholder" :type="vv.type" :required="vv.required" @onInputConfirm="inputConfirm($event,vv)"></info-input>
						</template>
						<!-- picker -->
						<template v-if="vv.el=='picker'">
							<info-picker :title="vv.title" :value="vv.value" :placeholder="vv.placeholder" :text="vv.text" :mode="vv.mode" :dataList="vv.data" :required="vv.required" @onPickerChoose="onPickerChoose($event,vv)"></info-picker>
						</template>
						<!-- image -->
						<template v-if="vv.el=='image'">
							<info-image :title="vv.title" :value="vv.value" :placeholder="vv.placeholder" :images="vv.images" :width="vv.width" :height="vv.height" :horizontal="vv.horizontal" :borderBottom="vv.borderBottom" :canUpload="vv.canUpload" :path="vv.path" :required="vv.required" :uploadType="vv.uploadType" @imageChoose="imageChoose($event,vv)"></info-image>
						</template>
						<!-- textarea-->
						<template v-if="vv.el=='textarea'">
							<info-textarea :title="vv.title" :value="vv.value" :disabled="vv.disabled" :required="vv.required" @onTextAreaConfirm="inputConfirm($event,vv)"></info-textarea>
						</template>
						<!--  rich-text -->
						<template v-if="vv.el=='richtext'">
							<info-richtext :title="vv.title" :value="vv.value" :required="vv.required"></info-richtext>
						</template>
					</view>
				</template>
			</block>
		</view>
		<view v-if="showBtn" class="info-item-savebtn">
			<text class="info-item-btn">{{btnText}}</text>
		</view>
	</view>
</template>

<script>
	import publicApi from "@/api/modules/public.js"
	import infoImage from "@/components/infoImage.vue";
	import infoInput from "@/components/infoInput.vue";
	import infoPicker from "@/components/infoPicker.vue";
	import infoRichtext from "@/components/infoRichtext.vue";
	import infoText from "@/components/infoText.vue";
	import infoTextarea from "@/components/infoTextarea.vue";
	
	
	export default{
		components: {
			infoImage,infoInput,infoPicker,infoRichtext,infoText,infoTextarea
		},
		props: {
			infolist: {
				type: Array,
				default(){
					// 说明：infolist=[[{}]]
					// infolist是二维数组，第一层数组用于信息展示分块
					// title:信息标题
					// el:标签类型——text、input、textare、image、picker
					// required：Boolean，是否必填的*号显示
					// value：信息值
					// placeholder：提示内容
					// disabled:是否禁用，textarea有效
					// horizontal：Boolean，image时有效，是否水平展示
					// images：图片数组，image有效，用于同行展示多个图片
					// width、height：宽高，image时有效
					// text：信息展示内容picker时有效，
					// mode：picker有效，选择器类型，此时data失效
					// data：数组，picker且mode无值时有效。数组元素需包含name、value属性
					// key：getData方法返回对象对应值的key
					return []}
			},
			showBtn:{type:Boolean,default:false},
			btnText:{type:String,default:''}
		},
		data() {
			return {
			}
		},
		methods: {
			getData() {
				let data={};
				for (let v of this.infolist) {
					for (let vv of v) {
						if(vv.required&&this.$isEmpty(vv.value)){
							uni.showToast({
								icon:"none",
								title:`请填写${vv.title}`
							});
							return undefined;
						}
						if(vv.key)
							data[vv.key]=vv.value;
						if(vv.images){
							for (let img of vv.images) {
								if(img.required&&!img.value){
									uni.showToast({
										icon:"none",
										title:`请上传${img.title}`
									});
									return undefined;
								}
								if(img.key)
									data[img.key]=img.value;
							}
						}
					}
				}
				return data;
			},
			/**picker选中完毕
			 * @param {Object} choose
			 */
			onPickerChoose(choose,target){
				this.$set(target,"value",choose.value);
				this.$set(target,"text",choose.text);
			},
			inputConfirm(value,target){
				target.value=value;
			},
			imageChoose(value,target){
				target.value=value;
			}
		}
	}
</script>

<style scoped lang="scss">
	.infolist{background: $color-f2;}
	.block{
		margin-bottom: 20upx;
	}
</style>
