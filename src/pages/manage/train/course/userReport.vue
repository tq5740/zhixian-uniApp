<template>
	<view class="course-userreport">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick"  @onSearch="onSearch"></search-filter>
		<view class="list-content">
			<list-item-user-report v-for="(d,i) of dataList" :key="i" :item="d" 
			 :name="(d.realName||'')+'-'+(d.phone||'')" :img="d.photo||defaultImg" :progress="$getFloat(d.progress*100,2)" :length="d.length" :score="d.score"
			 :lastTime="d.createTime == d.updateTime ? 0 : d.updateTime" :state="d.state | getState" :stateBg="d.state | getStateBg"
			 @onItemClick="onItemClick" >
			</list-item-user-report>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import listItemUserReport from "@/components/listItemUserReport.vue"
	import {getCourseUserReportState,searchCheck} from "@/utils/utils.js"
	import trainApi from "@/api/modules/train.js"
	
	let stateList=getCourseUserReportState();
	let getListFn=trainApi.getCourseRecordListAdmin.bind(trainApi);
	
	export default {
		components: {
			listItemUserReport
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user; 
			}
		},
		data() {
			let stateFilterList=[];
			stateList.forEach(v=>{
				stateFilterList.push({name:v.text,value:v.id})
			});
			stateFilterList.unshift({name:"全部",value:null,choose:true})
			return {
				filterList:[{name:"报名方式",type:"regMode",children:[{name:"全部",choose:true,value:null},{name:"管理员安排",value:1},{name:"自主报名",value:2}]},
							{name:"状态",type:"state",children:stateFilterList}],
				pageNum: 1,
				pageTotal:2,
				courseId:undefined,
				query:"",
				regMode:null,
				state:null,
				dataList:[],
			};
		},
		filters: {
			getState(val){
				return stateList.find(v=>{
					return v.id==val;
				}).text;
			},
			getStateBg(val){
				return stateList.find(v=>{
					return v.id==val;
				}).color;
			}
		},
		onLoad({id}) {
			this.$updateNavbarTitle("用户报表");
			this.courseId=id;
			this.getList()
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["courseId","query","regMode","state"]);
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/train/course/studyReport?courseId=${item.courseId}&userId=${item.userId}&userName=${item.realName}`
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
		},
	}
</script>

<style lang="scss" scoped>
	image{
		width: 80upx;height: 80upx;border-radius: 50%;margin-right: 20upx;
	}
	.data-item{
		background: #FFFFFF;padding: 40upx 20upx;font-size: $font-size-24;
		display: flex;
		&-info{
			flex-grow: 1;
			display: flex; flex-direction: column; justify-content: space-between;
			&-name{
				font-size:$font-size-30;font-weight:bold;
			}
			&-study{
				display: flex;
				.progress{
					display: flex;align-items:center;
					margin-right: 29upx;
					&-out{
						position: relative;
						display: inline-block;
						width: 100upx;height: 8upx;border-radius: 4upx;background: #D8D8D8;margin-right: 11upx;
					}
					&-in{
						position: absolute;left: 0px;top: 0px;
						display: inline-block;
						width: 50upx;
						height: 8upx;border-radius: 4upx;background:linear-gradient(90deg,#FFAE00 0%,#FC703E 100%);
					}
					&-text{
						color: #FC703E;
					}
			}
			.duration{
				&-title{
					color: $color-666;
				}
				&-time{
					color: #FC703E;
				}
			}
			
		}
		
		}
		&-state{
			$h:38upx;
			background: $color-main;
			width: 94upx;height: $h;line-height: $h;text-align: center;color: #FFFFFF; border-radius: 19upx;
		}
	}
	.data-footer{
		$h:80upx;
		position: relative;
		padding: 0px 20upx;
		background: #FFFFFF;
		height: $h;line-height: $h;
		font-size: $font-size-24;color: $color-999;
		.score{
			color:#6D9985;
			margin-right: 30upx;
		}
	}
</style>
