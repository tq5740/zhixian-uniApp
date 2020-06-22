<template>
	<view class="admin-detail">
		<info-list :infolist="infoList"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoList: []
			}
		},
		computed:{
			noData(){
				return this.infoList.length == 0;
			}
		},
		onLoad({
			user
		}) {
			this.$updateNavbarTitle("管理员信息")
			let u = JSON.parse(user);
			let infoList = [
				[{
					title: "用户头像",
					el: "image",
					horizontal: true,
					width: 120,
					value: u.photo||this.$store.state.defaultImg.user
				}],
				[
					{
					title: "用户姓名",
					el: "text",
					value: u.name
					},{
					title: "手机号码",
					el: "text",
					value: u.phone
					},{
					title: "角色名称",
					el: "text",
					value: u.roleName
					},{
					title: "权限范围",
					el: "text",
					value: u.permissionDept
					},
				],
				[
					{
					title: "修改人",
					el: "text",
					value: u.updateUserName
					},{
					title: "修改时间",
					el: "text",
					value: this.$formatDate(u.updateTime,"YYYY-MM-DD hh:mm:ss")
					},
				]
			];
			this.infoList=infoList;
		},
		methods: {}
	}
</script>

<style>
	.admin-detail {
		height: 100%;
		background: #F2F2F2;
	}
</style>
