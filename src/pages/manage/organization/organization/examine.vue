<template>
	<view class="organization-examine">
		<info-list :infolist="infolist"></info-list>
		<text class="info-item-btn" @tap="$refs.examinemodal.show()">审核</text>
		<examine-modal ref="examinemodal" :title="'审核企业“'+orgName+'”'" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "@/api/modules/user.js"

import examineModal from "@/components/examineModal.vue"

export default {
	components: {
		examineModal
	},
	computed: {
		noData() {
			return this.infolist.length == 0;
		},
		...mapState(["defaultImg"])
	},
	data() {
		return {
			orgId: undefined,
			infolist: [],
			orgName: "",
		}
	},
	onShow() {
		this.$updateNavbarTitle("审核企业")
	},
	onLoad({ id }) {
		this.orgId = id;
		userApi.getQueryOrg(id).then(org => {
			this.orgName = org.orgName;
			let infolist = [
				[{
					title: "企业名称",
					el: "text",
					value: org.orgName
				}, {
					title: "统一信用代码",
					el: "text",
					value: org.orgCode
				}],
				[{
					title: "企业简称",
					el: "text",
					value: org.shortName
				}, {
					title: "所属行业",
					el: "text",
					value: org.industry
				}, {
					title: "企业性质",
					el: "text",
					value: org.natrue
				}, {
					title: "企业规模",
					el: "text",
					value: org.scale
				}, {
					title: "官方网址",
					el: "text",
					value: org.website
				}], [ {
					title: "成立日期",
					el: "text",
					value: this.$formatDate(org.createTime, "YYYY-MM-DD")
				}, {
					title: "注册地址",
					el: "text",
					value: org.address
				}], [{
					title: "营业执照",
					el: "image",
					width: 210,
					height: 297,
					value: org.orgLicense
				}], [{
					title: "企业形象",
					el: "image",
					width: 214,
					height: 120,
					value: org.orgImg
				}], [{
					title: "企业LOGO",
					el: "image",
					width: 120,
					value: org.orgLogo || this.defaultImg.logo
				}]
				, [{
					title: "企业简介",
					el: "richtext",
					value: this.$escape2Html(org.intro||"")
				}]
			]
			this.infolist = infolist;
		}).catch(err => {
			uni.showToast({
				title: err,
				duration: 2000,
				icon: "none"
			});
		});
	},
	methods: {
		onExamine(result) {
			let state = result.pass ? 4 : 2;
			userApi.postAuditOrg({ orgId: this.orgId, state: state, reason: result.reason }).then(data => {
				this.$toast("审核成功！");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		}
	}
}
</script>

<style>
	.organization-examine {
	  background-color: #f2f2f2;
	  padding-bottom: 128upx;
	}
	.info-item-btn {
	  display: block;
	  width: 100%;
	  height: 98upx;
	  text-align: center;
	  line-height: 98upx;
	  background: #42b983;
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #ffffff;
	  position: fixed;
	  bottom: 0rpx;
	  z-index: 10;
	}
</style>
