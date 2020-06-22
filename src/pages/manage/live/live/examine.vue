<template>
	<view class="live-examin page-full create-btn-padding-bottom">
		<info-list :infolist="infolist"></info-list>
		<view  class="bottom-full-btn" @tap="onBtnClick">
			<text class="info-item-btn">审核</text>
		</view>
		<examine-modal ref="examineModal" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import userApi from "@/api/modules/user.js"
	import liveApi from "@/api/modules/live.js"
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
				liveName:undefined
			};
		},
		onLoad({id,categoryTitle}) {
			this.$updateNavbarTitle("审核");
			uni.showLoading({
				title:"请稍等"
			});
			this.id=id;
			liveApi.getQueryLiveAdmin(id).then(live=>{
				this.liveName=live.liveTitle;
				this.infolist= [
					[{
							title: "企业名称",
							el: "text",
							value: ""
						},
						{
							title: "直播标题",
							el: "text",
							value: live.liveTitle
						}
					],
					[{
						title: "直播封面",
						el: "image",
						horizontal: true,
						width: 203,
						height: 114,
						value: live.liveImg||this.$store.state.defaultImg.live
					}],
					[{
							title: "直播分类",
							el: "text",
							value: categoryTitle
						},
						{
							title: "可见范围",
							el: "text",
							value: live.visibleRange == 1 ? "仅自己" : live.visibleRange == 2 ? "本企业" : "开放"
						}
					],
					[{
							title: "原价",
							el: "text",
							value: live.originalPrice
						},
						{
							title: "现价/优惠价",
							el: "text",
							value: live.price
						}
					],
					[{
						title: "直播简介",
						el: "richtext",
						disabled: true,
						value:this.$escape2Html( live.intro||"")
					}]
				]
				userApi.getQueryOrg(live.orgId).then(data=>{
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
				this.$refs.examineModal.show(`审核“${this.liveName}”`)
			},
			onExamine({pass,reason}){
				let rqData={
					liveId:this.id,
					state:pass?4:2,
					reason
				}
				uni.showLoading();
				liveApi.postAuditLiveAdmin(rqData).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"审核成功",
						complete:()=> {
							this._refreshPrePage();
						}
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						});
					},2000);
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
.live-examin{min-height: calc(100% - #{$create-btn-height});
 }
</style>
