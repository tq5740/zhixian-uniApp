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
			<info-text title="学员数量" :value="item.allCounts"></info-text>
			<info-text title="待打印数" :value="item.noPrints"></info-text>
			<info-text title="已打印数" :value="item.yesPrints"></info-text>
		</view>
		<view class="block">
			<info-text title="培训学校" :value="item.orgName||'-'"></info-text>
		</view>
		<view class="block">
			<info-text title="打印时间" :value="getPrintTime(item.printTime)"></info-text>
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
		},
		methods: {
			getPrintTime(printTime){
				if(this.$isEmpty(printTime))return "-";
				else return this.$formatDate(printTime,"YYYY-MM-DD hh:mm:ss")
			},
		},
	}
</script>

<style lang="scss">
	.block{margin-bottom: 20upx;}
</style>
