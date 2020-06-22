<template>
	<view class="address-list page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter ref="searchFilter" searchPlaceholder="请输入企业名称搜索" :searchDataList="searchDataList" @onSearchInput="onSearchInput" @onSearchBlur="onSearchBlur" @onSearchDataClick="onSearchDataClick"></search-filter>

		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList="getBtnList()" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<view class="address-item">
							<view class="address-detail">
								<text class="iconfont icondizhi"></text>
								<text class="address-text uni-ellipsis">{{d |getAddress}}</text>
							</view>
							<view class="address-info">
								<text space="emsp">联系人：{{d.contact+" "}}</text>
								<text>联系电话：{{d.tel}}</text>
							</view>
							<view class="org">
								<text>企业：{{d.orgName || ""}}</text>
							</view>
						</view>
					</template>
				</list-item>
			</template>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建地址</text>
		</view>
		<msg-modal ref="msgmodal" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import workApi from "@/api/modules/work.js"
import userApi from "@/api/modules/user.js"

let navTitle = `工作地址`;
let getListFn = workApi.getAddressListAdmin.bind(workApi);
let orgList = [];

export default {
	data() {
		return {
			canCreate: false,
			searchDataList: [],
			pageNum: 1,
			pageTotal: 2,
			orgId: undefined,
			dataList: []
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
			data.forEach(v => {
				v.name = v.orgName;
			})
			orgList = data;
		});
	},
	onReachBottom() {
		this.getList();
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
			} else {
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["orgId"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `工作地址(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList() {
			if(!this.power)return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				btnList.push({ text: '编辑', icon: 'iconbianji' });
			}
			if (power.isDelete) {
				btnList.push({ text: "删除", icon: "iconshanchu" });
			}
			return btnList;
		},
		onBtnClick({ btn: { text }, item }) {
			if ("编辑" == text) {
				uni.navigateTo({
					url: `/pages/manage/recruit/address/edit?address=${JSON.stringify(item)}`
				})
			} else if ("删除" == text) {
				this.$refs.msgmodal.show(`<span>是否删除工作地址“</span><span style="color: #000;font-weight: bold">${(item.province || "") + (item.city || "") + (item.district || "") + (item.street || "") + (item.doorNumber || "")}</span><span>”？</span>`, item.addressId);
			}
		},
		onMsgConfirm(flag) {
			workApi.postDeleteAddressAdmin(flag).then(data => {
				this.getList(true);
			}).catch(err => {
				uni.showToast({
					title: err,
					icon: "none"
				});
			});
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: '/pages/manage/recruit/address/create'
			})
		},
		onSearchInput(value) {
			this.searchDataList = [];
			if (value) {
				orgList.forEach(v => {
					if (v.name.indexOf(value) != -1)
						this.searchDataList.push(v);
				})
			}
		},
		onSearchBlur(value) {
			setTimeout(() => {
				this.$refs.searchFilter.onMarkClick();
			}, 0);
			if (!value) {
				this.onSearchDataClick("");
			}
		},
		onSearchDataClick(obj) {
			this.orgId = obj.orgId;
			this.getList(true);
		}
	}
}
</script>

<style lang="scss" scoped>
	.address-list {
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
	}
	.address-info {
	  font-size: $font-size-24;
	  color: $color-666;
	  padding: 20upx 0px;
	}
	.address-text {
	  display: inline-block;
	  width: 657upx;
	  vertical-align: top;
	}
	.org {
	  font-size: $font-size-24;
	  color: $color-999;
	}
</style>
