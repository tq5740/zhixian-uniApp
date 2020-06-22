<template>
	<view class="info-text">
		<view class="info-item " :class="{'van-hairline--bottom':borderBottom}">
			<view class="info-item-title">
				<text>{{title}}</text><text v-if="required" class="required">*</text>
			</view>
			<view class="info-item-content">
				<!-- text -->
				<text class="content ban" :style="{color:color}">{{$isEmpty(value)?'-':value}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: { type: String, default: "" },
		value: { type: [String, Number], default: "" },
		color: { type: String, default: "#666666" },
		required: { type: Boolean, default: false },
		borderBottom: { type: Boolean, default: true },
	},
}
</script>

<style scoped>
	.info-text {
	  width: 100%;
	  background: #ffffff;
	}
	.info-item {
	  position: relative;
	  margin-left: 30upx;
	  padding: 30upx 0upx;
	  align-items: flex-start;
	}
	.info-item-content,
	.info-item {
	  display: flex;
	  justify-content: space-between;
	}
	.info-item-content {
	  width: 490upx; align-items: center;
	}
	.info-bottom-border {
	  border-bottom: 1upx solid #d8d8d8;
	}
	.info-item-title,
	.content {
	  font-size: 30upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	}
	.info-item-title {
	  color: #6d9985;
	}
	.content {
	  padding-right: 30upx;
	}
	.ban {
	  color: #666666;
	}
	.tips {
	  color: #999999;
	}
	.required {
	  color: #fc703e;
	}
</style>
