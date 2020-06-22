<template>
	<div class="train-detail">
		<header class="header-box">
			<div class="train-bgImg-wrapper">
				<div>{{examData.examTitle}}</div>
				<div class="exam-number">
					<div>{{examData.sunScore}}分</div>
				</div>
				<div>合格分数</div>
			</div>
		</header>
		<view class="hr"></view>
		<user-org-box :dataOrg="dataOrg" :isTopNum0="true"></user-org-box>
		<div class="exam-info scale-1px-top">
			<li class="scale-1px-bottom">
				<span class="tips">考试总分</span> <span class="value">{{examData.allScore}} 分</span>
			</li>
			<li class="scale-1px-bottom">
				<span class="tips">考试题数</span> <span class="value">{{examData.questionNumber}} 道</span>
			</li>
			<li class="scale-1px-bottom">
				<span class="tips">开考时间</span> <span class="value">{{examData.startTimeStr}}</span>
			</li>
			<li class="scale-1px-bottom" v-if="examData.type == 2">
				<span class="tips">考试时长</span> <span class="value">{{examData.examLength}} 分钟</span>
			</li>
		</div>
		<view class="hr"></view>
		<div class="exam-content scale-1px-bottom">简介</div>
		<!--  #ifdef H5 -->
		<div class="exam-intro scale-1px-bottom" v-html="examData.introStr"></div>
		<!--  #endif -->
		<!--  #ifdef MP-WEIXIN -->
		<div class="exam-intro scale-1px-bottom">
			<rich-text :nodes="examData.introStr"></rich-text>
		</div>
		<!--  #endif -->
	</div>
</template>

