<template>
	<view class="train page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入培训标题搜索" :showResetBtn="true" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList="getBtnList(d.state,d.isRecommend)" @onBtnClick="onBtnClick" @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-course :isRecommend="d.isRecommend" :name="d.trainTitle" :type="d.categoryTitle" :remark="d | getRemark" :state="d.state | getState" :stateBgColor="d.state | getStateBgColor" :tag="d.trainType==1?'线下':d.trainType==2?'线上':'线上+线下'" :tipsColor="d.state==2?'#FC703E':'#999999'"
						 :globalColor="d.state==5?'#999999':''"></list-item-course>
					</template>
				</list-item>
			</template>
		</view>

		<view class="statistics" v-show="showFlag">
			<view class="mark" @tap="showFlag=false"></view>
			<view class="statistics-body">
				<view class="statistics-title"><text>统计</text></view>
				<view class="statistics-content" @tap="onToUserReport">
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.resourceNumber}}</text>
							<text class="statistics-item-title">资源数量</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.browseNumber}}</text>
							<text class="statistics-item-title">浏览量</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{courseStatistics.complimentNumber}}</text>
							<text class="statistics-item-title">点赞数</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.commentNumber}}</text>
							<text class="statistics-item-title">评论数</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.trainNumber}}</text>
							<text class="statistics-item-title">培训人数</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{$getFloat(courseStatistics.progress*100,2)+"%"}}</text>
							<text class="statistics-item-title">平均进度</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.length|getDuration}}</text>
							<text class="statistics-item-title">学习时长</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{courseStatistics.score}}</text>
							<text class="statistics-item-title">平均成绩</text>
						</view>
					</view>
				</view>
				<view class="statistics-btn bottom-full-btn" @tap="onToUserReport">
					<text>查看用户报表</text>
				</view>
			</view>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建培训</text>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<delete-modal ref="del" @onDelete="onDelete"></delete-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import listItemCourse from "@/components/listItemCourse.vue" 
import deleteModal from "@/components/deleteModal.vue"
import trainApi from "@/api/modules/train.js"
import puApi from "@/api/modules/public.js"
import { formatDate, getCourseState, list2FilterList } from "@/utils/utils.js"

