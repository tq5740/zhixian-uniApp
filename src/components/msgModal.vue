<template>
	<view class="msgmodal" v-show="showFlag" @touchmove.stop.prevent="onMove">
		<view class="mark"></view>
		<view class="modal-content">
			<view class="title">
				<text>{{title}}</text>
			</view>
			<view class="text-content">
				<rich-text :nodes="nodes"></rich-text>
			</view>
			<view class="modal-btn">
				<text class="btn cancle" @tap="onCancle">{{cancle}}</text>
				<text class="btn confirm" @tap="onConfirm">{{confirm}}</text>
			</view>
		</view>
	</view>
</template>

<script>
// 父级使用时
// this.$refs.msgmodal.show(`<span>您确定要删除banner“</span><span style="color: #000;font-weight: bold">圆梦就业</span><span>”？</span>`);
export default {
	props: {
		title: {
			type: String,
			default: "提示"
		},
		cancle: {
			type: String,
			default: "取消"
		},
		confirm: {
			type: String,
			default: "确定"
		}
	},
	data() {
		return {
			nodes: [],
			showFlag: false,
			flag: undefined
		};
	},
	methods: {
		show(nodes, flag) {
			this.showFlag = true;
			this.nodes = nodes;
			if (flag) this.flag = flag;
		},
		onCancle() {
			this.showFlag = false;
			this.$emit("onCancle", this.flag);
			this.onComplete(false);
		},
		onConfirm() {
			this.showFlag = false;
			this.$emit("onConfirm", this.flag);
			this.onComplete(true);
		},
		onComplete(result) {
			this.$emit("onComplete", { flag: this.flag, result });
		},
		onMove() { }
	}
}
</script>

<style>
	.mark {
	  z-index: 999;
	  position: fixed;
	}

	.modal-content {
	  z-index: 1000;
	  width: 650upx;
	  min-height: 276upx;
	  background: rgba(255, 255, 255, 1);
	  border-radius: 10upx;
	  position: fixed;
	  left: 50%;
	  top: 50%;
	  transform: translate(-50%, -50%);
	}

	.title {
	  font-size: 34upx;
	  font-family: PingFang-SC-Regular;
	  color: rgba(0, 0, 0, 1);
	  text-align: center;
	  margin-top: 49upx;
	}

	.text-content {
	  font-size: 28upx;
	  font-family: PingFang-SC-Regular;
	  color: rgba(102, 102, 102, 1);
	  line-height: 42upx;
	  padding: 39upx 40upx;
	  border-bottom: 1upx solid rgba(216, 216, 216, 1);
	}

	.modal-btn {
	  font-size: 34upx;
	  font-family: PingFang-SC-Regular;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  text-align: center;
	}

	.btn {
	  flex-grow: 1;
	  height: 88upx;
	  line-height: 88upx;
	}

	.cancle {
	  color: rgba(1, 1, 1, 1);
	  border-right: 1upx solid rgba(216, 216, 216, 1);
	}

	.confirm {
	  color: rgba(66, 185, 131, 1);
	}

	.blod {
	  color: #000;
	  font-weight: bold;
	}
</style>
