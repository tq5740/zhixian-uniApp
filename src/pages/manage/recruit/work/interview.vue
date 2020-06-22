<template>
	<view class="booking page-full">
		<template v-for="(d,i) of dataList">
			<list-item :key="i" @click.native="onToItem(d)">
				<template v-slot:content>
					<list-item-job-hunter :name="d.userName" :sex="d.sex" :headimg="d.photo||defaultImg" :tagList="d | getTagList" :remark="d|getRemark(state)">
					</list-item-job-hunter>
				</template>
				<template v-slot:footer>
					<view class="list-item-footer van-hairline--top">
						<text>联系电话：：</text>
						<text class="org uni-ellipsis" space="emsp">{{(d.phone||"")+" "}}</text>
						<text>期望薪资：</text>
						<text class="salary">{{d.salary}}</text>
					</view>
				</template>
			</list-item>
		</template>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>
<script>
import workApi from "@/api/modules/work.js"
import { getBookingState, formatDate, getParseAge, getParseExperience, getWorkEducation, getTimeSpan } from "@/utils/utils.js"
import listItemJobHunter from "@/components/listItemJobHunter.vue"
const educationList = getWorkEducation();
const bookingstateList = getBookingState();
export default {
	components: {
		listItemJobHunter
	},
	data() {
		return {
			pageNum: 1,
			pageTotal: 2,
			state: 3,
			workId: undefined,
			dataList: [],
		}
	},
	computed: {
		defaultImg() {
			return this.$store.state.defaultImg.user; 
		}
	},
	filters: {
		getTagList: function (obj) {
			let arr_ = [];
			if (obj.birthDate) {
				arr_.push(getParseAge(obj.birthDate) + "岁");
			}
			if (obj.education)
				arr_.push(educationList[obj.education]);
			if (obj.startWorkYear)
				arr_.push(getParseExperience(obj.startWorkYear) + "年工作经验");
			return arr_;
		},
		getRemark(obj, state) {
			if (state == 1) {
				if (obj.updateTime || obj.createTime) {
					return getTimeSpan(obj.updateTime || obj.createTime, true) + "·投递";
				}
			} else {
				// 显示状态
				return bookingstateList.find(v => {
					return v.value == obj.state;
				}).name;
			}
			return "";
		}
	},
	onLoad({ work, workId }) {
		this.dataList = [];
		this.$updateNavbarTitle(`《${work}》面试日程`);
		this.workId = workId;
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
				pageSize: 10
			}
			if (this.state)
				rqData.state = this.state;
			if (this.workId)
				rqData.workId = this.workId;
			workApi.getBookingListAdmin(rqData).then(data => {
				this.isInterface=true;
				if (restart) {//搜索条件变更
					this.dataList = data.result;
				} else {
					this.dataList.splice(-1, 0, ...data.result);
				}
				++this.pageNum;
				if (this.pageTotal != data.pages) {
					this.pageTotal = data.pages;
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
		onToItem(d) {
			uni.navigateTo({ url: "/pages/manage/recruit/booking/notes?userId=" + d.userId + "&state=" + d.state + "&workId=" + d.workId + "" + "&bookingId=" + d.bookingId });
		}
	}
}
</script>

<style scoped lang="scss">
	// .booking {
	//   height: calc(100% - 88upx);
	//   background-color: $color-f2;
	// }
	.list-item-footer {
	  position: relative;
	  font-size: $font-size-24;
	  color: $color-999;
	  background: #ffffff;
	  height: 80upx;
	  line-height: 80upx;
	  padding: 0px 30upx;
	  > text {
	    vertical-align: top;
	  }
	}
	.org {
	  color: #6d9985;
	  display: inline-block;
	  max-width: 370upx;
	}
	.salary {
	  color: #fc703e;
	}
	.filter-list {
	  &-view {
	    position: sticky;
	    z-index: 10;
	  }
	  & {
	    position: relative;
	    height: 88upx;
	    font-size: $font-size-30;
	    display: flex;
	    align-items: center;
	    background: #ffffff;
	  }
	  &-item {
	    flex-grow: 1;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	  }
	  &-item-show {
	    color: $color-main;
	  }
	  &-item-show-flag {
	    display: inline-block;
	    width: 60upx;
	    height: 4upx;
	    background: $color-main;
	    border-radius: 2upx;
	    position: absolute;
	    bottom: 0px;
	  }
	}
</style>