<script>
	import userOrgBox from "../../components/userOrgBox"
	import Exam from '../../api/modules/exam'
	import {
		wxShare,
		getAppVersion,
		isWxBrowser
	} from '../../utils/utils'
	export default {
		components: {
			userOrgBox
		},
		data() {
			return {
				dataOrg: {},
				examId: "",
				examData: {},
				examTitle: ""
			}
		},
		computed: {
			configData() {
				return this.$store.state.configData;
			}
		},
		onLoad(options) {
			this.examId = options.examId;
			this.queryExam(options.examId);
		},
		// #ifdef MP-WEIXIN
		onShareAppMessage() {
			return {
				title: this.examTitle,
				path: "/pages/exam/detail?examId=" + this.examId
			}
		},
		// #endif
		onShow() {
			// #ifdef H5
			if (getAppVersion() === "android" && isWxBrowser()) {
				this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
			}
			// #endif
			if (this.examTitle) {
				this.$updateNavbarTitle(this.examTitle);
			}
		},
		methods: {
			queryExam(examId) {
				Exam.getQueryExamAdmin(examId).then(res => {
					res.org.orgLogoStr = res.org.orgLogo ? this.configData.imgDomain + res.org.orgLogo +
						"/100x100" : '/static/img/user/orgLogo.png';
					this.dataOrg = {
						orgId: res.orgId,
						...res.org
					};
					res.startTimeStr = this.$formatDate(res.startTime, "YYYY-MM-DD hh:mm");
					res.introStr = this.$escape2Html(res.intro);
					res.sunScore = parseInt(res.allScore * res.passScore);
					this.examData = res;


					this.examTitle = res.examTitle;
					this.$updateNavbarTitle(res.examTitle);

					// #ifdef H5
					setTimeout(() => {
						let ShareConfig = {};
						ShareConfig.title = res.examTitle;
						ShareConfig.link = location.href;
						ShareConfig.imgUrl = res.examImg ? this.configData.imgDomain + res.examImg + "/100x100" : this.configData.imgDomain +
							'/default/cdwork/eval.jpg/100x100';
						let _str_ = decodeURIComponent(res.intro).replace(/<\/?.+?>/g, "");
						let _desc_ = _str_.replace(/ /g, "").replace(/&nbsp;/g, "");
						ShareConfig.desc = _desc_;
						wxShare(ShareConfig);
					}, 1000);
					// #endif
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.tips-min {
		font-size: 24upx;
		margin-left: 10upx;
	}

	header {
		background-color: #fff;
	}

	.hr {
		height: 20upx;
		width: 100%;
		background: #f2f2f2;
	}

	.train-detail {
		min-height: 100%;
		background-color: #fff;
		padding-bottom: 104upx;

		.isFixed {
			position: fixed;
			top: 0;
			left: 0;
			height: 50upx;
			width: 100%;
			z-index: 1;
		}

		.train-tab {
			position: -webkit-sticky;
			position: sticky;
			top: -2px;
			left: 0;
			z-index: 1;
		}

		.position-train-grade {
			width: 710upx;
			margin: auto;
			align-items: center;
			padding: 12upx 0;
			margin-bottom: 20upx;
			font-size: 24upx;
			color: #999;
			background-color: #fff;
		}

		.position-train-stars {
			flex: 1;
			line-height: 60upx;
			font-size: 26upx;
		}

		.position-train-stars-icon {
			width: 17px;
			height: 17px;
			margin-right: 5px;
			display: inline-block;
			color: rgb(255, 174, 0);
		}

		.train-summary-content,
		.train-address-ul {
			margin-bottom: 80upx;
		}

		.train-address-li {
			display: flex;
			margin-bottom: 40upx;
			font-size: 28upx;
			color: #999;
		}

		.train-address-li:last-child {
			margin-bottom: 0;
		}

		.location-icon {
			font-size: 28upx;
			margin-top: 4upx;
			flex-shrink: 0;
			margin-right: 6upx;
			color: #999;
		}

		.train-basic {
			display: flex;
			margin-bottom: 40upx;
		}

		.train-basic:last-child {
			margin-bottom: 0;
		}

		.train-basic-message {
			font-size: 28upx;
			color: #000;
		}

		.train-basic-item {
			width: 160upx;
			color: #999;
		}

		.train-basic-content {
			width: 550upx;
		}

		.train-summary-header {
			display: flex;
			align-items: center;
			margin-bottom: 50upx;
			font-size: 30upx;
			color: #000;
		}

		.horizontal-line {
			border-bottom: 1px solid #d8d8d8;
			flex: 1;
			margin-left: 30upx;
		}

		.position-btn-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			font-size: 32upx;
			color: #fff;
		}

		.position-btn-close,
		.position-btn-publish {
			padding: 32upx 0;
			text-align: center;
		}

		.position-btn-close,
		.position-btn-publish {
			background-color: #42b983;
		}

		.position-btn-publish.disable {
			background-color: #e8e8e8;
		}

		.position-btn-pending {
			display: flex;
			background-color: #f5f5f5;
			height: 98upx;
		}

		.position-btn-editor {
			border-right: 1px solid rgb(216, 216, 216);
			align-items: center;
			padding: 10upx 50upx;
			color: #42b983;
			font-size: 24upx !important;
		}

		.customer-service-icon {
			font-size: 40upx !important;
		}

		.position-btn-empty {
			flex: 0.49333;
		}

		.position-btn-publish {
			flex: 1;
		}

		.position-btn-publish.unExsit {
			background-color: #ccc;
		}

		.train-profile {
			height: 32upx;
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: #999;
		}

		.train-category {
			float: left;
			padding-left: 10upx;
			padding-right: 10upx;
			height: 24upx;
			line-height: 24upx;
			margin-top: 0upx;
			border-right: 1px solid #e5e5e5;
			border-left: 1px solid #e5e5e5;
		}

		.train-scale {
			float: left;
			padding-left: 10upx;
		}

		.stars-rater {
			margin-left: 10upx;
		}

		.train-stars-icon {
			width: 17px;
			height: 17px;
			margin-right: 5px;
		}

		.train-stars-icon:last-child {
			margin-right: 0;
		}

		.train-bgImg-wrapper {
			text-align: center;
			height: 420upx;
			background-color: #42b983;
			font-size: 34upx;
			color: rgb(255, 255, 255);
			padding-top: 30upx;

			.exam-number {
				display: inline-block;
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				border: 1px solid #fff;
				margin-top: 30upx;
				margin-bottom: 30upx;

				div {
					display: inline-block;
					line-height: 172upx;
					margin-top: 12upx;
					width: 172upx;
					height: 172upx;
					border-radius: 50%;
					font-size: 44upx;
					background-color: #62cf9e;
				}
			}
		}

		.exam-info {
			width: 100%;
			height: auto;
			background-color: #fff;

			li {
				height: 88upx;
				font-size: 32upx;
				line-height: 88upx;

				.tips {
					margin-left: 20upx;
				}

				.value {
					margin-left: 46upx;
					color: #999999;
				}
			}
		}

		.exam-content {
			margin-top: 20upx;
			height: 88upx;
			line-height: 88upx;
			text-align: center;
			font-size: 32upx;
			background-color: #fff;
		}

		.exam-intro {
			padding: 30upx;
			background-color: #fff;
			font-size: 28upx;
		}

		.train-detail-panel {
			display: flex;
			align-items: center;
			padding: 20upx;
			background-color: #fff;
		}

		.train-avatar {
			width: 100upx;
			height: 100upx;
			margin-right: 20upx;
		}

		.train-detail {
			background-color: #fff;
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			padding-bottom: 6upx;
		}

		.train-name-wrap {
			padding-top: 6upx;
			margin-bottom: 20upx;
			font-size: 32upx;
		}

		.none-tips {
			float: left;
			font-size: 24upx;
			padding-right: 10upx;
		}

		.train-name {
			margin-bottom: 14upx;
			font-size: 32upx;
			width: 600upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.train-summary {
			width: 100%;
			color: #000;
			background-color: #fff;
		}

		.position-recruit-li {
			display: flex;
			flex-direction: column;
			padding: 30upx 20upx;
		}

		.position-salary {
			color: #fc703e;
			font-size: 32upx;
		}

		.train-summary-detail {
			min-height: 98upx;
			padding: 30upx 20upx;
			font-size: 28upx;
			overflow-x: hidden;
			word-wrap: break-word;
		}

		.position-profile-header {
			display: flex;
			margin-bottom: 20upx;
			font-size: 30upx;
		}

		.position-name {
			flex: 1;
			margin-right: 10upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.position-profile-bottom {
			display: flex;
			font-size: 26upx;
			color: #333;
		}

		.position-location {
			margin-right: 20upx;
			margin-top: -8upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.position-degree,
		.position-experience {
			flex-shrink: 0;
			height: 24upx;
			line-height: 24upx;
			padding: 0 20upx;
			flex-shrink: 0;
		}
	}

	.on-data-text {
		background-color: rgb(242, 242, 242);
		text-align: center;
		padding: 150upx;
		font-size: 32upx;
		height: 100%;
	}

	.icon-dingwei_1 {
		font-size: 28upx;
		display: inline-block;
		margin-right: 5upx;
		color: #42b983;
	}

	.icon-gengduo {
		float: right;
		font-size: 28upx;
	}

	.position-recruit-ul {
		padding: 0 20upx;
	}

	.title-ml {
		display: block;
		font-size: 32upx;
		color: #000;
		line-height: 88upx;
	}

	.children-z,
	.children-j {
		display: block;
		font-size: 28upx;
		color: #000;
		line-height: 88upx;
		height: 88upx;
	}

	.children-j {
		display: block;
		font-size: 26upx;
	}

	.icon-weixuanzhong {
		margin-right: 10upx;
		font-size: 26upx;
	}

	.tips-ks {
		padding: 0 8upx;
		font-size: 26upx;
		border: 1px solid #ff6600;
		border-radius: 8upx;
		color: #ff6600;
	}

	.title-ml-text {
		display: inline-block;
		width: 638upx;
	}

	.tips-dc {
		padding: 0 8upx;
		font-size: 26upx;
		border: 1px solid #42b983;
		border-radius: 8upx;
		color: #42b983;
	}

	.header-box {
		// margin-bottom: 20upx;
	}
</style>
