<template>
	<view class="listitem">
		<view class="listitem-content" @tap="onItemClick">
			<slot name="content"></slot>
		</view>
		<view class="footer" v-show="showFooter">
			<slot name="footer">
				<view v-if="btnNum>0" class="bottom-btn van-hairline--top" :style="{background: footerBgColor}">
					<view v-for="(b,i) of btnList1" class="item-btn " :class="{'van-hairline--right':i!=btnNum-1}"  :key="i" @tap="onBtnClick(b)">
						<text class="iconfont" :class="b.icon" :style="{color:b.iconColor||b.color}"></text><text :style="{color:b.textColor||b.color}">{{b.text}}</text>
					</view>
					<view v-if="btnNum>3" class="btn-more" @tap="onShowMoreBtn">
						<text class="iconfont icongengduocaozuo"></text>
					</view>
				</view>
			</slot>
		</view>
		<bottom-btn-list ref="moreBtn" @onBtnClick="onBtnClick" :btnList="btnList2"></bottom-btn-list>
	</view>
</template>

<script>
	import bottomBtnList from "@/components/bottomBtnList.vue"
	export default {
		components: {
			bottomBtnList
		},
		props: {
			item:{//当前元素
				type:Object,
				default(){return {}}
			},
			btnList:{//按钮列表
				type:Array,//[{text:"按钮名",icon:"按钮icon",key:"按钮key",disable:"为真时，不会触发点击事件",color:"按钮颜色"}]
				default(){return []}
			},
			footerBgColor:{
				type:String,
				default:""
			},
			showFooter:{
				type:Boolean,
				default:true
			}
		},
		computed: {
			btnNum(){
				return this.btnList.length;
			},
			btnList1(){
				return this.btnList.slice(0,3);
			},
			btnList2(){
				return this.btnList.slice(3,this.btnList.length);
			}
		},
		data() {
			return {
			}
		},
		methods: {
			/**
			 * 列表元素点击
			 */
			onItemClick(){
				this.$emit("onItemClick",this.item);
			},
			/**按钮点击
			 * @param {Object} btn
			 */
			onBtnClick(btn){
				if(btn.disable)return;
				this.$emit("onBtnClick",{btn:btn,item:this.item});
			},
			onMove(){},
			onShowMoreBtn(){
				this.$refs.moreBtn.show();
			}
		}
	}
</script>

<style scoped lang="scss">
	.listitem{background-color: #ededed;padding-bottom: 20upx;}
	.bottom-btn{display: flex;align-items: center;padding: 30upx 0px;background: #FFFFFF;font-size:26upx;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(102,102,102,1); position: relative;}
	.item-btn>.iconfont{font-size: 30upx;padding-right: 13upx;}
	.btn-border-right{border-right: 1upx solid rgba(216,216,216,1) ;}
	.item-btn {text-align: center;align-items: center; flex-grow: 1; position: relative;}
	.btn-more{padding:0px 32upx;}
	.tips{padding:0upx 0upx 24upx 120upx;font-size:24upx;font-family:PingFang-SC-Regular;font-weight:400;color: #FC703E;background: #FFFFFF;}
	.mark{z-index: 10;position: fixed;}
	.btn-more-view{
		font-family:PingFang-SC-Medium;font-weight:500; width: 100%; position: fixed;bottom: 0px;z-index: 11; background: #FFFFFF;
		.btn-more-item{
			height: 100upx;line-height: 100upx; margin-left: 30upx;font-size:30upx;border-bottom: 1upx solid #D8D8D8;
			>.iconfont{margin-right: 24upx;}
			&-last{border:none}
		}
	}
	.cancle{
		$h:100upx;
		font-size:32upx;
		padding-top: 20upx;
		background: $color-f2;
		text{
				display: block;height: $h;text-align: center;line-height: $h;
				background: #FFFFFF;
			}
	}
</style>
