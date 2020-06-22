<template>
	<view v-show="showFlag" class="bottom-btn-list">
		<view class="mark" @tap="hide" @touchmove.stop.prevent="onMove"></view>
		<view class="btn-more-view" @touchmove.stop.prevent="onMove">
			<template v-for="(b,i) of btnList" >
				<view class="btn-more-item" :class="{'btn-more-item-last':btnList.length==i+1,'btn-more-item-center':!!b.center}"
				 :key="i" @tap="onBtnClick(b)">
					<text class="iconfont" :class="b.icon" :style="{color:b.iconColor||b.color}"></text>
					<text :style="{color:b.textColor||b.color}">{{b.text}}</text>
				</view>
			</template>
			<view class="cancle" @tap="hide">
				<text>取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			btnList:{//按钮列表
				type:Array,//[{text:"按钮名",icon:"按钮icon",key:"按钮key",disable:"为真时，不会触发点击事件",color:"按钮颜色"}]
				default(){return []}
			}
		},
		data() {
			return {
				showFlag:false
			};
		},
		methods: {
			show() {
				this.showFlag=true;
			},
			hide(){
				this.showFlag=false;
				this.$emit("onHide");
			},
			onMove(){},
			onBtnClick(btn){
				if(btn.disable)return;
				this.hide();
				this.$emit("onBtnClick",btn);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.mark{z-index: 11;position: fixed;}
	.btn-more-view{
		font-family:PingFang-SC-Medium;font-weight:500; width: 100%; position: fixed;bottom: 0px;z-index: 11; background: #FFFFFF;
		.btn-more-item{
			height: 100upx;line-height: 100upx; margin-left: 30upx;font-size:30upx;border-bottom: 1upx solid #D8D8D8;
			>.iconfont{margin-right: 24upx;}
			&-last{border:none}
			&-center{text-align: center;margin-left: 0px;}
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
