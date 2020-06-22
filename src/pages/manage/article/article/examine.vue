<template>
	<view class="article-examine">
		<info-list :infolist="infoList"></info-list>
		<view class="bottom-full-btn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" :title="title" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import artApi from "@/api/modules/article.js"
import userApi from "@/api/modules/user.js"
import puApi from "@/api/modules/public.js"

import examineModal from "@/components/examineModal.vue"

function getCategoryTitle(arr, id) {
	let o_ = arr.find(v => {
		return v.categoryId == id;
	});
	if (o_)
		return o_.categoryTitle;
	else {
		for (let a of arr) {
			if (a.children && a.children.length > 0) {
				let r_ = getCategoryTitle(a.children, id);
				if (r_) return r_;
			}
		}
		return "";
	}
}

export default {
	components: {
		examineModal
	},
	computed: {
		noData() {
			return this.infoList.length == 0;
		}
	},
	data() {
		return {
			infoList: [],
			title: undefined,
			id: undefined
		}
	},
	onLoad({
		articleId
	}) {
		this.$updateNavbarTitle("审核");
		uni.showLoading();
		this.id = articleId;
		artApi.getQueryArticleAdmin(articleId).then(async data => {
			this.title = `审核文章“${data.articleTitle}”`;
			let org= (await userApi.getQueryOrg(data.orgId));
			org=org||"";
			let infoList = [
				[{
					title: "企业名称",
					el: "text",
					value:org.orgName||""
				}, {
					title: "文章标题",
					el: "text",
					value: data.articleTitle
				}],
				[{
					title: "文章封面",
					el: "image",
					width: 203,
					height: 114,
					images: [{
						value: data.articleImg
					},
					{
						value: data.articleImg2
					},
					{
						value: data.articleImg3
					}
					]
				}],
				[{
					title: "文章分类",
					el: "text",
					value: getCategoryTitle((await puApi.getArticleCategoryListAdmin()), data.categoryId)
				}, {
					title: "可见范围",
					el: "text",
					value: data.visibleRange == 1 ? "仅自己" : data.visibleRange == 2 ? "本部门用户" : "开放"
				},
				{
					title: "显示报名",
					el: "text",
					value: data.isOpenReg ? "显示" : "关闭"
				}, {
					title: "报名截止时间",
					el: "text",
					value: this.$formatDate(data.regEndTime, "YYYY-MM-DD")
				}]
				,
				[{
					title: "内容",
					el: "richtext",
					value: data.intro ? decodeURIComponent(data.intro) : ""
				}]

			]
			if (data.isOpenReg) {
				infoList[2][4] = { title: "需填报名信息", el: "text", value: data.regInfo }
			}

			this.infoList = infoList;
			uni.hideLoading();
		}).catch(err => {
			uni.hideLoading();
		})
	},
	methods: {
		onBtnClick() {
			this.$refs.examineModal.show();
		},
		onExamine({ pass, reason }) {
			uni.showLoading();
			artApi.postAuditArticleAdmin({ articleId: this.id, state: pass ? 4 : 2, reason: reason }).then(data => {
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
			})
		}
	}
}
</script>

<style>
	.article-examine {
	  padding-bottom: 138upx;
	}
</style>
