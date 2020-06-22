<template>
	<view class="booking">
		<my-tabs :list="filterList" :init="selectedIndex" :isFixed="true" @change="onFilterMenuClick"></my-tabs>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :key="i" @click.native="onToItem(d)">
					<template v-slot:content>
						<list-item-job-hunter :name="d.userName" :sex="d.sex" :headimg="d.photo||defaultImg" :tagList="d | getTagList" :remark="(d.updateTime ||d.createTime) |getRemark">
						</list-item-job-hunter>
					</template>
					<template v-slot:footer>
						<view class="list-item-footer van-hairline--top">
							<text>所投职位：</text>
							<text class="org uni-ellipsis" space="emsp">{{d | getPost}}</text>
							<text>期望薪资：</text>
							<text class="salary">{{d.salary||"-"}}</text>
						</view>
					</template>
				</list-item>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>
<script>
import workApi from "@/api/modules/work.js"
import { bookingState, getParseAge, getParseExperience, getWorkEducation, getTimeSpan } from "@/utils/utils.js"
import listItemJobHunter from "@/components/listItemJobHunter.vue"
import myTabs from "@/components/myTabs.vue"

const educationList = getWorkEducation();
let getListFn = workApi.getBookingListAdmin.bind(workApi);

export default {
	components: {
		listItemJobHunter, myTabs
	},
	data() {
		return {
			selectedIndex: 0,
			filterList: bookingState(),
			pageNum: 1,
			pageTotal: 2,
			state: 1,
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
		getRemark(value) {
			if (value) {
				return getTimeSpan(value, true) + "·投递";
			}
			return "";
		},
		getPost(obj) {
			let orgName = obj.orgName ? "-" + obj.orgName : "";
			return obj.workTitle + orgName + " ";
		}
	},
	onLoad() {
		this.$updateNavbarTitle("投递记录");
		this.dataList = [];
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
			this._getListFromServer(getListFn, restart, ["state"]);
		},
		onFilterMenuClick(index) {
			this.selectedIndex = index;
			let value = 0;
			if (index == 0) {
				value = 1;
			} else if (index == 1) {
				value = 3;
			} else if (index == 2) {
				value = 4;
			} else if (index == 3) {
				value = 6;
			} else if (index == 4) {
				value = 7;
			}
			if (this["state"] != value) {
				this["state"] = value;
				this.getList(true);
			}
		},
		onToItem(d) {
			uni.navigateTo({ url: "/pages/manage/recruit/booking/notes?userId=" + d.userId + "&state=" + d.state + "&workId=" + d.workId + "" + "&bookingId=" + d.bookingId });
		}
	}
}
</script>

<style scoped lang="scss">
	.booking {
	  padding-top: 88upx;
	  height: calc(100% - 88upx);
	  background-color: $color-f2;
	}
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
</style>
