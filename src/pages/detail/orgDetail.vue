<template>
	<div class="organization">
		<header>
			<!--  #ifdef H5 -->
			<div v-show="orgVideoObject.orgVideo" class="train-bgImg-wrapper" id="video_container_box_use">
			</div>
			<div class="org-bgImg-wrapper" v-show="!orgVideoObject.orgVideo">
				<img :src="orgDetailData.orgImgStr" class="org-bgImg">
			</div>
			<!--  #endif -->

			<!--  #ifdef MP-WEIXIN -->
			<video v-if="orgVideoObject.orgVideo" @fullscreenchange="fullScreenChange" class="weixin-video" autoplay id="myvideo"
			 :src="weChatSrc" controls></video>
			<div class="org-bgImg-wrapper" v-if="!orgVideoObject.orgVideo">
				<img :src="orgDetailData.orgImgStr" class="org-bgImg">
			</div>
			<!--  #endif -->

			<div class="org-detail-panel scale-1px-bottom">
				<img :src="configData.imgDomain + orgDetailData.orgLogo + '/100x100'" :key="configData.imgDomain + orgDetailData.orgLogo"
				 class="org-avatar" v-if="orgDetailData.orgLogo">
				<img src="/static/img/user/orgLogo.png" class="org-avatar" v-else>
				<div class="org-detail">
					<div class="org-name-wrap">
						<span class="org-name">{{orgDetailData.orgName}}</span>
					</div>
					<div class="org-profile">
						<span class="none-tips">{{orgDetailData.natrue ? orgDetailData.natrue : ""}}</span>
						<div class="org-category">{{orgDetailData.industry ? orgDetailData.industry : ""}}</div>
						<div class="org-scale">{{orgDetailData.scale ? orgDetailData.scale : ""}}</div>
					</div>
				</div>
			</div>
			<div class="position-org-grade">
				<div class="position-org-stars">
					<i class="iconfont position-org-stars-icon icon-xing iconxing" v-for="item in 5" :key="item"></i>
				</div>
				<div class="position-org-number">共{{orgDetailData.comments || 0}}人评分</div>
			</div>
		</header>
		<view class="hr"></view>
		<footer class="org-summary">

			<!-- <div :class="fixedHeader" id="fixedHeaderRoot"> -->
			<my-tabs :list="['基本信息']" :init="tabActive" @change="onTabsClick"></my-tabs>
			<!-- </div> -->

			<div class="org-summary-detail" v-if="tabActive == 0">
				<div class="org-summary">
					<div class="org-summary-content">
						<!--  #ifdef H5 -->
						<div v-if="orgDetailData.intro" class="text-line" v-html="orgDetailData.intro"></div>
						<!--  #endif -->

						<!--  #ifdef MP-WEIXIN -->
						<rich-text :nodes="orgDetailData.intro" class="text-line"></rich-text>
						<!--  #endif -->
					</div>

					<div class="org-summary-header">
						<span class="summary-sp">工商信息</span>
						<div class="horizontal-line"></div>
					</div>
					<div class="org-basic-message">
						<div class="org-code org-basic"><span class="org-basic-item">信用代码</span><span class="org-basic-content">{{orgDetailData.orgCode}}</span></div>
						<div class="org-register-address org-basic"><span class="org-basic-item">注册地址</span><span class="org-basic-content">{{(orgDetailData.address || "")+(orgDetailData.city || "")+(orgDetailData.district || "")+(orgDetailData.street || "")}}</span></div>
						<div class="org-establish-dateTime org-basic" v-if="orgDetailData.orgType == 1"><span class="org-basic-item">成立日期</span><span
							 class="org-basic-content">{{createTime}}</span></div>
						<!-- <div class="org-corporate-representative org-basic"><span class="org-basic-item">法人代表</span><span class="org-basic-content">{{orgDetailData.legalPerson}}</span></div> -->
					</div>

					<div class="org-summary-header" v-if="orgAddressData.length">
						<span class="summary-sp">公司地址</span>
						<div class="horizontal-line"></div>
					</div>
					<ul class="org-address-ul" v-if="orgAddressData.length">
						<li class="org-address-li" v-for="item in orgAddressData" :key="item.addressId">
							<i class="iconfont zx-svg location-icon icon-dingwei_"></i>
							<span class="location-sp">{{item.province ? item.province : ""}}{{item.city ? item.city : ""}}{{item.district ? item.district : ""}}{{item.street ? item.street : ""}}{{item.doorNumber ? item.doorNumber : ""}}</span>
						</li>
					</ul>

				</div>
			</div>
			<ul class="position-recruit-ul" v-if="tabActive == 1">
				<li class="position-recruit-li scale-1px-bottom" v-for="item in workJobListData" :key="item.workId" @click="onPositionItemClick(item.workId, item.workTitle)">
					<div class="position-profile-header">
						<div class="position-name">{{item.workTitle}}</div>
						<div class="position-salary" v-if=" item.lowSalary!=-1">
							{{item.metaSalary}} <span class="tips-min">元/{{item.salaryType == 1 ? "日" : "月"}}</span>
						</div>
						<div class="position-salary" v-else>
							面议
						</div>
					</div>
					<div class="position-profile-bottom">
						<div class="position-location">{{item.city ? item.city : ""}} {{item.district ? "-" : ""}}{{item.district ? item.district : ""}}</div>
						<div class="position-degree van-hairline--left">{{education[item.education]}}</div>
						<div class="position-experience van-hairline--left">{{experience[item.experience]}}</div>
					</div>
				</li>
				<div v-if="isNoData" class="on-data-text">暂无数据</div>
			</ul>
		</footer>
	</div>
