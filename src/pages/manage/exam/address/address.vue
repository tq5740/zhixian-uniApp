<template>
	<view class="page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建地址</text>
		</view>
		<search-select :dataList="orgList" @onPickerChoose="onPickerChoose" @onSearch="onSearch" searchPlaceholder="请输入考场地点名称"></search-select>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList="getBtnList()" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<view class="address-item">
							<view class="address-detail">
								<text class="iconfont icondizhi"></text>
								<text class="address-text uni-ellipsis">{{d |getAddress}}</text>
								<!-- <text class="state" :style="{background:getStateBgColor(d.state)}">{{getState(d.state)}}</text> -->
							</view>
							<view class="address-info">
								<text>考场地址标题：<text class="color-6d">{{d.examAddressTitle}}</text></text>
							</view>
							<view class="org">
								<text v-if="d.state==1" class="color-fc">提示：{{d.reason||""}}</text>
								<text v-else>企业：{{d.org.orgName || ""}}</text>
							</view>
						</view>
					</template>
				</list-item>
			</template>
		</view>
		
		<msg-modal ref="msgmodal" @onConfirm="onMsgConfirm"></msg-modal>
		<examine-modal ref="examineModal" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import searchSelect from "@/components/searchSelect.vue"
import examineModal from "@/components/examineModal.vue"
import examApi from "@/api/modules/exam.js"
import userApi from "@/api/modules/user.js"
import { getExamAddressState, list2FilterList } from "@/utils/utils.js"

let navTitle = `考场地址`;
let getListFn = examApi.getExamAddressListAdmin.bind(examApi);
const stateList = getExamAddressState();
export default {
	components: {
		searchSelect, examineModal
	},
	data() {
		return {
			canCreate: false,
			searchDataList: [],
			pageNum: 1,
			pageTotal: 2,
			orgId: undefined,
			query: undefined,
			orgList: [],
			dataList: [],
			chooseItem: undefined
		}
	},
	filters: {
		getAddress(d) {
			return (d.province || "") + (d.city || "") + (d.district || "") + (d.street || "") + (d.doorNumber || "");
		}
	},
	onLoad() {
		this.getList();
		userApi.getQueryMyorgList().then(data => {
			list2FilterList(data, "orgName", "orgId");
			data.unshift({ name: "全部企业", value: null, choose: true });
			this.orgList = data;
		}).catch(err => {
			uni.showToast({
				title: typeof err == "string" ? err : JSON.stringify(err),
				icon: "none"
			})
		});
	},
	onReachBottom() {
		this.getList();
	},
	onShow() {
		this.$updateNavbarTitle(navTitle);
	},
	onShow(refresh) {
		if (refresh)
			this.getList(true, false);
		else
			this.$updateNavbarTitle(navTitle);
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false, rename = true) {
			if (!this.power) {
				this.power = await this._getPower();
				this.canCreate = this.power.isCreate;
			}else{
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["orgId", "query"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `考场地址(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList() {
			if (!this.power) return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				btnList.push({ text: '编辑', icon: 'iconbianji' });
			}
			// if (power.isAudit) {
			// 	btnList.push({ text: "审核", icon: "iconshenhe" });
			// }
			if (power.isDelete) {
				btnList.push({ text: "删除", icon: "iconshanchu" });
			}
			return btnList;
		},
		onBtnClick({ btn: { text }, item }) {
			if ("编辑" == text) {
				uni.navigateTo({
					url: `/pages/manage/exam/address/edit?address=${JSON.stringify(item)}`
				})
			} else if ("删除" == text) {
				this.$refs.msgmodal.show(`<span>是否删除考场地址“</span><span style="color: #000;font-weight: bold">${(item.province || "") + (item.city || "") + (item.district || "") + (item.street || "") + (item.doorNumber || "")}</span><span>”？</span>`, item.examAddressId);
			} else if ("审核" == text) {
				this.chooseItem = item;
				this.$refs.examineModal.show(`审核“${item.examAddressTitle}”`)
			}
		},
		onExamine({ pass, reason }) {
			uni.showLoading();
			examApi.postAuditExamAddressAdmin({
				examAddressId: this.chooseItem.examAddressId,
				reason,
				state: pass ? 3 : 1
			}).then(data => {
				uni.hideLoading();
				this.getList(true);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					icon: "none"
				});
			});
		},
		onMsgConfirm(examAddressId) {
			uni.showLoading()
			examApi.postDeleteExamAddressAdmin(JSON.parse([examAddressId])).then(data => {
				uni.hideLoading();
				this.getList(true);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					icon: "none"
				});
			});
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: '/pages/manage/exam/address/edit?create=true'
			});
		},
		onPickerChoose(orgId) {
			if (this.orgId != orgId) {
				this.orgId = orgId;
				this.getList(true);
			}
		},
		onSearch(query) {
			if (this.query != query) {
				this.query = query;
				this.getList(true);
			}
		},
		getState(state) {
			return stateList.find(v => {
				return v.id == state;
			}).text;
		},
		getStateBgColor(state) {
			return stateList.find(v => {
				return v.id == state;
			}).color;
		}
	}
}
</script>

<style lang="scss" scoped>
	.page-full {
	  min-height: calc(100% - #{$create-btn-height});
	}
	.address {
	  height: 100%;
	  background: $color-f2;
	}
	.address-item {
	  background: #fff;
	  padding: 20upx;
	}
	.icondizhi {
	  margin-right: 10upx;
	  color: $color-999;
	}
	.address-detail {
	  font-size: $font-size-30;
	  font-weight: bold;
	  display: flex;
	}
	.address-info {
	  font-size: $font-size-24;
	  color: $color-666;
	  padding: 20upx 0px;
	}
	.state {
	  display: inline-block;
	  font-size: $font-size-24;
	  min-width: 94upx;
	  height: 38upx;
	  line-height: 38upx;
	  background: $color-main;
	  border-radius: 19upx;
	  color: #ffffff;
	  text-align: center;
	}

	.address-text {
	  display: inline-block;
	  flex-grow: 1;
	  vertical-align: top;
	}
	.org {
	  font-size: $font-size-24;
	  color: $color-999;
	}
	.color-6d {
	  color: #6d9985;
	}
	.color-fc {
	  color: #fc703e;
	}
</style>
