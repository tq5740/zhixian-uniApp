<template>
	<view class="organization-list page-full">
		<msg-modal ref="msgmodal" @onConfirm="onBanAllow"></msg-modal>
		<search-filter :filterList="filterList" searchPlaceholder="请输入企业名称搜索" @onFilterMenuClick="onFilterMenuClick" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>

		<view class="list-item" v-for="(o,i) of dataList" :key="i">
			<list-item :item="o" :btnList='getBtnList(o.state)' @onItemClick="onItemClick" @onBtnClick="onBtnClick">
				<template v-slot:content>
					<list-item-article :name="o.orgName" :intro="o | getIntro" :introColor="o.state==2?'#FC703E':'#666666'" :state="o.state | getState" :stateBgColor="o.state | getStateColor" :tips="getTips(o)" tipsColor="#999999">
					</list-item-article>
				</template>
			</list-item>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "@/api/modules/user.js"
import { getOrgType, getOrgState, getOrgFilterList } from "@/utils/utils.js"
import listItemArticle from "@/components/listItemArticle.vue"

const orgType = getOrgType();
const state = getOrgState();
let navTitle = "企业注册";
let getListFn = userApi.getOrgRegListAdmin.bind(userApi);

export default {
	components: {
		listItemArticle
	},
	computed: {
		...mapState(["defaultImg"])
	},
	data() {
		return {
			canCreate: false,
			filterList: [{
			name: "全部",
			value: "",
		type: "state",
			choose: true
		}, {
			name: "草稿",
			value: 1,
		type: "state",
			choose: false
		}, {
			name: "未通过",
		type: "state",
			value: 2,
			choose: false
		}, {
			name: "审核中",
			value: 3,
		type: "state",
			choose: false
		}, {
			name: "已创建",
			value: 4,
		type: "state",
			choose: false
		}],
			pageNum: 1,
			dataList: [],
			pageTotal: 2,
			orgType: undefined,//类型
			state: "",//状态
			query: undefined,//查询条件
			chooseOrg: undefined
		}
	},
	onReady() {
		this.getList();
	},
	onShow(refresh) {
		if (refresh)
			this.getList(true, false);
		else
			this.$updateNavbarTitle(navTitle);
	},
	onReachBottom() {
		this.getList();
	},
	filters: {
		getState(value) {
			if(value==4){return "已创建"}
			return state[value - 1];
		},
		getStateColor(state) {
			switch (state) {
				case 2:
					return "#FC703E";
				case 5:
					return "#FC703E";
				case 4:
					return "#46BB86";
				case 1:
					return "#FFAE00";
				case 3:
					return "#FFAE00";
			}
		},
		getIntro(org) {
			if(org.state==2){
				return "提示："+(org.reason||"-");
			}
			return `企业类型：${orgType[org.orgType - 1]}  主管单位：${org.parentOrg}`;
		}
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
			this._getListFromServer(getListFn, restart, ["query", "orgType", "state"]).then(total => {
				if (typeof total == "number") {
					navTitle = `企业注册(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state) {
			if(!this.power)return;
			let power=this.power;
			let btnList = [];
			if(power.isUpdate){
				btnList.push({text:"编辑",icon:"iconbianji"});
			}
			if (power.isAudit) {
				btnList.push({ text: "审核", icon: "iconshenhe" });
			}
			if (power.isDelete) {
				btnList.push({ text: "删除"  , icon:"iconshanchu" });
			}
			return btnList;
		},
		/**筛选
		 * @param {Object} obj
		 */
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
		/**点击企业=>跳转详情页
		 * @param {Object} org
		 */
		onItemClick(org) {
			let dataJson = JSON.stringify({ orgVideo: org.orgVideo, orgId: org.orgId, orgImg: org.orgImg })
			uni.navigateTo({ url: "/pages/detail/orgDetail?dataJson=" + dataJson + "&tabStatus=0" });
		},
		onBtnClick({ btn, item }) {
				// TODO：
		},
		/**启用/禁用企业
		 */
		onBanAllow() {
			let state = this.chooseOrg.state == 5 ? 4 : 5;
			userApi.postIsForBiddenOrg({ orgId: this.chooseOrg.orgId, state: state }).then(data => {
				// #ifdef H5
				this.chooseOrg.state = state;
				// #endif
				// #ifdef MP-WEIXIN
				// this.chooseOrg.state=state;小程序无法更新该对象视图，只能重新请求列表
				this.getList(true);
				// #endif
				uni.showToast({
					icon: "success",
					title: `${state == 5 ? "禁用" : "启用"}成功`
				});
			}).catch(err => {
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		},
		getTips(org){
			return `申请人：${org.createUserName}  申请时间：${this.$formatDate(org.createTime,"YYYY-MM-DD hh:mm:ss")}`;
		}
	}
}
</script>

<style scoped>
	.page-full {
	}
</style>
