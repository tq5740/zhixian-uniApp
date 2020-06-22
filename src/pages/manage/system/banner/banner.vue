<template>
	<view class="banner-list page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入banner标题搜索" :filterList="filterList" @onSearch="onSearch" @onFilterMenuClick="onFilterMenuClick"></search-filter>
		<view class="list-conten">
			<template v-for="(u,i) of dataList">
				<list-item :item="u" :btnList='getBtnList(u.state)' @onItemClick="onItemClick" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-article :isBanner="false" :name="u.title" :nameColor="u.state == 5 ? '#999999' : '#000000'" :introColor="u.state == 4 ? '#999999' : '#666666'" :intro="'链接地址：'+u.linkUrl" :tips="u | getTips" tipsColor="#999999" :state="u.type==1?'电脑':'手机'" :stateColor="u.type==1?'#F0A442':'#6D9985'" :stateIcon="u.type==1?'icondiannao':'iconshouji'">
						</list-item-article>
					</template>
				</list-item>
			</template>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建banner</text>
		</view>
		<msg-modal ref="msgmodal" @onConfirm="onModalConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import puApi from "@/api/modules/public.js"
import { formatDate } from "../../../../utils/utils.js"
import listItemArticle from "@/components/listItemArticle.vue"
let navTitle = "banner列表";
let getListFn = puApi.getBannerList.bind(puApi);

export default {
	components: {
		listItemArticle
	},
	data() {
		return {
			canCreate: false,
			// 1：pc；2：微信
			filterList: [{ name: "全部", value: undefined, type: "type" }, { name: "电脑", value: 1, type: "type" }, { name: "手机", value: 2, type: "type" }],
			dataList: [],
			pageNum: 1,
			pageTotal: 2,
			query: "",
			type: undefined,
		}
	},
	filters: {
		getTips: function (item) {
			return `修改人：${item.updateUserName || ''} 修改时间：${formatDate(item.updateTime, "YYYY-MM-DD hh:mm:ss")}`;
		},
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	onShow() {
		this.$updateNavbarTitle(navTitle);
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false) {
			if (!this.power) {
				this.power = await this._getPower();
				this.canCreate = this.power.isCreate;
			} else {
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["query", "type"]).then(total => {
				if (typeof total == "number") {
					navTitle = `banner列表(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state) {
			if (!this.power) return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				btnList.push({ text: '编辑', icon: 'iconbianji' });
			}
			if (power.isOnline) {
				if (state == 4) {
					btnList.push({ text: "关闭", icon: "iconguanbi" });
				} else if (state == 5) {
					btnList.push({ text: "发布", icon: "iconfabu" });
				}
			}
			if (power.isDelete) {
				btnList.push({ text: "删除", icon: "iconshanchu" });
			}
			return btnList;
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: `/pages/manage/system/banner/edit?create=true`
			});
		},
		onBtnClick({ btn: { text }, item }) {
			if (text == "编辑") {
				uni.navigateTo({
					url: `/pages/manage/system/banner/edit?banner=${JSON.stringify(item)}`
				});
			} else if (text == "删除") {
				this.$refs.msgmodal.show(`<span>您确定要删除banner“</span><span style="color: #000;font-weight: bold">${item.title}</span><span>”？</span>`, { id: item.bannerId, text });
			} else if (text == "发布") {
				puApi.onlineOfflineBannerAdmin({ bannerId: item.bannerId, state: 4 }).then(data => {
					this.getList(true);
					this.$toast("发布成功！");
				});
			} else if (text == "关闭") {
				this.$refs.msgmodal.show(`<span>您确定要关闭banner“</span><span style="color: #000;font-weight: bold">${item.title}</span><span>”？</span>`, { id: item.bannerId, text });
			}
		},
		onModalConfirm(flag) {
			if (flag.text == "删除") {
				puApi.postDeletBanner(flag.id).then(data => {
					this.getList(true);
				})
			} else if (flag.text == "关闭") {
				puApi.onlineOfflineBannerAdmin({ bannerId: flag.id, state: 5 }).then(data => {
					this.getList(true);
				});
			}
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/system/banner/detail?banner=${JSON.stringify(item)}`
			})
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
	}
}
</script>

<style lang="scss" scoped>
	.banner-list {
	  height: calc(100% - #{$create-btn-height});
	}
</style>
