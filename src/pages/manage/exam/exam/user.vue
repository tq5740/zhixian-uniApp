<template>
	<view class="exam-user page-full">
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-item" v-for="(o,i) of dataList" :key="i">
			<view class="list-item-conten">
				<view class="user">
					<list-item-org-user :logo="getLogo(o)" logoCircle :name="getName(o)" :intro="'报名时间：'+$formatDate(o.createTime,'YYYY-MM-DD hh:mm:ss')">
						<template v-slot:tips>
							<view class="tips">
								<text space="emsp">报名方式：</text>
								<text class="regMode">{{o.regMode==1?"管理员安排":"自主报名"}}</text>
							</view>
						</template>
					</list-item-org-user>
				</view>
				<view class="selecticon" v-show="o.examNumber<=0&&batchDelete" @tap="chooseDelete(o)">
					<text class="iconfont iconweixuanzhong" v-show="!o.willDelete"></text>
					<text class="iconfont iconxuanzhong" v-show="o.willDelete"></text>
				</view>
			</view>
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
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import {searchCheck} from "@/utils/utils.js"
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import {
		mapState
	} from "vuex"
	let getListFn = examApi.getExamRegListAdmin.bind(examApi);
	export default {
		components: {
			listItemOrgUser
		},
		data() {
			return {
					filterList:[{name:"报名方式",type:"regMode",children:[{name:"全部",value:null,choose:true},{name:"管理员安排",value:1},{name:"自主报名",value:2}]},{name:"是否合格",type:"isPass",children:[{name:"全部",value:null,choose:true},{name:"合格",value:1},{name:"不合格",value:0}]}],
				stateIconSize: uni.upx2px(30) + "px",
				pageNum: 1,
				pageTotal: 2,
				examId: undefined,
				dataList: [],
				canSignup: false,
				sortBy: false,
				query:"",
				regMode:undefined,
				isPass:undefined,
				sortField: "examRegId",
				batchDelete: false,
			};
		},
		computed: {
			defaultImg() {
				return this.$store.state.defaultImg.user;
			}
		},
		onLoad({
			id,
			name,
			endTime
		}) {
			this.$updateNavbarTitle(name);
			this.examId = id;
			this.getList();
			this.canSignup = endTime > new Date().getTime();
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
				this._getListFromServer(getListFn, restart, ["examId","query","regMode","isPass", "sortBy", "sortField"]);
			},
			onCreateBtnClick() {
				if (!this.canSignup) {
					uni.showToast({
						title: "考试已结束",
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/manage/exam/exam/addUser?examId=${this.examId}`
				})
			},
			onDeleteClick(o) {
				this.$refs.msg.show(
					`<span>是否删除用户“</span><span style="color: #000;font-weight: bold">${o.regUser.userName}</span><span>”？</span>`,
					JSON.stringify([o.examRegId]));
			},
			onMsgConfirm(flag) {
				uni.showLoading();
				examApi.postdeletExamRegAdmin({
					examId: this.examId,
					examRegIds: flag
				}).then(data => {
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
				});
			},
			getLogo(user) {
				if (!user.regUser) {
					return this.defaultImg;
				}
				return user.regUser.photo || this.defaultImg;
			},
			getName(user) {
				if (!user.regUser) {
					return "——";
				}
				return user.regUser.userName + '-' + user.regUser.phone
			},
			chooseDelete(item) {
				this.$set(item, "willDelete", !item.willDelete);
			},
			cancelDelete() {
				this.dataList.forEach(v => {
					if (v.willDelete) {
						this.$set(v, "willDelete", false);
					}
				});
				this.batchDelete = false;
			},
			confirmDelete() {
				let userIds = [];
				this.dataList.forEach(v => {
					if (v.willDelete) {
						userIds.push(v.examRegId);
					}
				});
				if (userIds.length == 0) {
					this.$toast("请选择要删除的用户");
					return;
				}
				this.$refs.msg.show(`<span>是否删除选中用户？</span>`, JSON.stringify(userIds));
				// this.onMsgConfirm(userIds.join(","));
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
	.exam-user {
		padding-bottom: 118upx;
	}

	.tips {
		background: #FFFFFF;
		font-size: $font-size-24;
		margin-bottom: 20upx;
		padding: 0px 0px 20upx 120upx;
		color: $color-999;

		.regMode {
			color: #6D9985;
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
	
	.list-item-conten{
		display: flex;align-items: center;
		width: 100%;
		background: #FFFFFF;
		margin-bottom: 20upx;
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
