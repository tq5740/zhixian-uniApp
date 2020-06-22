<template>
	<view class="train-examin ">
		<info-list :infolist="infolist"></info-list>
		<view class="bottom-full-btn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" :title="trainName" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "@/api/modules/user.js"
import trainApi from "@/api/modules/train.js"
import examineModal from "@/components/examineModal.vue"

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
			id: undefined,
			trainName: undefined
		};
	},
	onLoad({ id }) {
		this.$updateNavbarTitle("审核");
		uni.showLoading({
			title: "请稍等"
		});
		this.id = id;
		trainApi.getQueryTrainAdmin(id).then(train => {
			this.trainName = train.trainTitle;
			this.infolist = [
				[{
					title: "企业名称",
					el: "text",
					value: ""
				},
				{
					title: "培训标题",
					el: "text",
					value: train.trainTitle
				}
				],
				[{
					title: "培训封面",
					el: "image",
					horizontal: true,
					width: 203,
					height: 114,
					value: train.trainImg || this.$store.state.defaultImg.train
				}],
				[{
					title: "培训类型",
					el: "text",
					value: train.trainType == 1 ? "线下培训" : train.trainType == 2 ? "线上培训" : "混合式培训"
				},
				{
					title: "培训分类",
					el: "text",
					value: train.categoryTitle
				},
				{
					title: "可见范围",
					el: "text",
					value: train.visibleRange == 1 ? "仅自己" : train.visibleRange == 2 ? "本企业" : "开放"
				},
				{
					title: "辅导员",
					el: "text",
					value: train.tutor
				}
				],
				[{
					title: "培训地址",
					el: "text",
					value: (train.province || "") + (train.city || "") + (train.district || "") + (train.street || "")
				}],
				[{
					title: "开班开始日期",
					el: "text",
					value: this.$formatDate(train.startTime, "YYYY-MM-DD")
				},
				{
					title: "开班结束日期",
					el: "text",
					value: this.$formatDate(train.endTime, "YYYY-MM-DD")
				}],
				[{
					title: "原价",
					el: "text",
					value: train.originalPrice
				},
				{
					title: "现价/优惠价",
					el: "text",
					value: train.price
				}],
				[{
					title: "培训简介",
					el: "richtext",
					disabled: true,
					value: this.$escape2Html(train.intro || "")
				}]
			]
			userApi.getQueryOrg(train.orgId).then(data => {
				if (data)
					this.infolist[0][0].value = data.orgName;
			});
			uni.hideLoading();
		}).catch(err => {
			uni.hideLoading();
			uni.showToast({
				title: err,
				duration: 2000,
				icon: "none"
			});
		});
	},
	methods: {
		onBtnClick() {
			this.$refs.examineModal.show(`审核“${this.trainName}”`)
		},
		onExamine({ pass, reason }) {
			let rqData = {
				trainId: this.id,
				state: pass ? 4 : 2,
				reason
			}
			uni.showLoading();
			trainApi.postAuditTrainAdmin(rqData).then(data => {
				this.$toast("审核成功");
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
		},
	}
}
</script>

<style lang="scss" scoped>
	.train-examin {
	  padding-bottom: 88upx;
	}
</style>
