<template>
	<view class="article-detail">
		<view v-show="getData" class="article">
			<view class="title">
				<text>{{article.articleTitle||''}}</text>
			</view>
			<view class="info van-hairline--bottom">
				<text class="info-time">{{$formatDate(article.createTime,"YYYY-MM-DD")}}</text>
				<text class="info-creater">{{article.createUserName||''}}</text>
			</view>
			<view class="content">
				<!--  #ifdef H5 -->
				<div v-html="$escape2Html(article.intro)"></div>
				<!--  #endif -->
				<!--  #ifdef MP-WEIXIN -->
				<rich-text :nodes="article.intro | getIntro"></rich-text>
				<!--  #endif -->
			</view>
			<view class="footer">
				<text class="browseNumber">浏览量：{{articleStatistics.browseNumber}}</text>
			</view>
		</view>
		<no-data :isNoData="!getData"></no-data>
	</view>
</template>

<script>
import artApi from "../../../../api/modules/article.js"
export default {
	data() {
		return {
			article: {},
			articleStatistics: {},
			getData: false
		}
	},
	filters: {
		getIntro: function (value) {
			return decodeURIComponent(value);
		}
	},
	onLoad({
		articleId
	}) {
		uni.showLoading();
		this.id = articleId;
		artApi.getQueryArticleAdmin(articleId).then(async data => {
			this.$updateNavbarTitle(data.articleTitle)
			this.article = data;
			this.articleStatistics = data.articleStatistics;
			uni.hideLoading();
			this.getData = true;
		}).catch(err => {
			uni.hideLoading();
			uni.showToast({
				title: typeof err == "string" ? err : JSON.stringify(err),
				icon: "none"
			})
		})
	},
	methods: {

	}
}
</script>

<style>
	page {
	  box-sizing: border-box;
	}
	.article-detail {
	  padding: 20upx;
	}
	.title {
	  font-size: 40upx;
	  font-family: PingFang-SC-Heavy;
	  font-weight: 800;
	}
	.info {
	  margin-top: 15upx;
	  padding-bottom: 15upx;
	  position: relative;
	}
	.info-time {
	  font-size: 22upx;
	  color: #999999;
	}
	.info-creater {
	  font-size: 26upx;
	  color: #42b983;
	  margin-left: 29upx;
	}
	.browseNumber {
	  font-size: 28upx;
	  color: #999999;
	  margin-top: 50upx;
	}
</style>
