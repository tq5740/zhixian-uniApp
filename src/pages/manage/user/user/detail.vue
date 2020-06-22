<template>
	<view class="user-detail">
		<info-list :infolist="infolist"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	import userApi from "@/api/modules/user.js"

	export default {
		computed: {
			noData(){
				return this.infolist.length == 0;
			},
			...mapState(['defaultImg'])
		},
		data() {
			return {
				infolist: []
			}
		},
		onShow() {
			this.$updateNavbarTitle("员工信息")
		},
		onLoad({
			user
		}) {
			user=JSON.parse(user);
			let infolist = [
				[{
					title: "用户头像",
					el: "image",
					horizontal:true,
					width:120,
					value: user.photo||this.defaultImg.user
				}],
				[{
					title: "员工编号",
					el: "text",
					value: user.employeeNumber
				},{
					title: "用户姓名",
					el: "text",
					value: user.name
				}, {
					title: "手机号码",
					el: "text",
					value: user.phone
				}, {
					title: "电子邮箱",
					el: "text",
					value: user.email
				}],
				[{
					title: "企业部门",
					el: "text",
					value: user.deptName
				}, {
					title: "企业岗位",
					el: "text",
					value: user.postName
				}, {
					title: "入职时间",
					el: "text",
					value: this.$formatDate(user.hireDate, "YYYY-MM-DD")
				}]
			]
			this.infolist = infolist;
		}
	}
</script>

<style>
	.user-detail {
		background-color: #F2F2F2;
		height: 100%;
	}
</style>
