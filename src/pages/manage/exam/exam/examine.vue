<template>
	<view class="exam-examin page-full">
		<info-list :infolist="infolist"></info-list>
		<view  class="bottom-full-btn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" :title="examName" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import userApi from "@/api/modules/user.js"
	import examApi from "@/api/modules/exam.js"
	import examineModal from "@/components/examineModal.vue"
	
	export default {
		components: {
			examineModal
		},
		computed:{
			noData(){
				return this.infolist.length == 0;
			}
		},
		data() {
			return {
				infolist: [],
				id: undefined,
				examName:undefined
			};
		},
		onLoad({id,categoryTitle,examBankTitle}) {
			this.$updateNavbarTitle("审核");
			uni.showLoading({
				title:"请稍等"
			});
			this.id=id;
			examApi.getQueryExamAdmin(id).then(exam=>{
				this.examName=exam.examTitle;
				this.infolist= [
					[{
							title: "企业名称",
							el: "text",
							value: ""
						},
						{
							title: "考试标题",
							el: "text",
							value: exam.examTitle
						}
					],
					[{
						title: "考试封面",
						el: "image",
						horizontal: true,
						width: 203,
						height: 114,
						value: exam.examImg||this.$store.state.defaultImg.exam
					}],
					[{
							title: "考试类型",
							el: "text",
							value:exam.type == 1 ? "练习" : exam.type == 2 ? "考试" : "补考"
						},
						{
							title: "所属题库",
							el: "text",
							value: exam.examBankTitle||examBankTitle
						},
						{
							title: "考试分类",
							el: "text",
							value: exam.categoryTitle||categoryTitle
						},
						{
							title: "可见范围",
							el: "text",
							value: exam.visibleRange == 1 ? "仅自己" : exam.visibleRange == 2 ? "本企业" : "开放"
						}
					],
					[{
							title: "考完显示成绩",
							el: "text",
							value:exam.isDisplay?"显示":"不显示"
					}],
					[{
							title: "考试开始时间",
							el: "text",
							value: this.$formatDate(exam.startTime,"YYYY-MM-DD hh:mm:ss")
						},
						{
							title: "考试时长",
							el: "text",
							value: exam.type==1?"不限":exam.examLength+"分钟"
					}],
					[{
							title: "原价",
							el: "text",
							value: exam.originalPrice
						},
						{
							title: "现价/优惠价",
							el: "text",
							value: exam.price
					}],
					[{
						title: "课程简介",
						el: "textarea",
						disabled: true,
						value: this.$escape2Html(exam.intro||"")
					}]
				]
				userApi.getQueryOrg(exam.orgId).then(data=>{
					if(data)
					this.infolist[0][0].value=data.orgName;
				});
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		},
		methods:{
			onBtnClick(){
				this.$refs.examineModal.show(`审核“${this.examName}”`)
			},
			onExamine({pass,reason}){
				uni.showLoading();
				let rqData={
					examId:this.id,
					state:pass?4:2,
					reason
				}
				examApi.postAuditExamAdmin(rqData).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"审核成功",
						complete:()=> {
							this._refreshPrePage();
						}
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.exam-examin{padding-bottom: 138upx;min-height: calc(100% - 138upx) }
</style>
