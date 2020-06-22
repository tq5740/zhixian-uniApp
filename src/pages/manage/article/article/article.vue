<template>
	<view class="article">
		<search-filter :filterList="filterList" searchPlaceholder="请输入姓名或手机号搜索" @onFilterMenuClick="onFilterMenuClick" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList(d.state,d.isRecommend)' @onItemClick="onItemClick" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-article :isRecommend="d.isRecommend" :name="d.articleTitle" :intro="d | getIntro" :introColor="d.state==2?'#FC703E':''" :tips="d | getTips" tipsColor="#999999" :state="d.state | getState" :stateBgColor="d.state | getStateBgColor" :globalColor="d.state==5?'#999999':''">
						</list-item-article>
					</template>
				</list-item>
			</template>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<delete-modal ref="del" :title="delTitle" @onDelete="onDelete"></delete-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import artApi from "@/api/modules/article.js"
import puApi from "@/api/modules/public.js"
import { formatDate, getArticleState, list2FilterList } from "@/utils/utils.js"
import listItemArticle from "@/components/listItemArticle.vue"
import deleteModal from "@/components/deleteModal.vue"

const stateList = getArticleState();
function getFilterState() {
	let arr_ = [];
	stateList.forEach(v => {
		arr_.push({ name: v.text, value: v.id });
	});
	return arr_;
}
let getListFn = artApi.getArticleListAdmin.bind(artApi);
let navTitle = "文章列表";
export default {
	components: {
		listItemArticle, deleteModal
	},
	data() {
		return {
			filterList: [{ name: "文章分类", type: "categoryIds", showChoose: true ,showResetBtn:true}, { name: "文章状态", type: "state" }],
			pageNum: 1,
			pageTotal: 2,
			query: undefined,
			categoryIds: undefined,
			state: undefined,
			dataList: [],
			delTitle: undefined,
			articleId: undefined
		}
	},
	filters: {
		getIntro: function (item) {
			if (item.state == 4 || item.state == 5) {
				return `浏览量：${item.articleStatistics.browseNumber}`;
			} else if (item.state == 2) {
				return item.reason;
			}
		},
		getTips: function (item) {
			return `创建人：${item.createUserName || ''} 创建时间：${formatDate(item.createTime, "YYYY-MM-DD hh:mm:ss")}`;
		},
		getState(state) {
			return stateList[state - 1].text;
		},
		getStateBgColor(state) {
			return stateList[state - 1].color;
		},
	},
	onShow(refresh) {
		if (refresh) {
			this.getList(refresh, false);
		} else {
			this.$updateNavbarTitle(navTitle);
		}
	},
	onLoad() {
		this.getList();
		let filterList=[{ name: "文章分类", type: "categoryIds", showChoose: true ,showResetBtn:true}, { name: "文章状态", type: "state" }];
		let stateList = getFilterState();
		stateList.unshift({ name: "全部", value: null, choose: true });
		puApi.getArticleCategoryListAdmin().then(data => {
			list2FilterList(data, "categoryTitle", "categoryId");
			data.unshift({ name: "全部", value: null, choose: true });
			filterList[0].children=data;
			filterList[1].children=stateList;
			this.filterList=filterList;
		});
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false, rename = true) {
			if (!this.power) {
				this.power = await this._getPower();
			}
			this._getListFromServer(getListFn, restart, ["query", "categoryIds", "state"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `文章列表(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state, isRecommend) {
			if (!this.power) return;
			// 已关闭没有审核，其它都有
			// 草稿和已关闭有发布
			// 发布中有推荐、关闭
			// 除了发布中，都有删除
			let power=this.power;
			let btnList = [];
			// if(power.isUpdate){
			// 编辑暂不做
			// 	btnList.push({text:"编辑",icon:"iconbianji"});
			// }
			if (power.isOnline) {
				if (state == 4) {//发布中
					btnList.push({ text: "关闭", icon: "iconguanbi" });
				} else if (state == 5 || state == 1) {//草稿、已关闭
					btnList.push({ text: "发布", icon: "iconfabu" });
				}
			}
			if (power.isDelete && state != 4) {//非发布中
				btnList.push({ text: "删除", icon: "iconshanchu" });
			}
			if (power.isRecommend && state == 4) {//发布中
				if (isRecommend) {
					btnList.push({ text: "取消推荐", icon: "iconquxiaotuijian" });
				} else {
					btnList.push({ text: "推荐文章", icon: "icontuijian" });
				}
			}
			if (power.isAudit && state != 5) {
				//非关闭
				btnList.push({ text: "审核文章", icon: "iconshenhe" });
			}
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/article/article/detail?articleId=${item.articleId}`
			})
		},
		onBtnClick({ btn: { text }, item }) {
			this.articleId = item.articleId;
			if (text == "发布") {
				if (item.state != 5) return;
				artApi.postOnOffAdmin({ articleId: item.articleId, state: 4 }).then(data => {
					this.getList(true);
				});
			} else if (text == "关闭") {
				this.$refs.msg.show(`<span>是否关闭文章“</span><span style="color: #000;font-weight: bold">${item.articleTitle}</span><span>”？</span>`, text);
			} else if (text == "推荐文章") {
				this.onMsgConfirm(text);
			} else if (text == "取消推荐") {
				this.onMsgConfirm(text);
			} else if (text == "审核文章") {
				uni.navigateTo({
					url: `/pages/manage/article/article/examine?articleId=${item.articleId}`
				})
			} else if (text = "删除") {
				this.delTitle = `删除“${item.articleTitle}”`;
				this.$refs.del.show();
			}
		},
		onDelete(reason) {
			if (!reason) {
				uni.showToast({
					icon: "none", title: "请填写删除原因"
				});
				return;
			}
			uni.showLoading();
			artApi.postDelArticleAdmin({ articleId: this.articleId, reason: reason }).then(data => {
				uni.hideLoading();
				this.getList(true);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					icon: "none"
				})
			});
		},
		onMsgConfirm(flag) {
			let r_ = undefined;
			uni.showLoading();
			if ("推荐文章" == flag) {
				// 推荐
				r_ = artApi.postRecommendArticleAdmin({ articleId: this.articleId, isRecommend: 1 });
			} else if ("取消推荐" == flag) {
				// 取消推荐
				r_ = artApi.postRecommendArticleAdmin({ articleId: this.articleId, isRecommend: 0 });
			} else if ("关闭" == flag) {
				// 关闭
				r_ = artApi.postOnOffAdmin({ articleId: this.articleId, state: 5 });
			}
			if (r_) {
				r_.then(data => {
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: typeof err == "string" ? err : JSON.stringify(err),
						icon: "none"
					})
				});;
			}
		},
		onFilterMenuClick(obj) {
			if (this[obj.type] != obj.value) {
				this[obj.type] = obj.value;
				this.getList(true);
			}
		},
		/**搜索
		 * @param {Object} value 搜索关键字
		 */
		onSearch(value) {
			if (this.query != value) {
				this.query = value;
				this.getList(true);
			}
		},
		onMove() { }
	}
}
</script>

<style scoped>
</style>
