<template>
	<view class="course-user page-full create-btn-padding-bottom">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick"  @onSearch="onSearch"></search-filter>
		<view class="list-content">
			<template  v-for="(o,i) of dataList" >
				<list-item :item="o"  
					@onBtnClick="onDeleteClick" :showFooter="o.state!=1||!batchDelete"  :key="i">
					 <template v-slot:content>
						<view class="list-item-conten">
							<view class="user">
								<list-item-org-user :logo="o.photo||defaultImg" logoCircle :name="(o.realName||'')+'-'+(o.phone||'')" :intro="'报名时间：'+$formatDate(o.createTime,'YYYY-MM-DD hh:mm:ss')">
									<template v-slot:tips>
										<view class="tips">
											<text space="emsp">报名方式：</text>
											<text class="regMode">{{o.regMode==1?"管理员安排":"自主报名"}}</text>
										</view>
									</template>
								</list-item-org-user>
							</view>
							<view class="selecticon" v-show="o.state==1&&batchDelete" @tap="chooseDelete(o)">
								<text class="iconfont iconweixuanzhong" v-show="!o.willDelete"></text>
								<text class="iconfont iconxuanzhong" v-show="o.willDelete"></text>
							</view>
						</view>
					  </template>
				 </list-item>
			</template>
		</view>
		<view v-if="batchDelete" class="create-btn">
			<view class="delete" @tap="cancelDelete">
				<text>取消</text>
			</view>
			<view class="confirm-delete" @tap="confirmDelete">
				<text>确定删除</text>
			</view>
		</view>
		<view v-else class="create-btn">
			<view class="delete"  @tap="batchDelete=true" >
				<text class="iconfont iconshanchu"></text>
				<text>批量删除</text>
			</view>
			<view  @tap="onCreateBtnClick">
				<text class="iconfont iconchuangjian"></text>
				<text>添加用户</text>
			</view>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import trainApi from "@/api/modules/train.js"
	import {getCourseUserReportState,searchCheck} from "@/utils/utils.js"
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import { mapState } from "vuex"
	let stateList=getCourseUserReportState();
	let getListFn = trainApi.getCourseRecordListAdmin.bind(trainApi);
	export default {
		components: {
			listItemOrgUser
		},
		data() {
			let stateFilterList=[];
			stateList.forEach(v=>{
				stateFilterList.push({name:v.text,value:v.id})
			});
			stateFilterList.unshift({name:"全部",value:null,choose:true});
			return {
				stateIconSize: uni.upx2px(30) + "px",
				pageNum: 1,
				pageTotal: 2,
				courseId: undefined,
				sortBy:false,
				sortField:"userId",
				query:"",
				dataList: [],
				batchDelete:false,
				filterList:[{name:"报名方式",type:"regMode",children:[{name:"全部",choose:true,value:null},{name:"管理员安排",value:1},{name:"自主报名",value:2}]},
							{name:"状态",type:"state",children:stateFilterList}]
			};
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user; 
			}
		},
		onLoad({ id, name }) {
			this.$updateNavbarTitle(name);
			this.courseId = id;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if (refresh)
				this.getList(true);
		},
		methods: {
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn, restart, ["courseId","query","regMode","state","sortBy","sortField"]);
			},
			onCreateBtnClick() {
				uni.navigateTo({
					url: `/pages/manage/train/course/addUser?courseId=${this.courseId}`
				})
			},
			// getBtnList(state){
			// 	// 1：未尝试；2：未完成；3：已完成
			// 	if(state==1){
			// 		return [{text:`删除`,icon:"iconshanchu",key:"shanchu"}];
			// 	}
			// },
			chooseDelete(item){
				this.$set(item,"willDelete",!item.willDelete);
			},
			cancelDelete(){
				this.dataList.forEach(v=>{
					if(v.willDelete){
						this.$set(v,"willDelete",false);
					}
				});
				this.batchDelete=false;
			},
			confirmDelete(){
				let userIds=[];
				this.dataList.forEach(v=>{
					if(v.willDelete){
						userIds.push(v.userId);
					}
				});
				if(userIds.length==0){
					this.$toast("请选择要删除的用户");return;
				}
				this.$refs.msg.show(`<span>是否删除选中用户？</span>`, userIds.join(","));
				// this.onMsgConfirm(userIds.join(","));
			},
			onDeleteClick({item:o}) {
				this.$refs.msg.show(`<span>是否删除用户“</span><span style="color: #000;font-weight: bold">${o.realName}</span><span>”？</span>`, o.userId);
			},
			onMsgConfirm(flag) {
				uni.showLoading();
				trainApi.postDeleteCourseRecordAdmin({
					courseId: this.courseId,
					userIds: flag
				}).then(data => {
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
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
	.course-user {
	  min-height: calc(100% - #{$create-btn-height});
	  // max-height: auto;
	}
	.tips {
	  background: #ffffff;
	  font-size: $font-size-24;
	  // margin-bottom: 20upx;
	  padding: 0px 0px 20upx 120upx;
	  color: $color-999;
	  .regMode {
	    color: #6d9985;
	  }
	}
	
	.create-btn{
		display: flex;
		.delete{
			color: #666666;
			position: relative;
		}
		.delete::after{
			content: "";
			display: inline-block;
			position: absolute;right: 0upx;top: calc((#{$create-btn-height} - 38upx) / 2);
			width: 1upx;
			height: 38upx;
			background: #D8D8D8;
		}
		.confirm-delete{
			color: #FC703E;
		}
		view{
			text-align: center;
			flex-grow: 1;
		}
	}
	
	
	.list-item-conten{
		display: flex;align-items: center;
		width: 100%;
		background: #FFFFFF;
		.user{
			flex-grow: 1;
		}
		.selecticon{
			padding-right: 30upx;
			.iconfont{
				font-size: $font-size-40;
			}
		}
	}
	
</style>
