<template>
	<view class="train-user page-full create-btn-padding-bottom">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick"  @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList(d)' @onBtnClick="onBtnClick"  :showFooter="d.state!=1||!batchDelete" :key="i">
					<template v-slot:content>
						<view class="list-item-conten">
							<view class="user">
								<list-item-org-user :name="d.createUserName+'-'+d.phone" :logo="d.photo||defaultImg.user" :logoCircle="true"
								 :intro="'报名时间：'+$formatDate(d.createTime,'YYYY-MM-DD hh:mm:ss')" :tips="'报名方式：'+(d.regMode==1?'管理员安排':'自主报名')"
								 :tipsColor="'#999999'">
								</list-item-org-user>
							</view>
							<view class="selecticon" v-show="d.state==1&&batchDelete" @tap="chooseDelete(d)">
								<text class="iconfont iconweixuanzhong" v-show="!d.willDelete"></text>
								<text class="iconfont iconxuanzhong" v-show="d.willDelete"></text>
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
			<view class="delete" @tap="batchDelete=true">
				<text class="iconfont iconshanchu"></text>
				<text>批量删除</text>
			</view>
			<view @tap="onCreateBtnClick">
				<text class="iconfont iconchuangjian"></text>
				<text>添加用户</text>
			</view>
		</view>
		<examine-modal ref="examinemodal" :title="'审核报名'" @onExamine="onExamine"></examine-modal>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import trainApi from "@/api/modules/train.js"
		import {getCourseUserReportState,searchCheck} from "@/utils/utils.js"
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import examineModal from "@/components/examineModal.vue"
	import {
		mapState
	} from "vuex"
	let stateList=getCourseUserReportState();
	let getListFn = trainApi.getTrainRecordListAdmin.bind(trainApi);
	export default {
		components: {
			listItemOrgUser,
			examineModal
		},
		data() {
			return {
				filterList:[{name:"报名方式",type:"regMode",children:[]},{name:"状态",type:"state",children:[]}],
				stateIconSize: uni.upx2px(30) + "px",
				pageNum: 1,
				pageTotal: 2,
				trainId: undefined,
				sortBy:false,
				sortField:"userId",
				dataList: [],
				userIds: "",
				batchDelete: false,
			};
		},
		computed: {
			...mapState(['defaultImg'])
		},
		onLoad({
			id,
			name
		}) {
			this.$updateNavbarTitle(name);
			this.trainId = id;
			this.getList();
			let stateFilterList=[];
			stateList.forEach(v=>{
				stateFilterList.push({name:v.text,value:v.id})
			});
			stateFilterList.unshift({name:"全部",value:null,choose:true});
			this.filterList[0].children = [{name:"全部",choose:true,value:null},{name:"管理员安排",value:1},{name:"自主报名",value:2}];
			this.filterList[1].children = stateFilterList;
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
				this._getListFromServer(getListFn, restart, ["trainId","query","regMode","state","sortBy","sortField"]);
			},
			getBtnList(d) {
				let btnList = [];
				
				if(d.regState==4&&d.state == 1){
					return btnList;//只有删除按钮，就不显示按钮了
				}
				
				if (d.regState != 4) {
					btnList.push({
						text: "审核",
						icon: "iconshenhe",
						key: "examine"
					});
				}

				if (d.state == 1) {
					btnList.push({
						text: "删除",
						icon: "iconshanchu",
						key: "delete"
					});
				}

				return btnList;
			},
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
				this.userIds=userIds.join(",");
				this.$refs.msg.show(`<span>是否删除选中用户？</span>`, "删除");
				// this.onMsgConfirm("删除");
			},
			/**
			 * 审核
			 */
			onExamine(result) {
				let regState = result.pass ? 4 : 2;
				trainApi.auditTrainRecordAdmin({
					userIds: this.userIds,
					trainId: this.trainId,
					regState,
					reason: result.reason
				}).then(data => {
					this.$toast("审核成功！");
					this.getList();
					this.showMark = false;
				})
			},
			onBtnClick({
				btn,
				item
			}) {
				this.userIds = item.userId;
				if (btn.text == "审核") {
					this.$refs.examinemodal.show();
					this.$refs.examinemodal.clear();
				} else if (btn.text == "删除") {
					this.$refs.msg.show(
						`<span>是否删除用户“</span><span style="color: #000;font-weight: bold">${item.realName}</span><span>”？</span>`, "删除");
				}
			},
			onCreateBtnClick() {
				uni.navigateTo({
					url: `/pages/manage/train/train/addUser?trainId=${this.trainId}`
				})
			},
			onMsgConfirm(flag) {
				if (flag == "删除") {
					uni.showLoading();
					trainApi.postDeleteTrainRecordAdmin({
						trainId: this.trainId,
						userIds: this.userIds
					}).then(data => {
						uni.hideLoading();
						this.getList(true);
					}).catch(err=>{
						uni.hideLoading();
					})
				}
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
	.train-user {
		min-height: calc(100% - #{$create-btn-height});
	}

	.tips {
		background: #ffffff;
		font-size: $font-size-24;
		margin-bottom: 20upx;
		padding: 0px 0px 20upx 120upx;
		color: $color-999;

		.regMode {
			color: #6d9985;
		}
	}


	.create-btn {
		display: flex;

		.delete {
			color: #666666;
			position: relative;
		}

		.delete::after {
			content: "";
			display: inline-block;
			position: absolute;
			right: 0upx;
			top: calc((#{$create-btn-height} - 38upx) / 2);
			width: 1upx;
			height: 38upx;
			background: #D8D8D8;
		}

		.confirm-delete {
			color: #FC703E;
		}

		view {
			text-align: center;
			flex-grow: 1;
		}
	}


	.list-item-conten {
		display: flex;
		align-items: center;
		width: 100%;
		background: #FFFFFF;

		.user {
			flex-grow: 1;
		}

		.selecticon {
			padding-right: 30upx;

			.iconfont {
				font-size: $font-size-40;
			}
		}
	}
</style>
