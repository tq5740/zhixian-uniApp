<template>
	<view class="venue-signup">
		<search-select :dataList="orgList" @onPickerChoose="onPickerChoose" @onSearch="onSearch" searchPlaceholder="请输入职位名称"></search-select>
		<scroll-view v-show="!noData"  @scrolltolower="getList(false)" class="work-list hide-scrollbar" scroll-y>
			<template v-for="(v,i) of dataList">
				<view class="work-list-item van-hairline--bottom" :key="i" @tap="onWorkClick(v)">
					<text>{{v.workTitle}}</text>
					<view class="state-xuanz">
						<text v-if="v.venueAudit" :style="{color:getStateOrColor(v.venueAudit)}">
							{{getStateOrColor(v.venueAudit,true)}}
						</text>
						<text v-if="v.venueState!=1||v.venueAudit==2">
							<text v-show="v.venueState==-1" class="iconfont iconxuanzhong"></text>
							<text v-show="!v.venueState||(v.venueState==1&&v.venueAudit==2)" class="iconfont iconweixuanzhong"></text>
						</text>
					</view>
				</view>
			</template>
		</scroll-view>
		<no-data :isNoData="noData"></no-data>
		<view class="bottom-btn van-hairline--top">
			<view class="bottom-btn-all" @tap="onChooseAllClick">
				<text>{{chooseAll?"全选":"取消全选"}}</text>
			</view>
			<view class="bottom-btn-confirm" @tap="onConfirm">
				<text>报名</text>
			</view>
		</view>
	</view>
</template>

<script>
	import searchSelect from "@/components/searchSelect.vue"
	import workApi from "@/api/modules/work.js"
	import userApi from "@/api/modules/user.js"
	import { getVenueState,list2FilterList} from "@/utils/utils.js";
	let getListFn = workApi.getWorkListAdmin.bind(workApi);
	let stateList=getVenueState();

export default {
	components: {
		searchSelect
	},
	data() {
		return {
			pageNum: 1,
			pageTotal: 2,
			orgId: undefined,
			venueId: undefined,
			state: 4,
			query:"",
			dataList: [],
			chooseAll: true,//是否全选，当前状态
			orgList: [],
		}
	},
	onLoad({ id, signup }) {
		if (signup == "true") {
			this.signup = true;
			this.$updateNavbarTitle("选择添加的职位");
		} else {
			this.$updateNavbarTitle("招聘会职位");
		}
		let org=this.$store.state.userInfo.org;
		this.orgId = org.orgId;
		this.venueId = id;
		this.getList();
		userApi.getQueryMyorgList().then(data => {
			list2FilterList(data, "orgName", "orgId");
			let obj=data.find(v=>{
				return v.orgId==org.orgId;
			});
			if(obj){
				obj.choose=true;
			}
			data.unshift({ name: "全部企业", value: null, choose:obj? false: true});
			this.orgList = data;
		}).catch(err => {
			uni.showToast({
				title: typeof err == "string" ? err : err.toString(),
				icon: "none"
			});
		});
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		/**
		 * 请求列表
		 * 
		 */
		getList(restart = false) {
			this._getListFromServer(getListFn, restart, ["venueId", "state", "orgId","query"], 99);
		},
		onPickerChoose(orgId) {
			if (this.orgId != orgId) {
				this.orgId = orgId;
				this.chooseAll=true;
				this.getList(true);
			}
		},
		onSearch(query) {
			if (this.query != query) {
				this.query = query;
				this.getList(true);
			}
		},
		getStateOrColor(state,getState){
			let obj=stateList.find(v=>{
					return v.id==state;
				});
			if(!obj)return "";
			if(getState){
				return obj.text;
			}else{
				return obj.color;
			}
		},
		onChooseAllClick() {
			let haveChoose=false;
			this.dataList.forEach(v => {
				if(v.venueState!=1||(v.venueState==1&&v.venueAudit==2)){
					haveChoose=true;
					v.venueState = this.chooseAll ? -1 : 0;
				}
			})
			this.chooseAll = haveChoose? !this.chooseAll:this.chooseAll;
		},
		onWorkClick(work) {
			// venueState==1;//原本就选中的，-1：后面手动选择,venueAudit=2:原本选中，但未通过的
			if(work.venueState==1&&work.venueAudit!=2)return;
			if(work.venueState==-1){
				work.venueState =  0;
			}else if(!work.venueState||work.venueAudit){
				work.venueState=-1;
			}
			this.chooseAll = this.dataList.some(v => {
				return v.venueState != 1&&v.venueState != -1;
			});
		},
		onConfirm() {
			let workIds = [];
			this.dataList.forEach(v => {
				if (v.venueState == -1) {
					workIds.push(v.workId);
				}
			});
			if (workIds.length == 0) {
				uni.showToast({
					icon: "none", title: "请选择职位"
				});
				return;
			}
			let rqdata = {
				venueId: this.venueId,
				"workIds": JSON.stringify(workIds)
			};
			workApi.postCreateVenueWorkAdmin(rqdata).then(data => {
				this.$toast("报名成功！");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.showToast({
					icon: "none", title: err
				});
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.venue-signup {
	  min-height: calc(100% - 98upx);
	  padding-bottom: 98upx;
	}
	.work-list {
	  height: calc(100% - 98upx);
	  padding-left:30upx;
	  box-sizing: border-box;
	  font-size: $font-size-30;
	  &-item {
	    height: 100upx;
		padding-right: 30upx;
	    position: relative;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
		.state-xuanz{
			display: flex;align-items: center;
		}
	  }
	  .iconfont {
	    font-size: $font-size-40;
		margin-left: 20upx;
	  }
	}
	.bottom-btn {
	  $height: 98upx;
	  height: $height;
	  line-height: $height;
	  display: flex;
	  position: fixed;bottom: 0px;width: 100%;z-index: 9;
	  font-size: $font-size-32;
	   background: #ffffff;
	  > view {
	    width: 50%;
	    text-align: center;
	  }
	  &-confirm {
	    color: #ffffff;
	    background: $color-main;
	  }
	}
</style>
