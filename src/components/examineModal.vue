<template>
	<view class="examine">
		<view v-show="showMark" class="mark" @tap="showMark=false" @touchmove.stop.prevent="onMove"></view>
		<view v-show="showMark" class="examine-select">
			<view class="title">
				<text class="title-text uni-ellipsis">{{title||examineTitle}}</text>
			</view>
			<view class="examine-select-content">
				<view class="examine-select-option" :class="{'examine-select-option-choose':pass}" @tap="pass=!pass" @touchmove.stop.prevent="onMove">
					<text v-show="pass" class="iconfont iconxuanzhong"></text>
					<text v-show="!pass" class="iconfont iconweixuanzhong"></text>
					<text>通过</text>
				</view>
				<view class="examine-select-option" :class="{'examine-select-option-choose':!pass}" @tap="pass=!pass" @touchmove.stop.prevent="onMove">
					<text v-show="!pass" class="iconfont iconxuanzhong"></text>
					<text v-show="pass" class="iconfont iconweixuanzhong"></text>
					<text>不通过</text>
				</view>
				
				<textarea v-show="!pass" v-model="reason" placeholder="请输入审核不通过的原因" :fixed="true" :show-confirm-bar="false" placeholder-class="placeholder-class"></textarea>
				<text class="btn" @tap="onExamine">确定</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ""
		},
	},
	data() {
		return {
			pass: true,
			reason: "",
			showMark: false,
			examineTitle: ""
		}
	},
	methods: {
		onExamine() {
			if (!this.pass) {
				if (this.$isEmpty(this.reason)) {
					uni.showToast({
						icon: "none",
						title: "请填写原因"
					});
					return;
				}
			}
			this.$emit("onExamine", { pass: this.pass, reason: this.reason });
			this.showMark = false;
		},
		show(title) {
			this.showMark = true;
			this.examineTitle = title;
		},
		clear() {
			this.pass = true;
			this.reason = "";
		},
		onMove(){}
	}
}
</script>

<style scoped>
	.examine {
	  background-color: #f2f2f2;
	}
	.mark {
	  position: fixed;
	  z-index: 11;
	}
	.examine-select {
	  position: fixed;
	  bottom: 0upx;
	  z-index: 11;
	  background: #ffffff;
	  width: 100%;
	}
	.title {
	  height: 87upx;
	  text-align: center;
	  line-height: 87upx;
	  margin-bottom: 50upx;
	  border-bottom: 1upx solid #d8d8d8;
	  font-size: 30upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #666666;
	}
	.title-text {
	  display: inline-block;
	  width: 483upx;
	}
	.examine-select-content {
	  padding: 0upx 30upx 30upx;
	}
	.btn {
	  display: block;
	  width: 690upx;
	  height: 88upx;
	  border-radius: 10upx;
	  text-align: center;
	  margin-top: 30upx;
	  line-height: 88upx;
	  background: #42b983;
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #ffffff;
	}
	textarea {
	  width: calc(100% - 40upx);
	  height: 200upx;
	  padding: 30upx 20upx;
	  margin: 40upx 0upx;
	  border: 1upx solid rgba(216, 216, 216, 1);
	  border-radius: 10upx;
	  font-size: 28upx;
	}
	.examine-select-option {
	  width: 690upx;
	  height: 88upx;
	  display: flex;align-items: center;
	  font-size: 32upx;
	}
	.iconfont {
	  margin: 0upx 30upx 0upx 20upx;
	  font-size: 46upx;
	}
	.examine-select-option-choose {
	  background: #f0f9f5;
	}
	.placeholder-class {
	  font-size: 28upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #999999;
	}
</style>
