<template>
	<view class="organization-examine" :class="examine ? 'padding-bottom-98' : ''">
		<info-list :infolist="infolist"></info-list>
		<text v-if="examine" class="info-item-btn" @tap="$refs.examinemodal.show()">审核</text>
		<examine-modal v-if="examine" ref="examinemodal" :title="'审核员工“'+name+'”'" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "@/api/modules/user.js"

import examineModal from "@/components/examineModal.vue"

export default {
	components: {
		examineModal
	},
	computed: {
		noData() {
			return this.infolist.length == 0;
		}
	},
	data() {
		return {
			examine: false,
			userId: undefined,
			infolist: [],
			name: ""
		}
	},
	onLoad({
		id, examine
	}) {
		this.$updateNavbarTitle("身份信息");
		uni.showLoading();
		if (examine) {
			this.examine = true;//审核
			this.$updateNavbarTitle("审核");
		}
		this.userId = id;
		userApi.getQueryUserAuth(id).then(data => {
			this.name = data.name;
			let infolist = [
				[{
					title: "证件照片",
					el: "image",
					horizontal: true,
					width: 102,
					height: 126,
					value: data.idPhoto
				}],
				[{
					title: "姓名",
					el: "text",
					value: data.name || "-"
				}, {
					title: "性别",
					el: "text",
					value: data.sex == 1 ? "男" : data.sex == 2 ? "女" : "-"
				}, {
					title: "民族",
					el: "text",
					value: data.nation || ""
				}, {
					title: "出生日期",
					el: "text",
					value: this.$getTimeSpan(data.birthday)
				}, {
					title: "身份证号",
					el: "text",
					value: data.idNumber || ""
				}, {
					title: "户籍地址",
					el: "text",
					value: data.address
				}],
				[{
					title: "证件有效期",
					el: "text",
					value: (data.startDate||"-") + " 至 " + (data.endDate || "-")
				}, {
					title: "发证机关",
					el: "text",
					value: data.issued
				}, {
					title: "手机号码",
					el: "text",
					value: data.phone
				}, {
					title: "社保编号",
					el: "text",
					value: data.bankCardNumber
				}],
				[{
					title: "身份证照",
					el: "image",
					// horizontal: true,
					width: 220,
					height: 124,
					images: [{
						value: data.idFace
					}, 
					{
						value: data.idBack
					}
					]
				}]
			]
			this.infolist = infolist;
			uni.hideLoading();
		}).catch(err => { 
			uni.hideLoading();
			uni.showToast({
				title: err,
				duration: 2000,
				icon: "none"
			});
		});
	},
	methods: {
		onExamine(result) {
			uni.showLoading();
			let state = result.pass ? 4 : 2;
			userApi.postAuditUserAuthState({
				userId: this.userId,
				state: state,
				reason: result.reason
			}).then(data => {
				this.$toast("审核成功");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		}
	}
}
</script>

<style>
	.organization-examine {
	  background-color: #f2f2f2;
	}
	.padding-bottom-98 {
	  padding-bottom: 98upx;
	}
	.info-item-btn {
	  display: block;
	  width: 100%;
	  height: 98upx;
	  text-align: center;
	  line-height: 98upx;
	  background: #42b983;
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #ffffff;
	  position: fixed;
	  bottom: 0rpx;
	  z-index: 10;
	}
</style>
