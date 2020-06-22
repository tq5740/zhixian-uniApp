<template>
	<view class="lately-register page-full create-btn-padding-bottom">
		<search-filter :filterList="filterList" searchPlaceholder="请输入姓名或手机号码搜索" @onFilterMenuClick="onFilterMenuClick" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList(d.state)' @onBtnClick="onBtnClick" @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-org-user :name="d.name" :logo="d.photo||defaultImg" :logoCircle="true" :intro="d.regTime | getIntro" :state='d.state==1?"":"禁用"' :stateBgColor='d.state==1?"":"#FC703E"'
						:tips="d.identity|getTips" tipsColor="#999999">
						</list-item-org-user>
					</template>
				</list-item>
			</template>
		</view>
		<msg-modal ref="msgmodal" @onConfirm="onModalConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "@/api/modules/user.js"
import { formatDate } from "@/utils/utils.js"
import listItemOrgUser from "@/components/listItemOrgUser.vue"

let navTitle = "最近注册";
let getListFn = userApi.getRecentlyRegList.bind(userApi);
export default {
	components: {
		listItemOrgUser
	},
	data() {
		return {
			filterList: [{ name: "全部", value: undefined }, { name: "启用", value: 1 }, { name: "禁用", value: 2 }],
			dataList: [],
			pageNum: 1,
			pageTotal: 2,
			sortField: "regTime",
			sortBy: false,
			query: "",
			state: "",//1：正常；2：禁用
			chooseData: undefined
		}
	},
	computed: {
		defaultImg() {
			return this.$store.state.defaultImg.user; 
		}
	},
	filters: {
		getIntro: function (value) {
			return `注册时间：${formatDate(value, "YYYY-MM-DD hh:mm:ss")}`;
		},
		getTips: function (value) {
			if(!value){
				return `身份类型：普通用户`;
			}
			try{
				let j=JSON.parse(value);
				return `身份类型：${j.join(",")}`;
			}catch(e){
				return `身份类型：${value}`;
			}
		}
	},
	onShow() {
		this.$updateNavbarTitle(navTitle)
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false) {
			if (!this.power) {
				this.power = await this._getPower();
			}
			this._getListFromServer(getListFn, restart, ["query", "state", "sortField", "sortBy"]).then(total => {
				if (typeof total == "number") {
					navTitle = `最近注册(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state) {
			if (!this.power) return;
			let power=this.power;
			let btnList = [];
			if (power.isReset) {
				btnList.push({ text: "重置密码", icon: "iconzhongzhimima" });
			}
			btnList.push({ text: "登录记录", icon: "icondenglujilu" });
			if (power.isForbidden) {
				btnList.push({ text: state == 2 ? "启用" : "禁用", icon: state == 2 ? "iconqiyong" : "iconjinyong" });
			}
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/user/latelyregister/detail?user=${JSON.stringify(item)}`
			})
		},
		onBtnClick({ btn, item }) {
			if (btn.text == "重置密码") {
				this.chooseData = item;
				this.$refs.msgmodal.show(`<span>确定要将“${item.name}”的密码重置为：</span><span style="color: #000">cdjy9957</span><span>？</span>`, 'resetpwd');
			} else if (btn.text == "登录记录") {
				uni.navigateTo({
					url: `/pages/manage/user/latelyregister/loginrecord?userId=${item.userId}`
				})
			} else {// 启/禁用
				this.chooseData = item;
				this.$refs.msgmodal.show(`<span>是否${item.state == 2 ? "启用" : "禁用"}用户“</span><span style="color: #000;font-weight: bold">${item.name}</span><span>”？</span>`, "state");
			}
		},
		onModalConfirm(flag) {
			if ("resetpwd" == flag) {
				userApi.postUserResetPassword(this.chooseData.userId).then(data => {
					uni.showToast({
						title: "重置成功"
					})
				}).catch(err => {
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				})
			} else if ("state" == flag) {
				// 启用禁用
				let rqData = {
					userId: this.chooseData.userId,
					state: this.chooseData.state == 1 ? 2 : 1
				}
				userApi.postUpdateUserState(rqData).then(data => {
					this.$toast("操作成功！");
					this.getList(true);
				}).catch(err => {
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				})
			}

		},
		onFilterMenuClick(f) {
			if (f.value != this.state) {
				this.state = f.value;
				this.getList(true);
			}
		},
		onSearch(query) {
			if (query != this.query) {
				this.query = query;
				this.getList(true);
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.lately-register {
 min-height: calc(100% - #{$create-btn-height});
	}
</style>
