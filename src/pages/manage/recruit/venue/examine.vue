<template>
	<view class="venue-examine page-full">
		<info-list :infolist="infolist"></info-list>
		<view class="info-item-savebtn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" :title="title" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import workApi from "@/api/modules/work.js"
import examineModal from "../../../../components/examineModal.vue"
export default {
	components: {
		examineModal
	},
	computed: {
		noData() {
			return this.infolist.length == 0;
		}
	},
	data() {
		return {
			infolist: [],
			venueId: undefined
		}
	},
	onLoad({ id }) {
		this.$updateNavbarTitle("审核");
		uni.showLoading();
		workApi.getQueryenueAdmin(id).then(v => {
			let infolist = [[
				{
					title: "封面",
					el: "image",
					value: v.venueImg,
					horizontal: true,
					width: 120
				}
			], [
				{
					title: "名称",
					el: "text",
					value: v.venueTitle
				}, {
					title: "类型",
					el: "text",
					value: v.type == 1 ? "专场招聘" : "校园招聘"
				}, {
					title: "开始日期",
					el: "text",
					value: this.$formatDate(v.startDate, "YYYY-MM-DD")
				}, {
					title: "结束日期",
					el: "text",
					value: this.$formatDate(v.endDate, "YYYY-MM-DD")
				}, {
					title: "时间段",
					el: "text",
					value: v.period
				}
			], [
				{
					title: "报名截止时间",
					el: "text",
					value: this.$formatDate(v.deadline, "YYYY-MM-DD")
				}, {
					title: "联系人",
					el: "text",
					value: v.contact
				}, {
					title: "联系电话",
					el: "text",
					value: v.phone
				}, {
					title: "地址",
					el: "text",
					value: v.address
				}
			], [
				{
					title: "企业参会须知",
					el: "textarea",
					value: v.notice,
					disabled: true
				}
			], [
				{
					title: "简介",
					el: "richtext",
					value: decodeURIComponent(v.intro)
				}
			]
			]
			this.infolist = infolist;
			this.venueId = v.venueId;
			uni.hideLoading();
		});
	},
	methods: {
		onBtnClick() {
			this.$refs.examineModal.show();
		},
		onExamine({ pass, reason }) {
			let rqData = {
				venueId: this.venueId,
				state: pass ? 4 : 2,
				reason: reason
			}
			uni.showLoading();
			workApi.postAuditVenueAdmin(rqData).then(data => {
				uni.hideLoading();
				uni.showToast({
					title: "审核成功",
					icon: "none",
					complete: () => {
						this._refreshPrePage();
					}
				});
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					icon: "none"
				})
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.venue-examine {
	  padding-bottom: 138upx;
	}
	.info-item-savebtn {
	  height: 98upx;
	  width: 100%;
	  text-align: center;
	  line-height: 98upx;
	  position: fixed;
	  z-index: 10;
	  bottom: 0px;
	  background: #42b983;
	  color: #ffffff;
	  font-size: 32upx;
	}
</style>
