<template>
	<view class="class-detail page-full">
		<view class="block">
			<info-text title="企业名称" :value="orgName"></info-text>
			<info-text title="培训班级类型" :value="item.type==1?'技能培训':'创业培训'"></info-text>
			<info-text title="培训ID" :value="item.classId"></info-text>
		</view>
		<view class="block">
			<info-text title="培训工种" :value="item.trainMajor"></info-text>
			<info-text title="专业等级" :value="item.majorLevel"></info-text>
		</view>
		<view class="block">
			<info-text title="开始日期" :value="$formatDate(item.startDate,'YYYY-MM-DD')"></info-text>
			<info-text title="结束日期" :value="$formatDate(item.endDate,'YYYY-MM-DD')"></info-text>
		</view>
		<view class="block">
			<info-text title="老师姓名" :value="item.tutorName"></info-text>
			<info-text title="所在区县" :value="item.district"></info-text>
			<info-text title="街道地址" :value="item.street"></info-text>
		</view>
		<view class="block">
			<info-text title="创建人" :value="item.createUserName"></info-text>
			<info-text title="创建时间" :value="$formatDate(item.createTime,'YYYY-MM-DD hh:mm:ss')"></info-text>
		</view>
	</view>
</template>

<script>
	import infoText from "@/components/infoText.vue"
	import userApi from "@/api/modules/user.js"
	export default {
		components:{infoText},
		data() {
			return {
				item:{},
				orgName:undefined
			};
		},
		onLoad({tClass}) {
			this.$updateNavbarTitle("详情");
			this.item=JSON.parse(tClass);
			userApi.getQueryOrg(this.item.orgId).then(data=>{
				if(data)
				this.orgName=data.orgName;
			});
		}
	}
</script>

<style lang="scss">
	.block{margin-bottom: 20upx;}
</style>
