<template>
	<view class="auth-list page-full">
		<search-filter searchPlaceholder="请输入姓名或身份证号搜索" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(u,i) of dataList">
				<list-item :item="u" :btnList='getBtnList()' @onItemClick="onItemClick" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-org-user :name="u.name" :logo="u.idPhoto||defaultImg.user" :intro="'身份证号：'+u.idNumber" :tips="u.state==2?u.reason:'住址：'+(u.address||'-')" :tipsColor="u.state==2?'#FC703E':'#999999'" :state="u | getState" :stateBgColor="u | getStateColor">
						</list-item-org-user>
					</template>
				</list-item>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex"
import userApi from "@/api/modules/user.js"
import { formatDate, getAuthFilterList } from "@/utils/utils.js"
import examineModal from "@/components/examineModal.vue"
import listItemOrgUser from "@/components/listItemOrgUser.vue"
let navTitle = `认证管理`;
let getListFn = userApi.getUserAuthList.bind(userApi);
export default {
	components: {
		examineModal, listItemOrgUser
	},
	computed: {
		...mapState(['defaultImg'])
	},
	data() {
		return {
			auth: {},
			dataList: [],
			pageNum: 1,
			pageTotal: 2,
			state: "",
			query: "",
			filterList: getAuthFilterList()
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
	onPullDownRefresh() {
		this.getList(true);
	},
	filters: {
		getTips: function (u) {
			if (u.state == 2) {
				return u.reason;
			} else {
				if (!u.postName) { u.postName = "" };
				let len = u.postName.length;
				for (let i = 0; i < 4 - len; i++) {
					u.postName = u.postName + " ";
				}
				return `岗位：${u.postName} 入职时间：${formatDate(u.hireDate, "YYYY-MM-DD")}`;
			}
		},
		getState: function (u) {
			switch (u.state) {
				case 2:
					return "未通过";
				case 3:
					return "审核中";
				case 4:
					return "已通过";
			}
		},
		getStateColor: function (u) {
			switch (u.state) {
				case 2:
					return "#FC703E";
				case 3:
					return "#FFAE00";
				case 4:
					return "#42B983";
			}
		}
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false, rename = true) {
			if (!this.power) {
				this.power = await this._getPower();
			}
			this._getListFromServer(getListFn, restart, ["query", "state"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `认证管理(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList() {
			if (!this.power) return;
			let btnList = [];
			if (this.power.isAudit) {
				btnList.push({ text: "审核", icon: "iconshenhe" });
			}
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/user/auth/detail?id=${item.userId}`
			})
		},
		onBtnClick({ btn, item }) {
			// if (btn.text == "编辑") {
			// 	let obj = {
			// 		userId: item.userId,
			// 		name: item.name,
			// 		idNumber: item.idNumber
			// 	};
			// 	uni.navigateTo({
			// 		url: `/pages/manage/user/auth/edit?item=${JSON.stringify(obj)}`
			// 	});
			// }
			 if (btn.text == "审核") {
				uni.navigateTo({
					url: `/pages/manage/user/auth/detail?id=${item.userId}&examine=true`
				});
			}
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
	}
}
</script>

<style>
</style>
