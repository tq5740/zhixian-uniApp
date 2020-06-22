<template>
	<view class="login-record">
		<view class="record-list">
			<view class="record-list-item record-list-item-title">
				<text class="equipment">设备</text>
				<text class="ip">登录IP</text>
				<text class="time">登录时间</text>
			</view>
			<template v-for="(d,i) of dataList">
				<view class="record-list-item" :class="{'record-list-item-odd':i%2==0}" :key="i">
					<text class="equipment">{{d.device | getDevice}}</text>
					<text class="ip">{{d.ip}}</text>
					<text class="time">{{d.loginTime | getTime}}</text>
				</view>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import userApi from "../../../../api/modules/user.js"
import { formatDate } from "../../../../utils/utils.js"
export default {
	data() {
		return {
			pageNum: 1,
			pageTotal: 2,
			userId: undefined,
			dataList: []
		}
	},
	filters: {
		getTime: function (value) {
			return formatDate(value, "YYYY-MM-DD hh:mm:ss");
		},
		getDevice: function (value) {
			switch (value) {
				case 1:
					return "手机";
				case 2:
					return "电脑";
				default:
					return "未知";
			}
		}
	},
	onLoad({ userId }) {
		this.$updateNavbarTitle("登录记录");
		this.userId = userId;
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		/**
		 * 请求列表
		 */
		async getList(restart = false) {
			if (restart) {
				this.pageNum = 1;
				this.pageTotal = 2;
			}

			if (this.pageNum >= this.pageTotal) {
				uni.showToast({
					icon: "none",
					title: "已全部加载"
				});
				return;
			}
			uni.showLoading({
				title: "加载中"
			});
			let rqData = {
				pageNum: this.pageNum,
				pageSize: 20
			}
			if (this.userId)
				rqData.userId = this.userId;
			userApi.getUserLoginList(rqData).then(data => {
				if (restart) {//搜索条件变更
					this.dataList = data.result;
				} else {
					this.dataList.splice(-1, 0, ...data.result);
				}
				++this.pageNum;
				if (this.pageTotal != data.pages) {
					this.pageTotal = data.pages;
					this.$updateNavbarTitle(`登录记录(${data.total})`);
				}
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
	},
}
</script>

<style>
	.login-record {
	 background: #FFFFFF;min-height: 100%;
	}
	.record-list-item {
	  padding: 0px 40upx;
	  height: 100upx;
	  line-height: 100upx;
	  font-size: 24upx;
	  color: #666666;
	}
	.record-list-item-odd {
	  background: #f0f9f5;
	}
	.record-list-item-title {
	  height: 80upx;
	  line-height: 80upx;
	  font-size: 26upx;
	  font-weight: bold;
	  color: #6d9985;
	}
	.equipment,
	.ip,
	.time {
	  display: inline-block;
	}
	.equipment {
	  width: 150upx;
	}
	.ip {
	  width: 220upx;
	}
	.time {
	  width: 300upx;
	}
</style>
