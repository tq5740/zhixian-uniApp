<template>
	<view class="lately-login page-full">
		<search-filter searchPlaceholder="请输入姓名或手机号码搜索" @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-org-user :name="d.name" :logo="d.photo||defaultImg" :logoCircle="true" :intro="d.loginTime | getIntro" :state="d.device | getDevice" :stateColor="d.device==1?'#6D9985':'#F0A442'" :stateIcon="d.device==1?'iconshouji':'icondiannao'">
						</list-item-org-user>
					</template>
					<template v-slot:footer>
						<view class="list-item-footer van-hairline--top uni-ellipsis">
							<text space="ensp">手机号码：{{d.phone}}   登录站点：{{d.loginSite}}</text>
						</view>
					</template>
				</list-item>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "../../../../api/modules/user.js"
import { formatDate } from "../../../../utils/utils.js"
import listItemOrgUser from "../../../../components/listItemOrgUser.vue"
let navTitle = "最近登录";
let getListFn = userApi.getRecentlyLoginList.bind(userApi);
export default {
	components: {
		listItemOrgUser
	},
	data() {
		return {
			dataList: [],
			pageNum: 1,
			pageTotal: 2,
			query: "",
		}
	},
	computed: {
		defaultImg() {
			return this.$store.state.defaultImg.user; 
		}
	},
	filters: {
		getIntro: function (value) {
			return `登录时间；${formatDate(value, "YYYY-MM-DD hh:mm:ss")}`;
		},
		getDevice: function (value) {
			switch (value) {
				case 1:
					return "手机";
				case 2:
					return "电脑";
				default:
					return "未知";
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
			this._getListFromServer(getListFn, restart, ["query"]).then(total => {
				if (typeof total == "number") {
					navTitle = `最近登录(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/user/latelylogin/detail?user=${JSON.stringify(item)}`
			})
		},
		onSearch(query) {
			if (query != this.query) {
				this.query = query;
				this.getList(true);
			}
		}
	}
}
</script>

<style scoped>
	.list-item-footer {
	  position: relative;
	  font-size: 24upx;
	  color: #999999;
	  background: #ffffff;
	  height: 79upx;
	  line-height: 79upx;
	  padding: 0px 20upx;
	}
</style>
