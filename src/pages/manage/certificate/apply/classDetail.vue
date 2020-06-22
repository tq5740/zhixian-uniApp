<template>
	<view class="class-detail page-full">
		<view class="block">
			<info-text title="培训ID" :value="item.classId"></info-text>
			<info-text title="培训班级类型" :value="item.type==1?'技能培训':'创业培训'"></info-text>
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
			<info-text title="培训学校" :value="item.orgName||'-'"></info-text>
			<info-text title="所在区县" :value="item.district"></info-text>
		</view>
		<view class="block">
			<info-text title="创建时间" :value="$formatDate(item.createTime,'YYYY-MM-DD hh:mm:ss')"></info-text>
		</view>
	</view>
</template>

<script>
	import infoText from "@/components/infoText.vue"
	export default {
		components:{infoText},
		data() {
			return {
				item:{},
			};
		},
		onLoad({tClass}) {
			this.$updateNavbarTitle("详情");
			this.item=JSON.parse(tClass);
		}
	}
</script>

<style lang="scss">
	.block{margin-bottom: 20upx;}
</style>
