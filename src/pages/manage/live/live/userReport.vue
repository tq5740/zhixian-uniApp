<template>
	<view class="live-user-report page-full">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d"  :btnList="d.length|getBtnList"
					@onBtnClick="onBtnClick"  @onItemClick="onItemClick" :key="i">
					 <template v-slot:content>
						<list-item-org-user :logo="d.regUser.photo||defaultImg" :name="d.regUser.userName+'-'+d.regUser.phone"
						 :tips="'最后观看时间：'+$formatDate(d.updateTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999" logoCircle>
						 <template v-slot:state>
						 	<view class="state">
								<text class="icon" :style="{background: getRoleColor(d.role)}"></text>
								<text>{{d.role|getRole}}</text>
							</view>
						 </template>
						 <template v-slot:intro>
						 	<view class="intro">
								<text>观看总时长：<text class="time">{{$formatDuration(d.length)}}</text></text>
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
	import {searchCheck} from "@/utils/utils.js"
	import liveApi from "@/api/modules/live.js"
	let getListFn=liveApi.getLiveRegListAdmin.bind(liveApi);
	export default {
		components: {
			listItemOrgUser
		},
		data() {
			return {
				filterList:[{name:"全部",type:"regMode",value:null},{name:"管理员安排",type:"regMode",value:1},{name:"自主报名",type:"regMode",value:2}],
				pageNum: 1,
				pageTotal:2,
				liveId:undefined,
				query:undefined,
				regMode:undefined,
				dataList:[],
			};
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user; 
			}
		},
		filters: {
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
			getBtnList(length){
				if(length>0){
					return [{text:"观看记录",icon:"icondenglujilu"}]
				}else return[];
			},
		},
		onLoad({id}) {
			this.$updateNavbarTitle("用户报表");
			this.liveId=id;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["liveId","query","regMode"]);
			},
			onBtnClick({item}){
				uni.navigateTo({
					url:`/pages/manage/live/live/watchRecord?liveId=${this.liveId}&userId=${item.userId}&name=${item.regUser.userName}`
				})
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/live/live/userDetail?user=${JSON.stringify(item)}&title=观看直播用户详情`
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
			getRoleColor(val){
				if(val==1){
					return "#FC703E";
				}else if(val==2){
					return "#FFAE00"; 
				}else if(val==3){
					return "#37A5D3"; 
				}else if(val==4){
					return "#42B983"; 
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.intro{
		color: $color-666;font-size: $font-size-24;
		.time{
			color: #FC703E;
		}
	}
	.state{
		width: 90upx;
		height: 25upx;
		color: $color-666;font-size: $font-size-24;
		display:flex;align-items:center;
		.icon{
			display: inline-block;
			width: 10upx;height: 10upx; border-radius: 50%;
			margin-right: 6upx;
		}
	}
</style>
