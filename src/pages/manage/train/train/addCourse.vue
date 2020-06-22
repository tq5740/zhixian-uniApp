<template>
	<view class="train-add-course page-full">
		<search-filter searchPlaceholder="请输入课程名称搜索" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<view class="list-item van-hairline--bottom" v-for="(d,i) of dataList" :key="i">
				<image class="cover" :src="getCoverSrc(d.courseImg)"></image>
				<view class="info">
					<text class="title uni-ellipsis">{{d.courseTitle}}</text>
					<text class="creater">创建人：{{d.createUserName||d.updateUserName}}</text>
					<text class="createtime">创建时间：{{$formatDate(d.createTime||d.updateTime,"YYYY-MM-DD hh:mm:ss")}}</text>
				</view>
				<view class="radio">
					<text @tap="onItemChoose(d)" class="select iconfont" :class="{iconxuanzhong:d.choose,iconweixuanzhong:!d.choose}"></text>
					<!-- <text @tap="onItemChoose(v)" class="select iconfont iconxuanzhong"></text> -->
				</view>
			</view>
		</view>
		<view class="bottom-btn van-hairline--top">
			<text class="reset" @tap="onReset">重置</text>
			<text class="confirm" @tap="onConfirm">确定</text>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>

import trainApi from "@/api/modules/train.js"
import { mapState } from "vuex"

let getListFn = trainApi.getCourseListResources.bind(trainApi);
export default {
	data() {
		return {
			pageNum: 1,
			pageTotal: 2,
			query: undefined,
			dataList: [],
			trainId: undefined
		};
	},
	computed: {
		...mapState(["configData"])
	},
	onLoad({ trainId }) {
		this.$updateNavbarTitle("添加课程");
		this.trainId = trainId;
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		/**
		 * 请求列表
		 */
		getList(restart = false) {
			this._getListFromServer(getListFn, restart, ["query"]);
		},
		onItemChoose(item) {
			this.$set(item, "choose", !item.choose);
		},
		onReset() {
			this.dataList.forEach(v => {
				this.$set(v, "choose", false)
			})
		},
		onConfirm() {
			let resourceIds = "", resourceTitles = "";
			this.dataList.forEach(v => {
				if (v.choose) {
					resourceIds = resourceIds + v.courseId + ",";
					resourceTitles = resourceTitles + v.courseTitle + ",";
				}
			});
			if (!resourceIds) {
				uni.showToast({
					title: "请选择课程", icon: "none"
				}); return;
			}
			resourceIds = resourceIds.substring(0, resourceIds.length - 1);
			resourceTitles = resourceTitles.substring(0, resourceTitles.length - 1);
			uni.showLoading({
				title: "请稍等"
			});
			trainApi.postCreateTrainResourceAdmin({
				type: 3,
				trainId: this.trainId,
				resourceIds: resourceIds,
				resourceTitles: resourceTitles
			}).then(data => {
				this.$toast("添加成功");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},
		getCoverSrc(cover) {
			if (cover)
				return this.configData.imgDomain + cover + this.$imgSize.width224;
		},
		onSearch(val) {
			if (this.query != val) {
				this.query = val;
				this.getList(true);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.page-full {
	  padding-bottom: 110upx;
	  height: calc(100% - 110upx);
	}
	.list-conten {
	  background: #ffffff;
	}
	.list-item {
	  $height: 113upx;
	  padding: 30upx 0px;
	  margin: 0px 30upx;
	  position: relative;
	  display: flex;
	  justify-content: space-between;
	  .cover {
	    width: 200upx;
	    height: $height;
	  }
	  .info {
	    font-size: $font-size-24;
	    color: $color-999;
	    width: 382upx;
	    margin-left: 20upx;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	    .title {
	      font-size: $font-size-30;
	      font-weight: bold;
	      color: #000000;
	    }
	  }
	  .radio {
	    .select {
	      font-size: $font-size-40;
	      line-height: $height;
	    }
	  }
	}
	.bottom-btn {
	  $h: 98upx;
	  position: fixed;
	  bottom: 0;
	  z-index: 10;
	  width: 100%;
	  height: $h;
	  background: #ffffff;
	  text {
	    display: inline-block;
	    width: 50%;
	    text-align: center;
	    height: $h;
	    line-height: $h;
	  }
	  .confirm {
	    background: $color-main;
	    color: #ffffff;
	  }
	  .reset {
	    color: $color-main;
	  }
	}
</style>
