<template>
	<view class="page-full">
		<view class="statistics-content">
			<view class="statistics-row van-hairline--bottom">
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text color-FFAE00">{{questionNumber}}</text>
					<text class="statistics-item-title">试题数量</text>
				</view>
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text color-FFAE00">{{sumScore}}</text>
					<text class="statistics-item-title">试卷总分</text>
				</view>
				<view class="statistics-item">
					<text class="statistics-item-text color-FFAE00">{{passScore+"%"}}</text>
					<text class="statistics-item-title">合格比率</text>
				</view>
			</view>
			<view class="statistics-row van-hairline--bottom">
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text">{{radioRatio}}</text>
					<text class="statistics-item-title">单选题({{radioScore}}分)</text>
				</view>
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text">{{multiRatio}}</text>
					<text class="statistics-item-title">多选题({{multiScore}}分)</text>
				</view>
				<view class="statistics-item">
					<text class="statistics-item-text">{{judgeRatio}}</text>
					<text class="statistics-item-title">判断题({{judgeScore}}分)</text>
				</view>
			</view>
			<view class="statistics-row van-hairline--bottom">
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text">{{fillRatio}}</text>
					<text class="statistics-item-title">填空题({{fillScore}}分)</text>
				</view>
				<view class="statistics-item van-hairline--right">
					<text class="statistics-item-text">{{qaRatio}}</text>
					<text class="statistics-item-title">问答题({{qaScore}}分)</text>
				</view>
				<view class="statistics-item">
					<text class="statistics-item-text">{{scRatio}}</text>
					<text class="statistics-item-title">情景题({{scScore}}分)</text>
				</view>
			</view>
			<view class="info">
				<text>组卷人：{{updateUser||"-"}}</text>
				<text class="time">组卷时间：{{dateTime||"-"}}</text>
			</view>
		</view>
		<view class="list">
			<view class="list-item van-hairline--bottom" v-for="(d,i) of paperList" :key="i" @tap="onPaperClick(d)">
				<text class="iconfont iconshijuan"></text>
				<text class="title">第{{d}}套试卷</text>
				<text class="iconfont icongengduo"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import userApi from "@/api/modules/user.js"
	export default {
		
		data() {
			return {
				sumScore:0,
				questionNumber:0,
				passScore:0,
				radioRatio:0,
				multiRatio:0,
				judgeRatio:0,
				scRatio:0,
				fillRatio:0,
				qaRatio:0,
				radioScore:0,
				multiScore:0,
				judgeScore:0,
				scScore:0,
				fillScore:0,
				qaScore:0,
				paperNumber:0,
				dateTime:"",
				updateUser:""
			};
		},
		computed: {
			paperList() {
				let paperList=[];
				for (var i = 0; i < this.paperNumber; i++) {
					paperList.push(i+1)
				}
				return paperList;
			}
		},
		onLoad({examBankId,title,paperNumber}) {
			this.$updateNavbarTitle(title);
			this.paperNumber=paperNumber;
			this.examBankId=examBankId;
			examApi.getQueryExamTacticsAdmin(examBankId).then(data=>{
				if(!data)return;
				this.passScore=data.passScore*100;
				this.radioRatio=data.radio1Ratio+data.radio2Ratio+data.radio3Ratio;
				this.multiRatio=data.multi1Ratio+data.multi2Ratio+data.multi3Ratio;
				this.judgeRatio=data.judge1Ratio+data.judge2Ratio+data.judge3Ratio;
				this.scRatio=data.sc1Ratio+data.sc2Ratio+data.sc3Ratio;
				this.fillRatio=data.fill1Ratio+data.fill2Ratio+data.fill3Ratio;
				this.qaRatio=data.qa1Ratio+data.qa2Ratio+data.qa3Ratio;
				this.radioScore=this.radioRatio*data.radioScore;
				this.multiScore=this.multiRatio*data.multiScore;
				this.judgeScore=this.judgeRatio*data.judgeScore;
				this.scScore=this.scRatio*data.scScore;
				this.fillScore=this.fillRatio*data.fillScore;
				this.qaScore=this.qaRatio*data.qaScore;
				this.sumScore=this.radioScore+this.multiScore+this.judgeScore+this.scScore+this.fillScore+this.qaScore;
				this.questionNumber=this.radioRatio+this.multiRatio+this.judgeRatio+this.scRatio+this.fillRatio+this.qaRatio;
				this.dateTime=this.$formatDate(data.updateTime,"YYYY-MM-DD hh:mm:ss");
				userApi.getQueryUser({userId:data.updateUser}).then(data=>{
					this.updateUser=data.name;
				})
			});
		},
		methods:{
			onPaperClick(number){
				uni.navigateTo({
					url:`/pages/manage/exam/bank/testPaperDetail?number=${number}&examBankId=${this.examBankId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.statistics{
	&-content{
		background:#FFFFFF;
		.info{
			$h:80upx;
			height: $h;line-height: $h;
			padding-left: 30upx;
			font-size: $font-size-24;color:#999999;
			.time{
				margin-left: 30upx;
			}
		}
		.color-FFAE00{
			color:#FFAE00;
		}
	}
	&-row{position: relative;width: 100%;display: flex;}
	&-item{
			position: relative;
			width: 250upx;height: 180upx;
			display:flex; flex-direction: column;  justify-content: center; align-items: center;
			&-title{font-size: $font-size-24;color: #333333;margin-top: 25upx;}
			&-text{font-size: $font-size-36;color: #6D9985;}
		}
}
.list{
	margin-top: 20upx;
	background:#FFFFFF;
	&-item{
		$h:100upx;
		position: relative;
		height: $h;line-height: $h;
		font-size:$font-size-30;
		margin-left: 30upx;
		padding-right: 30upx;
		display:flex;justify-content:space-between;
		.title{
			flex-grow: 1;
			margin-left: 20upx;
		}
		.icongengduo{
			color: $color-999;
		}
		.iconfont{
			font-size:$font-size-28;
		}
	}
}
</style>
