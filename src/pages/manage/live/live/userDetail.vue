<template>
	<view class="user-detail page-full">
		<info-list :infolist="infolist"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infolist: []
			};
		},
		computed:{
			noData(){
				return this.infolist.length == 0;
			}
		},
		onLoad({user,title}) {
			this.$updateNavbarTitle(title)
			user=JSON.parse(user);
			this.infolist= [
				[{
					title: "用户头像",
					el: "image",
					horizontal: true,
					width: 120,
					value: user.regUser.photo||this.$store.state.defaultImg.user
				}],[{
						title: "姓名",
						el: "text",
						value: user.regUser.userName
					},
					{
						title: "手机号",
						el: "text",
						value: user.regUser.phone
					},
					{
						title: "报名方式",
						el: "text",
						value: user.regMode==1?"管理员安排":"自主报名"
					},
					{
						title: "角色",
						el: "text",
						value: this.getRole(user.role)
					}
				],
				[{
						title: "观看总时长",
						el: "text",
						value: this.$formatDuration(user.length)
					},
					{
						title: "最后观看时间",
						el: "text",
						value: this.$formatDate(user.updateTime,"YYYY-MM-DD hh:mm:ss")
					},
					{
						title: "上次观看章节",
						el: "text",
						value: user.liveChapterTitle||""
					}
				]
			]
		},
		methods:{
			getRole(val){
				if(val==1){
					return "主讲人";
				}else if(val==2){
					return "助教"; 
				}else if(val==3){
					return "互动者"; 
				}else if(val==4){
					return "旁观者"; 
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.user-detail{padding-bottom: 138upx;height: calc(100% - 138upx) }
</style>
