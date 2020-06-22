<template>
	<view class="singup-user page-full">
		<data-picker ref="picker" mode="selector" :dataList='[{name:"主讲人",value:1},{name:"助教",value:2},{name:"互动者",value:3},{name:"旁观者",value:4}]' @onPickerChoose="onPickerChoose"></data-picker>
		<search-filter searchPlaceholder="请输入姓名/手机号搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d"  :btnList="d.length|getBtnList"
					@onBtnClick="onBtnClick" :key="i" :showFooter="!(d.length<=0&&batchDelete)">
					 <template v-slot:content>
						 <view class="list-item-conten">
						 	<view class="user">
						<list-item-org-user :logo="d.regUser.photo||defaultImg" :name="d.regUser.userName+'-'+d.regUser.phone"
						 :tips="'最后观看时间：'+$formatDate(d.updateTime,'YYYY-MM-DD hh:mm:ss')" tipsColor="#999999" logoCircle>
						 <template v-slot:state>
						 	<view class="state" v-show="!(d.length<=0&&batchDelete)">
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
						</view>
							<view class="selecticon" v-show="d.length <= 0&&batchDelete" @tap="chooseDelete(d)">
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
	import listItemOrgUser from "@/components/listItemOrgUser.vue"
	import dataPicker from "@/components/dataPicker.vue"
	import liveApi from "@/api/modules/live.js"
	import {searchCheck} from "@/utils/utils.js"
	let getListFn=liveApi.getLiveRegListAdmin.bind(liveApi);
	export default {
		components: {
			listItemOrgUser,dataPicker
		},
		data() {
			return {
				filterList:[{name:"全部",type:"regMode",value:null},{name:"管理员安排",type:"regMode",value:1},{name:"自主报名",type:"regMode",value:2}],
				pageNum: 1,
				pageTotal:2,
				liveId:undefined,
				query:undefined,
				regMode:undefined,
				sortBy:false,
				sortField:"userId",
				dataList:[],
				chooseItem:{},
				batchDelete:false,
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
			getBtnList(val){
				let btnList=[{text:`编辑角色`,icon:"iconbianji"}];
				if(+val <= 0){
					btnList.push({text:`删除`,icon:"iconshanchu"});
				}
				return btnList;
			},
		},
		onLoad({id,name}) {
			this.$updateNavbarTitle(name);
			this.liveId=id;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true);
		},
		methods: {/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["liveId","query","regMode","sortBy","sortField"]);
			},
			onCreateBtnClick(){
				uni.navigateTo({
					url:`/pages/manage/live/live/addUser?liveId=${this.liveId}`
				})
			},
			onBtnClick({btn:{text},item}){
				this.chooseItem=item;
				if(text=="编辑角色"){
					this.$refs.picker.show();
				}else if(text=="删除"){
					this.$refs.msg.show(
						`<span>是否删除用户“</span><span style="color: #000;font-weight: bold">${item.regUser.userName}</span><span>”？</span>`,item.liveRegId);
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/live/live/userDetail?user=${JSON.stringify(item)}&title=报名用户详情`
				})
			},
			onMsgConfirm(flag) {
				uni.showLoading();
				liveApi.postDelLiveRegAdmin(flag).then(data=>{
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {uni.hideLoading();});
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
						userIds.push(v.liveRegId);
					}
				});
				if(userIds.length==0){
					this.$toast("请选择要删除的用户");return;
				}
				this.$refs.msg.show(
					`<span>是否删除选中用户？</span>`,userIds.join(","));
				// this.onMsgConfirm(userIds.join(","));
			},
			onPickerChoose(choose){
				uni.showLoading();
				liveApi.postUpdateLiveRegAdmin({
					liveId:this.liveId,
					liveRegId:this.chooseItem.liveRegId,
					role:choose.value
				}).then(data=>{
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
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
	.singup-user{
		padding-bottom: 138upx;
	}
	
	
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
