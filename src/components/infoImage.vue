<template>
	<view class="info-image">
		<view :class="{'info-item-image':!horizontal,'info-item-image-horizontal':horizontal,'van-hairline--bottom':borderBottom}">
			<view class="info-item-title">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view :class="{'info-item-content-image':!horizontal,'info-item-content-image-horizontal':horizontal}">
				<!-- image -->
				<view :class="{'info-item-content-image':!horizontal,'info-item-content-image-horizontal':horizontal}">
					<template v-if="images.length==0">
							<view class="image-view" :style="{width:getWidth(width||height),height:getHeight(height||width)}" @tap="onImageClick()">
								<text v-if="canUpload&&!value" class="iconfont iconchuangjian tips"></text>
								<image v-if="value" :src="getImage()"></image>
							</view>
					</template>
					<template v-else>
						<template v-for="(img,k) of images">
							<view :key="k" class="image-view" :style="{width:getWidth(img.width||width||height),height:getHeight(img.height||height||width)}"
							 @tap="onImageClick(img)">
								<text v-if="canUpload&&!img.value" class="iconfont iconchuangjian tips"></text>
								<image v-if="img.value" :src="getImage(img)"></image>
							</view>
						</template>
					</template>
					<text v-if="canUpload&&placeholder" class="content tips">{{placeholder}}</text>
				</view>
			</view>
		</view>	
	</view>
</template>
<script>
	import publicApi from "../api/modules/public.js"
	
	import {mapState} from "vuex"
	
	import dataPicker from "./dataPicker.vue"
	
	export default{
		components: {
			dataPicker
		},
		model:{
			prop:"value",
			event:"imageChoose"
		},
		props: {
			title:{type:String,default:""},
			value:{type:String,default:""},
			placeholder:{type:String,default:""},
			required:{type:Boolean,default:false},
			width:{type:Number},
			height:{type:Number},
			uploadType:{type:Number},
			path:{type:String},
			borderBottom:{type:Boolean,default:true},
			horizontal:{type:Boolean,default:false},
			canUpload:{type:Boolean,default:false},
			images: {type: Array,default(){return []}
			// 至少包含value，key
			},
		},
		computed: {
			...mapState(["configData","defaultImg"])
		},
		methods: {
			getImage: function(img) {
				let src=undefined;
				let width=0,height=0;
				if(img){
					src=img.value;
					width=img.width||this.width||img.height||this.height;
					height=img.height||this.height||img.width||this.width;
				}else{
					src=this.value;
					width=this.width||this.height;
					height=this.height||this.width;
				}
				if(this.$isEmpty(src)) return "";
				if(src==this.defaultImg.logo||src==this.defaultImg.user)
					return src;
				if(src.indexOf("http://")==-1&&src.indexOf("https://")==-1)
					return this.configData.imgDomain+src+this.$getImgSize(width,height);
				return src;
			},
			getWidth: function(width){
				// #ifdef H5
				return width+"upx";
				// #endif
				// #ifdef MP-WEIXIN
				return width+"rpx";
				// #endif
			},
			getHeight(height){
				// #ifdef H5
				return height+"upx";
				// #endif
				// #ifdef MP-WEIXIN
				return height+"rpx";
				// #endif
			},
			/**图片点击
			 */
			async onImageClick(target){
				let obj=target||this;
				if(!this.canUpload)return;
				this.$store.dispatch("setUploadImage",obj.path||this.path||"/user/user/photo").then(url=>{
					if(target){
						this.$set(target,"value",url);
						this.$emit("imageChoose",{key:target.key,value:url});
					}
					else
						this.$emit("imageChoose",url);
				});
			}
		}
	}
</script>

<style scoped>
	.info-image{width: 100%;background: #FFFFFF;}
	.info-item-image,.info-item-image-horizontal{position: relative;}
	.info-item-content,.image-view,.info-item-content-image,.info-item-image-horizontal,.info-item-content-image-horizontal{display: flex;align-items: center;}
	.info-item-content,.image-view,.info-item-image-horizontal{justify-content: space-between;}
	.info-item-image,.info-item-image-horizontal{margin-left: 30upx;}
	.info-item-image{padding: 36upx 0px 30upx;}
	.info-item-content{width: 490upx;justify-content: space-between;}
	.info-item-title,.content{font-size:30upx;font-family:PingFang-SC-Medium;font-weight:500;}
	.info-item-title{color:#6D9985;}
	.info-item-image>.info-item-title{margin-bottom: 40upx;}
	.content{padding-right: 30upx;}
	.ban{color: #666666;}
	.tips{color: #999999;}
	image{width: 100%;height: 100%;}
	.required{color: #FC703E;}
	.image-view{justify-content: center;
		margin-right:29upx;
		border:1px dashed #CCCCCC;border-radius:10px;text-align: center;width: 210upx;height: 297upx;}
	.info-item-content-image{width: 100%;}
	.info-item-content-image-horizontal{width: 490upx;}
	.info-item-content-image-horizontal>.image-view{margin:30upx 29upx 30upx 0upx;}
</style>
