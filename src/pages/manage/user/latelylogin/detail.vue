<template>
	<view class="lately-register-detail">
		<info-list :infolist="infoList"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
export default {
	computed: {
		noData() {
			return this.infoList.length == 0;
		}
	},
	data() {
		return {
			infoList: []
		}
	},
	onLoad({
		user
	}) {
		this.$updateNavbarTitle("用户信息")
		let u = JSON.parse(user);
		let addr = "";
		if (u.device == 2) {
			addr = "四川省成都市"
		} else {
			addr = u.province + u.city  + u.street
		}
		let infoList = [
			[{
				title: "用户头像",
				el: "image",
				horizontal: true,
				width: 120,
				value: u.photo || this.$store.state.defaultImg.user
			}],
			[
				{
					title: "用户姓名",
					el: "text",
					value: u.name
				}, {
					title: "手机号码",
					el: "text",
					value: u.phone
				}, {
					title: "设备",
					el: "text",
					value: u.device == 1 ? "手机" : "电脑"
				}, {
					title: "地点",
					el: "text",
					value: addr
				},
			],
			[
				{
					title: "登录时间",
					el: "text",
					value: this.$formatDate(u.loginTime, "YYYY-MM-DD hh:mm:ss")
				}, {
					title: "登录状态",
					el: "text",
					value: u.state == 1 ? "在线" : "离线"
				}, {
					title: "登录站点",
					el: "text",
					value: u.loginSite
				}, {
					title: "登录IP",
					el: "text",
					value: u.ip
				}
			]
		];
		this.infoList = infoList;
	},
	methods: {}
}
</script>

<style>
	page {
	  box-sizing: border-box;
	}
	.lately-register-detail {
	  height: 100%;
	  background: #f2f2f2;
	}
</style>
