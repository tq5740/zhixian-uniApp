<template>
	<view class="user-detail page-full">
		<info-list :infolist="infolist"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import liveApi from "@/api/modules/live.js"
import { getLiveTemplateType } from "@/utils/utils.js"
export default {
	data() {
		return {
			infolist: []
		};
	},
	computed: {
		noData() {
			return this.infolist.length == 0;
		}
	},
	onLoad({ liveChapterId }) {
		this.$updateNavbarTitle("直播章节详情");
		liveApi.getQueryLiveChapterAdmin(liveChapterId).then(data => {
			this.infolist = [
				[{
					title: "章节标题",
					el: "text",
					value: data.liveChapterTitle
				},
				{
					title: "直播类型",
					el: "text",
					value: data.liveType == 1 ? "直播" : "课堂"
				},
				{
					title: "模板类型",
					el: "text",
					value: getLiveTemplateType().find(v => {
						return v.id == data.templateType;
					}).text
				}
				],
				[
					{
						title: "主讲人",
						el: "text",
						value: data.speaker
					}, {
						title: "开始日期",
						el: "text",
						value: this.$formatDate(data.startTime, "YYYY-MM-DD")
					},
					{
						title: "开始时间",
						el: "text",
						value: this.$formatDate(data.startTime, "hh:mm")
					}
				], [
					{
						title: "预计总时长",
						el: "text",
						value: data.totalLength + "分钟"
					},
					{
						title: "现场地址",
						el: "text",
						value: data.address
					}
				], [
					{
						title: "直播描述",
						el: "textarea",
						value: this.$escape2Html( data.intro||""),
						disabled: true,
						color: "#666666"
					}
				]
			]
		});
	}
}
</script>

<style lang="scss" scoped>
	.user-detail {
	  padding-bottom: 138upx;
	  height: calc(100% - 138upx);
	}
</style>
