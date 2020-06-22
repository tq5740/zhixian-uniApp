<template>
	<view class="course-examin page-full create-btn-padding-bottom">
		<info-list :infolist="infolist"></info-list>
		<view class="bottom-full-btn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" :title="courseName" @onExamine="onExamine"></examine-modal>
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
			courseName: undefined
		};
	},
	onLoad({ id }) {
		this.$updateNavbarTitle("审核");
		uni.showLoading({
			title: "请稍等"
		});
		this.id = id;
		trainApi.getQueryCourseAdmin(id).then(course => {
			this.courseName = course.courseTitle;
			this.infolist = [
				[{
					title: "企业名称",
					el: "text",
					value: ""
				},
				{
					title: "课程标题",
					el: "text",
					value: course.courseTitle
				}
				],
				[{
					title: "课程封面",
					el: "image",
					horizontal: true,
					width: 203,
					height: 114,
					value: course.courseImg || this.$store.state.defaultImg.course
				}],
				[{
					title: "课程分类",
					el: "text",
					value: course.categoryTitle
				},
				{
					title: "可见范围",
					el: "text",
					value: course.visibleRange == 1 ? "仅自己" : course.visibleRange == 2 ? "本企业" : "开放"
				},
				{
					title: "讲师",
					el: "text",
					value: course.lecturerName
				}
				],
				[{
					title: "课程简介",
					el: "richtext",
					disabled: true,
					value: this.$escape2Html(course.intro || "")
				}]
			]
			userApi.getQueryOrg(course.orgId).then(data => {
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
			this.$refs.examineModal.show(`审核“${this.courseName}”`)
		},
		onExamine({ pass, reason }) {
			let rqData = {
				courseId: this.id,
				state: pass ? 4 : 2,
				reason
			}
			uni.showLoading();
			trainApi.postAuditCourseAdmin(rqData).then(data => {
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
	.course-examin {
	  min-height: calc(100% - #{$create-btn-height});
	}
</style>
