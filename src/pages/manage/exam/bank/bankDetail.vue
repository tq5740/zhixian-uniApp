<template>
	<view class="page-full">
		<info-list :infolist="infoList"></info-list>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				infoList:[]
			};
		},
		computed:{
			noData(){
				return this.infoList.length == 0;
			}
		},
		onLoad({bank}) {
			bank=JSON.parse(bank);
			this.$updateNavbarTitle( bank.examBankTitle);
			this.infoList=[
				[
					{
					title: "题库标题",
					el: "text",
					value: bank.examBankTitle
					},{
					title: "企业部门",
					el: "text",
					value: bank.orgModelBO.orgName
					}
				],
				[
					{
					title: "临时试题数量",
					el: "text",
					value: bank.temporaryNumber
					},{
					title: "正式试题数量",
					el: "text",
					value: bank.questionNumber
					},{
					title: "试卷数(套)",
					el: "text",
					value: bank.paperNumber
					}
				],
				[
					{
					title: "创建人",
					el: "text",
					value: bank.createUserName
					},{
					title: "创建时间",
					el: "text",
					value: this.$formatDate(bank.createTime,"YYYY-MM-DD hh:mm:ss")
					},
				]
			];
		},
		methods:{
		}
	}
</script>

<style lang="scss" scoped>

</style>
