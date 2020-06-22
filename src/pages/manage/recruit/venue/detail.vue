<template>
	<view class="venue-detail">
		<view class="venue-info">
			<view class="venue-info-name">
				<text>{{venueTitle}}</text>
			</view>
			<view class="venue-info-time">
				<text>{{datetime}}</text>
			</view>
			<view class="venue-info-address van-hairline--top">
				<text class="iconfont icondizhi"></text>
				<text class="venue-info-address-text uni-ellipsis">{{address}}</text>
				<text class="iconfont icongengduo"></text>
			</view>
		</view>
		<view class="venue-intro">
			<rich-text :nodes="intro"></rich-text>
		</view>
		<view class="venue-notice">
			<view class="venue-notice-title van-hairline--bottom">
				<text>参会须知</text>
			</view>
			<view class="venue-notice-text">
				<text>{{notice}}</text>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn-left">
				<view class="bottom-btn-left-btn van-hairline--right">
					<text class="iconfont iconzaixiankefu1"></text>
					<text>咨询</text>
				</view>
				<view v-if="regState==0" class="bottom-btn-left-btn van-hairline--right">
					<text class="iconfont iconzhanwei"></text>
					<text>展位</text>
				</view>
			</view>
			<view  @tap="onToWorkListClick"  class="bottom-btn-right">
				<text>招聘职位</text>
			</view>
		</view>
	</view>
</template>

<script>
	
		import workApi from "@/api/modules/work.js"
	export default {
		data() {
			return {
				regState:1,// 0：已报名 1：未报名
				venueId:undefined,
				venueTitle:undefined,
				datetime:undefined,
				address:undefined,
				notice:undefined,
				intro:undefined,
			}
		},
		onLoad({id,regState}) {
			this.$updateNavbarTitle("招聘会");
			this.regState=regState;
			workApi.getQueryenueAdmin(id).then(v=>{
				this.venueId=v.venueId;
				this.venueTitle=v.venueTitle;
				this.datetime=this.$formatDate(v.startDate,"MM-DD")+"~"+this.$formatDate(v.endDate,"MM-DD")+" "+v.period;
				this.address=v.address;
				this.notice=v.notice;
				this.intro=decodeURIComponent(v.intro);
			});
		},
		methods: {
			onToWorkListClick(){
				uni.navigateTo({
					url:`/pages/manage/recruit/venue/signup?id=${this.venueId}&signup=${this.regState!=0}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.venue-detail{padding-bottom: 100upx;background: 0$color-f2;min-height: calc(100% - 100upx)}
.venue-info{
	background: #FFFFFF;
	padding:40upx 20upx 0px;
	&-name{
		font-size: $font-size-40;
		font-weight:500;
	}
	&-time{
		color: #666666;
		font-size: $font-size-26;
		padding: 30upx 0px;
	}
	&-address{
		$height:88upx;
		position: relative;
		height: $height;line-height: $height;
		font-size: $font-size-30;
		display: flex;align-items: center;
		&-text{
			flex-grow: 1;
		}
	}
	.icondizhi{color: $color-main;margin-right: 10upx;}
	.icongengduo{color: $color-999; font-size: $font-size-20;}
}
.venue-intro{
	padding: 30upx 20upx;
	margin: 20upx 0px;
	background: #FFFFFF;
	font-size:$font-size-28;color: $color-666; 
}
.venue-notice{
	padding: 0upx 20upx 20upx;
	background: #FFFFFF;
	&-title{
		padding: 29upx 0px;
		position: relative;
		text{
			display: block;
			$height:32upx;
			height: $height;line-height: $height;
			font-size:$font-size-32;
			border-left: 6upx solid $color-main;
			padding-left: 14upx;
		}
	}
	&-text{
		font-size:$font-size-28;color: $color-666;
		padding-top:29upx;
	}
}
.bottom-btn{
	$height: 98upx;
	width: 100%;
	position: fixed;bottom:0;
	background: #FFFFFF;
	text-align: center;
	height: $height;display: flex;align-items: center;justify-content: space-between;
	&-left{
		flex-grow: 1;
		display: flex;align-items: center;
		&-btn{
			width: 150upx;
			height: $height;
			display: flex;flex-direction: column;justify-content: center;
			position: relative;
			font-size:$font-size-24;color:$color-main;
			.iconfont{
				font-size:44upx;
			}
		}
	}
	&-right{
		width: 300upx;
		height: $height;line-height: $height;
		background:$color-main;
		font-size:$font-size-32;color: #FFFFFF;
	}
}
</style>