let getListFn = trainApi.getTrainListAdmin.bind(trainApi);
let navTitle = `培训`;
let stateList = getCourseState();
export default {
	components: {
		listItemCourse, deleteModal
	},
	data() {
		let filterList = [{ name: "培训分类", type: "categoryIds", showChoose: true,showResetBtn:true },
		{ name: "培训状态", type: "state", children: [] }];
		
		return {
			canCreate: false,
			filterList: filterList,
			pageNum: 1,
			pageTotal: 2,
			query: undefined,
			categoryIds: undefined,
			state: undefined,
			dataList: [],
			chooseItem: undefined,
			courseStatistics: {},//统计
			showFlag: false
		};
	},
	filters: {
		getRemark: function (d) {
			if(d.state==2)
				return d.reason;
			else 
				return `创建人：${d.createUserName}  创建时间：${formatDate(d.createTime, "YYYY-MM-DD hh:mm:ss")}`;
		},
		getState(val) {
			return stateList.find(v => {
				return v.id == val;
			}).text;
		},
		getStateBgColor(val) {
			return stateList.find(v => {
				return v.id == val;
			}).color;
		},
		getDuration(val) {
			let s = val % 60;
			let m = Math.floor(val / 60);
			let h = 0;
			if (m > 59) {
				h = Math.floor(m / 60);
				m = m % 60;
			}
			let str = "";
			if (h > 0) {
				str = `${h}时${m}分`;
			} else if (m > 0) {
				str = `${m}分${s}秒`;
			} else {
				str = `${s}秒`;
			}
			return str;
		}
	},
	onLoad() {
		this.getList();
		let stateFilterList = [{ name: "全部", value: null, choose: true }];
		stateList.forEach(v => {
			stateFilterList.push({ name: v.text, value: v.id });
		});
		puApi.getTrainCategoryListAdmin().then(data => {
			list2FilterList(data, "categoryTitle", "categoryId");
			data.unshift({ name: "全部", value: null, choose: true });
			this.$set(this.filterList[0], "children", data);
			this.filterList[1].children = stateFilterList;
		})
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
			this._getListFromServer(getListFn, restart, ["query", "categoryIds", "state"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `培训(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state, isRecommend) {
			if (!this.power) return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				// 编辑暂不做
				btnList.push({ text: `编辑`, icon: "iconbianji", key: "bianji" });
			}
			if (power.isOnline) {
				let fb = { text: `发布`, icon: "iconfabu", key: "fabu" };//state==5
				if (state != 5) {
					if (state == 4) {
						fb = { text: `关闭`, icon: "iconguanbi", key: "guanbi" }
					} else {
						fb.color = "#999999";
						fb.disable = true;
					}
				}
				btnList.push(fb);
			}
			if (power.isStatistics) {
				btnList.push({ text: `统计`, icon: "icontongji", key: "tongji" });
			}
			btnList.push({ text: `培训课程`, icon: "iconkechengzhangjie", key: "kecheng" });
			btnList.push({ text: `报名用户`, icon: "iconbaomingyonghu", key: "baoming" });

			if (power.isRecommend && state == 4) {
				// 发布中才有推荐相关
				if (isRecommend) {
					btnList.push({ text: `取消推荐`, icon: "iconquxiaotuijian", key: "quxiaotuijian" });
				} else {
					btnList.push({ text: `推荐培训`, icon: "icontuijian", key: "tuijian" });
				}
			}

			//关闭没有审核
			if (power.isAudit && state != 5) {
				btnList.push({ text: `审核培训`, icon: "iconshenhe", key: "shenhe" });
			}
			// 发布中没有删除
			if (power.isDelete && state != 4) {
				btnList.push({ text: `删除培训`, icon: "iconshanchu", key: "shanchu" });
			}
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/detail/trainDetail?trainId=${item.trainId}`
			})
		},
		onBtnClick({ btn: { key }, item }) {
			this.chooseItem = item;
			if (key == "guanbi") {
				// 关闭
				this.$refs.msg.show(`<span>是否关闭培训“</span><span style="color: #000;font-weight: bold">${item.trainTitle}</span><span>”？</span>`, key);
			} else if (key == "fabu") {
				// 发布
				this.$refs.msg.show(`<span>是否发布培训“</span><span style="color: #000;font-weight: bold">${item.trainTitle}</span><span>”？</span>`, key);
			} else if (key == "shanchu") {
				// 删除
				this.$refs.del.show(`删除培训“${item.trainTitle}”`);
			} else if (key == "tuijian") {
				// 推荐
				this.onMsgConfirm(key);
			} else if (key == "quxiaotuijian") {
				// 取消推荐
				this.onMsgConfirm(key);
			} else if (key == "shenhe") {
				// 审核
				uni.navigateTo({
					url: `/pages/manage/train/train/examine?id=${item.trainId}`
				})
			} else if (key == "bianji") {
				// 编辑
				uni.navigateTo({
					url: `/pages/manage/train/train/edit?id=${item.trainId}`
				})
			} else if (key == "tongji") {
				// 统计
				uni.showLoading({
					title: "请稍等"
				});
				trainApi.getQueryTrainIdStatisticsAdmin(item.trainId).then(data => {
					this.courseStatistics = data;
					this.showFlag = true;
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
			} else if (key == "kecheng") {
				// 培训课程
				uni.navigateTo({
					url: `/pages/manage/train/train/course?id=${item.trainId}&name=${item.trainTitle}`
				})
			} else if (key == "baoming") {
				// 报名用户
				uni.navigateTo({
					url: `/pages/manage/train/train/user?id=${item.trainId}&name=${item.trainTitle}`
				})
			}

		},
		onToUserReport() {
			// 查看用户报表
			uni.navigateTo({
				url: `/pages/manage/train/train/userReport?id=${this.chooseItem.trainId}`
			})
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: `/pages/manage/train/train/edit?create=true`
			})
		},
		onMsgConfirm(key) {
			let r_ = undefined;
			if (key == "guanbi") {
				// 关闭
				r_ = trainApi.postOnlineOfflineTrainAdmin({
					trainId: this.chooseItem.trainId,
					state: 5
				});
			} else if (key == "fabu") {
				// 发布
				r_ = trainApi.postOnlineOfflineTrainAdmin({
					trainId: this.chooseItem.trainId,
					state: 4
				});
			} else if (key == "tuijian") {
				// 推荐
				r_ = trainApi.postIsRecommedTrainAdmin({
					trainId: this.chooseItem.trainId,
					isRecommend: 1
				});
			} else if (key == "quxiaotuijian") {
				// 取消推荐
				r_ = trainApi.postIsRecommedTrainAdmin({
					trainId: this.chooseItem.trainId,
					isRecommend: 0
				});
			}
			if (r_) {
				r_.then(data => {
					this.getList(true);
				}).catch(err => {
					uni.showToast({
						title: typeof err == "string" ? err : JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			}
		},
		onDelete(reason) {
			let rqData = {
				trainIds: this.chooseItem.trainId,
				reason
			}
			trainApi.postDelTrainAdmin(rqData).then(data => {
				this.getList(true);
			}).catch(err => {
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		},
		onFilterMenuClick(obj) {
			if (this[obj.type] != obj.value) {
				this[obj.type] = obj.value;
				this.getList(true);
			}
		},
		/**搜索
		 * @param {Object} value 搜索关键字
		 */
		onSearch(value) {
			if (this.query != value) {
				this.query = value;
				this.getList(true);
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.train {
	  min-height: calc(100% - #{$create-btn-height});
	}
	.mark {
	  position: fixed;
	  z-index: 11;
	}
	.statistics {
	  &-body {
	    width: 100%;
	    height: 728upx;
	    background: #ffffff;
	    position: fixed;
	    bottom: 0px;
	    z-index: 11;
	  }
	  &-title {
	    $h: 87upx;
	    height: $h;
	    line-height: $h;
	    text-align: center;
	    font-size: $font-size-30;
	    color: $color-666;
	  }
	  &-row {
	    position: relative;
	    width: 100%;
	    display: flex;
	  }
	  &-item {
	    position: relative;
	    width: 250upx;
	    height: 180upx;
	    display: flex;
	    flex-direction: column;
	    justify-content: center;
	    align-items: center;
	    &-title {
	      font-size: $font-size-24;
	      color: #333333;
	      margin-top: 25upx;
	    }
	    &-text {
	      font-size: $font-size-36;
	      color: #6d9985;
	    }
	  }
	}
</style>