</template>

<script>
	import myTabs from '../../components/myTabs'
	import noData from '../../components/noData'
	import User from '../../api/modules/user'
	import Work from '../../api/modules/work'
	// #ifdef H5
	import {
		wxShare,
		getAppVersion,
		isWxBrowser
	} from '../../utils/utils'
	// #endif
	export default {
		components: {
			myTabs,
			noData
		},
		data() {
			return {
				tabActive: 0,
				orgDetailData: {},
				orgAddressData: [],
				isNoData: false,
				orgWebsiteUrl: "",

				pageSize: 10,
				pageNumber: 1,
				totalPageNumber: 1,

				education: [
					"全部",
					"初中及以下",
					"高中",
					"中技/中专",
					"大专",
					"本科",
					"硕士",
					"博士"
				],
				typeList: ['市场主体', '机关群团', '事业单位', '社会组织', "中/高职院校"],
				headerFixed: false,
				experience: ["全部", "1年", "2年", "3-4年", "5-10年", "10年以上"], //工作经验
				workJobListData: [],
				orgId: "",
				weChatSrc: "",
				player: null,
				orgVideoObject: null,

				showNavbar: true
			}
		},
		beforeDestroy() {
			if (this.player) {
				this.player.dispose();
				this.player = null;
			}
		},
		mounted() {
			if (!this.orgVideoObject.orgVideo) {
				return;
			}
			// #ifdef H5
			let videoBox = document.getElementById("video_container_box_use");
			let videoUniApp = document.createElement("video");
			videoUniApp.setAttribute('id', 'video_container_use_box_src');
			videoUniApp.setAttribute('preload', 'auto');
			videoUniApp.setAttribute('src',
				this.orgVideoObject.orgVideo.includes("http") ? this.orgVideoObject.orgVideo : this.configData.vodDomain + this.orgVideoObject
				.orgVideo);
			videoUniApp.setAttribute('playsinline', '');
			videoUniApp.setAttribute('webkit-playsinline', '');
			videoUniApp.setAttribute('class', 'video_container_class');
			let h5Height = Math.round(window.innerWidth * 2 / 1.777777);
			videoUniApp.setAttribute('style', 'width: 100%; height: ' + (h5Height / 2) + 'px');
			videoBox.appendChild(videoUniApp);
			this.player = TCPlayer("video_container_use_box_src", {
				videoOptions: {
					autoplay: true,
					posterImage: true,
					fileID: "",
					appID: "",
					plugins: {
						ContinuePlay: {
							auto: true
						}
					}
				}
			})
			this.player.poster(this.orgVideoObject.orgImg ? this.configData.imgDomain + this.orgVideoObject.orgImg + "/750x422" :
				this.isOrgImg);
			// #endif

			// #ifdef MP-WEIXIN
			this.weChatSrc = this.orgVideoObject.orgVideo.includes("http") ? this.orgVideoObject.orgVideo : this.configData.vodDomain +
				this.orgVideoObject.orgVideo;
			// #endif
		},
		computed: {
			configData() {
				return this.$store.state.configData;
			},
			isOrgImg() {
				return this.configData.imgDomain + '/default/cdwork/org_img.jpg/750x422';
			},
			fixedHeader() {
				return [`org-tab`, this.headerFixed ? ` isFixed` : ``];
			},
			createTime() {
				return this.$formatDate(this.orgDetailData.createTime, 'YYYY-MM-DD')
			},
			token() {
				return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
			},
			proType() {
				return this.$store.state.proType;
			}
		},
		onShow() {
			// #ifdef H5
			if (getAppVersion() === "android" && isWxBrowser()) {
				this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
			}
			// #endif
		},
		// #ifdef MP-WEIXIN
		onShareAppMessage() {
			let dataJson = JSON.stringify(this.orgVideoObject);
			return {
				title: this.orgDetailData.orgName,
				path: "/pages/user/org/detail?dataJson=" + dataJson + "&tabStatus=" + this.tabActive
			}
		},
		// #endif

		onLoad(options) {
			this.orgVideoObject = JSON.parse(options.dataJson);
			this.tabActive = options.tabStatus;
			this.orgId = this.orgVideoObject.orgId;
			this.getOrgDetail(this.orgVideoObject.orgId);
			this.getOrgAddress(1);
		},

		methods: {
			fullScreenChange(e) {
				if (e.detail.direction == "horizontal") {
					this.showNavbar = false;
					return;
				}
				this.showNavbar = true;
			},
			onTabsClick(index) {
				this.tabActive = index;
			},
			switchTabStatus(tabStatus) {
				this.tabActive = tabStatus;
			},
			getOrgDetail(orgId) {
				if (orgId) {
					User.getQueryOrg(orgId).then(res => {
						this.$updateNavbarTitle(res.orgName)
						const resData = res;
						this.orgDetailData = resData;
						this.orgDetailData.intro = res.intro ? this.$escape2Html(res.intro) : "";
						this.orgDetailData.orgImgStr = res.orgImg ? this.configData.imgDomain + res.orgImg + "/750x422" : this.isOrgImg;
						this.orgWebsiteUrl = resData.website;

						// #ifdef H5
						setTimeout(() => {
							let ShareConfig = {};
							ShareConfig.title = res.orgName;
							ShareConfig.link = window.location.href;
							ShareConfig.imgUrl = this.$store.state.configData.imgDomain + res.orgLogo + "/100x100";
							let _str_ = this.orgDetailData.intro.replace(/<\/?.+?>/g, "");
							let _desc_ = _str_.replace(/ /g, "").replace(/&nbsp;/g, "");
							ShareConfig.desc = _desc_;
							wxShare(ShareConfig);
						}, 1000);
						// #endif

					});
				}
			},
			getOrgAddress(_pageNum) {
				if (_pageNum > this.totalPageNumber && this.totalPageNumber !== 0) {
					return;
				}
				const data = {
					orgId: this.orgVideoObject.orgId,
					pageNum: this.pageNumber,
					pageSize: this.pageSize,
					lat: this.$store.state.pos.lat,
					lng: this.$store.state.pos.lng
				};
				Work.getMyAddress(data).then(res => {
					if (res.result.length == 0) {
						return;
					}
					if (_pageNum == 1) {
						this.orgAddressData = [];
					}
					this.totalPageNumber = res.pages;
					this.orgAddressData = this.orgAddressData.concat(res.result);
					if (this.totalPageNumber !== 0) {
						++this.pageNumber;
					}
				});
			},

			onReachBottom() {
				this.getOrgAddress(this.pageNumber);
			},

			onPositionItemClick(workId, workTitle) {
				wx.navigateTo({
					url: "/pages/work/job/detail?workId=" + workId + "&workTitle=" + workTitle
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.text-line {
		line-height: 2.2;
	}

	.tips-min {
		font-size: 24upx;
		margin-left: 10upx;
	}
	.hr{
		height: 20upx;width: 100%;background: #f2f2f2;
	}
	.organization {
		min-height: 100%;
		background-color: #fff;

		.isFixed {
			position: fixed;
			top: 0;
			left: 0;
			height: 50upx;
			width: 100%;
			z-index: 5;
		}

		.org-tab {
			position: -webkit-sticky;
			position: sticky;
			top: -2px;
			left: 0;
			z-index: 5;
		}

		.position-org-grade {
			display: flex;
			align-items: center;
			padding: 12upx 20upx;
			margin-bottom: 20upx;
			font-size: 24upx;
			color: #999;
			background-color: #fff;
		}

		.position-org-stars {
			flex: 1;
		}

		.position-org-stars-icon {
			width: 17px;
			height: 17px;
			margin-right: 5px;
			display: inline-block;
			color: rgb(255, 174, 0);
		}

		.org-summary-content,
		.org-address-ul {
			margin-bottom: 80upx;
		}

		.org-address-li {
			display: flex;
			margin-bottom: 40upx;
			font-size: 28upx;
			color: #999;
		}

		.org-address-li:last-child {
			margin-bottom: 0;
		}

		.location-icon {
			font-size: 28upx;
			margin-top: 4upx;
			flex-shrink: 0;
			margin-right: 6upx;
			color: #999;
		}

		.org-basic {
			display: flex;
			margin-bottom: 40upx;
		}

		.org-basic:last-child {
			margin-bottom: 0;
		}

		.org-basic-message {
			font-size: 28upx;
			color: #000;
		}

		.org-basic-item {
			width: 160upx;
			color: #999;
		}

		.org-basic-content {
			width: 550upx;
		}

		.org-summary-header {
			display: flex;
			align-items: center;
			margin-bottom: 30upx;
			margin-top: 30upx;
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

		.org-profile {
			height: 32upx;
			display: flex;
			align-items: center;
			font-size: 24upx;
			color: #999;
		}

		.org-category {
			float: left;
			padding-left: 10upx;
			padding-right: 10upx;
			height: 24upx;
			line-height: 24upx;
			margin-top: 0upx;
			border-right: 1px solid #e5e5e5;
			border-left: 1px solid #e5e5e5;
		}

		.org-scale {
			float: left;
			padding-left: 10upx;
		}

		.stars-rater {
			margin-left: 10upx;
		}

		.org-stars-icon {
			width: 17px;
			height: 17px;
			margin-right: 5px;
		}

		.org-stars-icon:last-child {
			margin-right: 0;
		}

		.org-bgImg-wrapper {
			position: relative;
			padding-top: 56.25%;
			background-color: #fff;
		}

		.org-bgImg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		.org-detail-panel {
			display: flex;
			align-items: center;
			padding: 20upx;
			background-color: #fff;
		}

		.org-avatar {
			width: 100upx;
			height: 100upx;
			margin-right: 20upx;
		}

		.org-detail {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			padding-bottom: 6upx;
		}

		.org-name-wrap {
			padding-top: 6upx;
			margin-bottom: 20upx;
			font-size: 32upx;
		}

		.none-tips {
			float: left;
			font-size: 24upx;
			padding-right: 10upx;
		}

		.org-name {
			margin-bottom: 14upx;
			font-size: 32upx;
			width: 600upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.org-summary {
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

		.org-summary-detail {
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

	.weixin-video {
		width: 100%;
		height: 422upx;
		margin-bottom: -10upx;
	}

	.train-bgImg-wrapper {
		position: relative;
		width: 100%;
	}
</style>
