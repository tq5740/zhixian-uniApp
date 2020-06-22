<template>
	<!-- 详情、审核 -->
	<view class="signup-detail">
		<info-list :infolist="infolist"></info-list>
		<view v-if="examine" @tap="onShowExamineModal" class="btn">
			<text>审核</text>
		</view>
		<examine-modal ref="examine" :title="examineTitle" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import examineModal from "@/components/examineModal.vue"
	import artApi from "@/api/modules/article.js"
	import {getArticleRegState} from "@/utils/utils.js"
	const stateList=getArticleRegState();
	export default {
		components: {
			examineModal
		},
		data() {
			return {
				examine:false,
				examineTitle:'',
				articleId:undefined,
				phone:undefined,
				infolist:[]
			}
		},
		computed:{
			noData(){
				return this.infolist.length == 0;
			}
		},
		onLoad({examine,item}) {
			this.$updateNavbarTitle("用户信息");
			let u=JSON.parse(item);
			let infolist=[[
				{
					title:"用户姓名",
					el:"text",
					value:u.realName
				},{
					title:"手机号码",
					el:"text",
					value:u.phone
				},{
					title:"身份证号",
					el:"text",
					value:u.idCard
				}
				],[
				{
					title:"职务",
					el:"text",
					value:u.post
				},{
					title:"公司",
					el:"text",
					value:u.orgName
				},{
					title:"报名时间",
					el:"text",
					value:this.$formatDate(u.createTime,"YYYY-MM-DD hh:mm:ss")
				},{
					title:"状态",
					el:"text",
					value:stateList.find(v=>{
							return v.id==u.state;
						  }).text
				}
			]];
			this.infolist=infolist;
			if(examine){
				this.examine=true;
				this.examineTitle=`审核用户“${u.realName}”`;
				this.articleId=u.articleId;
				this.phone=u.phone;
			}
		},
		methods: {
			onShowExamineModal(){
				this.$refs.examine.show();
			},
			onExamine({pass,reason}){
				uni.showLoading();
				let data={
					remarks:reason,
					state:pass?4:2,
					articleId:this.articleId,
					phone: this.phone
				}
				artApi.postAuditArticleRegAdmin(data).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"审核成功",
						complete:()=> {
							this._refreshPrePage();
						}
					});
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
.signup-detail{height: 100%;background: $color-f2;}
.btn{width: 100%; height: 98upx;line-height: 98upx;color: $color-white;background: $color-main;font-size: $font-size-32;text-align: center;position: fixed;bottom: 0px;}
</style>
