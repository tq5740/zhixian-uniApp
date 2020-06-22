<template>
	<view class="organization-list page-full">
		<msg-modal ref="msgmodal" @onConfirm="onBanAllow"></msg-modal>
		<search-filter :filterList="filterList" searchPlaceholder="请输入企业名称搜索" @onFilterMenuClick="onFilterMenuClick" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>

		<view class="list-item" v-for="(o,i) of dataList" :key="i">
			<list-item :item="o" :btnList='getBtnList(o.state)' @onItemClick="onItemClick" @onBtnClick="onBtnClick">
				<template v-slot:content>
					<list-item-org-user :logo="o.orgLogo||defaultImg.logo" :name="o.orgName" :intro="o | getIntro" :state="o.state | getState" :stateBgColor="o.state | getStateColor" :tips="o | getTips">
					</list-item-org-user>
				</template>
			</list-item>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "@/api/modules/user.js"
import { getOrgType, getOrgState, getOrgFilterList } from "@/utils/utils"
import listItemOrgUser from "@/components/listItemOrgUser.vue"

const orgType = getOrgType();
const state = getOrgState();
let navTitle = "企业";
let getListFn = userApi.getOrgList.bind(userApi);

export default {
	components: {
		listItemOrgUser
	},
	computed: {
		...mapState(["defaultImg"])
	},
	data() {
		return {
			canCreate: false,
			filterList: getOrgFilterList(),
			pageNum: 1,
			dataList: [],
			pageTotal: 2,
			orgType: undefined,//类型
			state: undefined,//状态
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
			if(value==4){return ""}
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
			return `${orgType[org.orgType - 1]} | ${org.industry} | ${org.scale}`;
		},
		getTips(org){
			if(org.state==2){
				return "提示："+org.reason;
			}
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
					navTitle = `企业(${total})`;
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
			if (power.isForbidden) {
				btnList.push({ text: state == 5 ? "启用" : "禁用", icon: state == 5 ? "iconqiyong" : "iconjinyong" });
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
			if (btn.text == "编辑") {
				uni.navigateTo({
					url: `/pages/manage/organization/organization/edit?id=${item.orgId}`
				});
			} else if (btn.text == "审核") {
				// 跳转审核页面
				uni.navigateTo({
					url: `/pages/manage/organization/organization/examine?id=${item.orgId}`
				});
			} else {
				// 启用/禁用企业,弹出框提示
				this.chooseOrg = item;
				this.$refs.msgmodal.show(`<span>是否${item.state == 5 ? "启用" : "禁用"}企业“</span><span style="color: #000;font-weight: bold">${item.orgName}</span><span>”？</span>`);
			}
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
		}
	}
}
</script>

<style scoped>
	.page-full {
	}
</style>
