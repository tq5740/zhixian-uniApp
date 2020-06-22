<template>
	<view class="exam-user-report">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d"  :btnList="getBtnList(d.maxScore)"
					@onBtnClick="onBtnClick" :key="i">
					 <template v-slot:content>
						<list-item-org-user :logo="getLogo(d)" :name="getName(d)"
						:state="d.isPass?'合格':'不合格'" :stateBgColor="d.isPass?'#42B983':'#FC703E'"
						 :tips="'报名人：'+d.createUserName+'  报名时间：'+$formatDate(d.updateTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999" logoCircle>
						 <template v-slot:intro>
						 	<view class="intro">
								<text class="examNumber">考试次数：<text class="count">{{d.examNumber}}</text></text>
								<text>最高成绩：<text class="score">{{$isEmpty(d.maxScore)?"-":d.maxScore}}</text></text>
							</view>
						 </template>
						</list-item-org-user>
					  </template>
				 </list-item>
			 </template>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import examApi from "@/api/modules/exam.js"
	import {searchCheck} from "@/utils/utils.js"
	let getListFn=examApi.getExamRegListAdmin.bind(examApi);
	export default {
		components: {
			listItemOrgUser
		},
		data() {
			return {
				filterList:[{name:"报名方式",type:"regMode",children:[{name:"全部",value:null,choose:true},{name:"管理员安排",value:1},{name:"自主报名",value:2}]},{name:"是否合格",type:"isPass",children:[{name:"全部",value:null,choose:true},{name:"合格",value:1},{name:"不合格",value:0}]}],
				pageNum: 1,
				pageTotal:2,
				examId:undefined,
				query:undefined,
				regMode:undefined,
				isPass:undefined,
				dataList:[],
				sortBy: false,
				sortField: "examRegId"
			};
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user; 
			}
		},
		onLoad({id}) {
			this.$updateNavbarTitle("考试报表");
			this.examId=id;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["examId","query","regMode","isPass","sortBy","sortField"]);
			},
			onBtnClick({item}){
				uni.navigateTo({
					url:`/pages/manage/exam/exam/examRecord?examId=${this.examId}&userId=${item.userId}&name=${item.regUser.userName}`
				})
			},
			onFilterMenuClick(obj) {
				if (this[obj.type] != obj.value) {
					this[obj.type] = obj.value;
					this.getList(true);
				}
			},
			/**搜索
			 * @param {Object} value 搜索关键字
			 */
			onSearch(value) {
				if (this.query != value) {
					if(!searchCheck(value))return;
					this.query = value;
					this.getList(true);
				}
			},
			getBtnList(score){
				if(!this.$isEmpty(score)){
					return [{text:"考试记录",icon:"icondenglujilu"}]
				}else return[];
			},
			getLogo(user){
				if(!user.regUser){
					return this.defaultImg;
				}
				return user.regUser.photo||this.defaultImg;
			},
			getName(user){
				if(!user.regUser){
					return "——";
				}
				return user.regUser.userName+'-'+user.regUser.phone
			}
		},
	}
</script>

<style lang="scss" scoped>
	.intro{
		color: $color-666;font-size: $font-size-24;
		.examNumber{
			margin-right: 25upx;
		}
		.count{
			color: #FC703E;
		}
		.score{
			color: #6D9985;
		}
	}
</style>
