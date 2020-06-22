<template>
	<!-- <view class="list-item">
		<view class="body">
			<view class="cover">
				<image :src="coverSrc"></image>
				<view v-if="tag" class="tag">
					<view class="tag-bg"></view>
					<text class="tag-text">{{tag}}</text>
				</view>
			</view>
			<view class="body-content">
				<view class="body-top">
					<view class="body-top-name" :style="{color:nameColor}">
						<text class="body-top-name-text">{{name}}</text>
						<img v-if="isRecommend" class="is-recommend" src="/static/img/isRecommend.png" alt="">
					</view>
					<view v-if="state" class="body-top-state" :style="{background:stateBgColor}">
						<text>{{state}}</text>
					</view>
				</view>
				<view class="body-bottom">
					<text class="body-bottom-title">{{typeTitle}}：</text>
					<text class="body-bottom-content uni-ellipsis">{{type}}</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-top" v-if="tips">
				<text class="footer-top-title" :style="{color:tipsTitleColor}">{{tipsTitle}}</text>
				<text class="footer-top-content uni-ellipsis">{{tips}}</text>
			</view>
			<view class="footer-bottom">
				<text space="ensp">{{remark}}</text>
			</view>
		</view>
	</view> -->
	<list-item-article :isRecommend="isRecommend" :name="name" :state="state" :stateBgColor="stateBgColor" :tips="remark" :tipsColor="tipsColor"
	 :globalColor="globalColor">
		<template v-slot:intro>
			<view class="intro" :style="{color:globalColor}">
				<text v-if="tag" :style="{color:globalColor}">类型：<text class="intro-type" :style="{color:globalColor}">{{tag}}</text></text>
				<text :style="{color:globalColor}">分类：<text class="intro-category" :style="{color:globalColor}">{{type}}</text></text>
			</view>
		</template>
	 </list-item-article>
</template>

<script>
import { mapState } from "vuex"

import listItemArticle from "@/components/listItemArticle.vue"
export default {
	components: {
		listItemArticle
	},
	props: {
		cover: { type: String },//封面
		name: { type: String },
		nameColor: { //简介颜色
			type: String,
			default: ""
		},
		state: { type: String },
		stateBgColor: { type: String },
		typeTitle: { type: String },
		type: { type: String },
		tipsTitle: { type: String },
		tipsTitleColor: { type: String },
		tipsColor: { type: String },
		globalColor: { type: String },
		tips: { type: String },
		remark: { type: String },
		tag: { type: String },
		isRecommend: {
			type: Number,
			default: 0
		}
	},
	computed: {
		coverSrc() {
			if (this.cover) {
				if (this.cover == this.defaultImg.course || this.cover == this.defaultImg.train || this.cover == this.defaultImg.live || this.cover == this.defaultImg.exam)
					return this.cover;
				if (this.cover.indexOf("http://") == -1 && this.cover.indexOf("https://") == -1)
					return this.configData.imgDomain + this.cover + this.$imgSize.width224;
				else
					return this.cover;
			}
		},
		...mapState(["configData", "defaultImg"])
	},
	data() {
		return {

		};
	}
}
</script>

<style lang="scss" scoped>
	.list-item {
	  background: #ffffff;
	  padding: 30upx 20upx 20upx;
	}
	.is-recommend {
	  width: 32upx;
	  height: 32upx;
	  margin-left: 6upx;
	  vertical-align: middle;
	}

	.body {
	  $hbody: 130upx;
	  display: flex;
	  margin-bottom: 35upx;

	  .cover {
	    width: 230upx;
	    height: $hbody;
	    position: relative;
	    image {
	      width: 100%;
	      height: 100%;
	    }
	    .tag {
	      position: absolute;
	      top: 0px;
	      left: 0px;
	      padding: 7upx 9upx;
	      border-radius: 4upx;
		  font-size: $font-size-20;
		   color: #ffffff;
		  &-text{
			  position: relative;z-index: 2;
		  }
		  &-bg{
			  background: #000000;
			  opacity: 0.25;
			  position: absolute;
			  width: 100%;height: 100%;
			  top: 0px;
			  left: 0px;
			  z-index: 1;
		  }
	    }
	  }

	  &-content {
	    width: 460upx;
	    flex-grow: 1;
	    height: $hbody;
	    margin-left: 20upx;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	  }

	  &-top {
	    display: flex;
	    justify-content: space-between;

	    &-name {
	      font-size: $font-size-30;
	      width: 360upx;
	      flex-grow: 1;
		  display: flex;align-items: flex-end;
	     &-text{
			 // 两行省略
			 text-overflow: -o-ellipsis-lastline;
			 overflow: hidden;
			 text-overflow: ellipsis;
			 display: -webkit-box;
			 -webkit-line-clamp: 2;
			 line-clamp: 2;
			 -webkit-box-orient: vertical;
		 }
	    }

	    &-state {
	      $hstate: 38upx;
	      font-size: $font-size-24;
	      width: 94upx;
	      height: $hstate;
	      line-height: $hstate;
	      color: #ffffff;
	      background: #ffae00;
	      border-radius: 19upx;
	      text-align: center;
	    }
	  }

	  &-bottom {
	    font-size: $font-size-24;

	    &-title {
	      color: $color-999;
	    }

	    &-content {
	      color: $color-main;
	      display: inline-block;
	      width: 340upx;
	      vertical-align: top;
	    }
	  }
	}

	.footer {
	  font-size: $font-size-24;

	  &-top {
	    margin-bottom: 20upx;

	    &-title {
	      color: $color-666;
	    }

	    &-content {
	      display: inline-block;
	      width: 590upx;
	      vertical-align: top;
	      color: #fc703e;
	    }
	  }

	  &-bottom {
	    color: $color-999;
	  }
	}
	
	.intro{
		height: 30upx;
		padding: 25upx 0px 25upx;
		font-size: 24upx;
		color: #666666;
		&-type{color: #FC703E;margin-right: 30upx;}
		&-category{color: #6D9985;}
		&-colse{
			color: #999999;
		}
	}
</style>
