<template>
	<view class="exam page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入考试标题搜索" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList="getBtnList(d.state,d.isRecommend,d.type)" @onBtnClick="onBtnClick" @onItemClick="onItemClick" :key="i">
					<template v-slot:content>
						<list-item-course :isRecommend="d.isRecommend" :name="d.examTitle" :type="d.categoryTitle||'-'" :remark="d | getRemark" :state="d.state | getState" :stateBgColor="d.state | getStateBgColor" :tag="d.type==1?'练习':d.type==2?'考试':'补考'" tipsTitle="提示：" :tipsColor="d.state==2?'#FC703E':'#999999'" :globalColor="d.state==5?'#999999':''"></list-item-course>
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
							<text class="statistics-item-text">{{statistics.browseNumber}}</text>
							<text class="statistics-item-title">浏览量</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{statistics.questionNumber}}</text>
							<text class="statistics-item-title">试题数量</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{statistics.shouldExamNumber}}</text>
							<text class="statistics-item-title">应考人数</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{statistics.actualExamNumber}}</text>
							<text class="statistics-item-title">实考人数</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{statistics.score}}</text>
							<text class="statistics-item-title">平均成绩</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{$getFloat(statistics.passRatio*100,2)+"%"}}</text>
							<text class="statistics-item-title">合格率</text>
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
			<text>创建考试</text>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<delete-modal ref="del" @onDelete="onDelete"></delete-modal>
		<no-data :isNoData="noData"></no-data>

	</view>
</template>

<script>
import listItemCourse from "@/components/listItemCourse.vue"
import deleteModal from "@/components/deleteModal.vue"
import examApi from "@/api/modules/exam.js"
import puApi from "@/api/modules/public.js"
import { formatDate, getExamState, list2FilterList } from "@/utils/utils.js"

let getListFn = examApi.getExamListAdmin.bind(examApi);
let navTitle = `考试`;
let stateList = getExamState();
export default {
	components: {
		listItemCourse, deleteModal
	},
	data() {
		let filterList = [{ name: "考试分类", type: "categoryId", showChoose: true,showResetBtn:true },
		{ name: "考试状态", type: "state", children: [] }];
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
			statistics: {},//统计
			showFlag: false
		};
	},
	filters: {
		getRemark: function (d) {
				if(d.state==2)
					return d.reason;
				else 
					return `开始时间：${formatDate(d.startTime, "YYYY-MM-DD hh:mm:ss")}  考试时长：${d.type==1?"不限":d.examLength+"分钟"}`;
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
	},
	onLoad() {
		this.getList();
		let stateFilterList = [{ name: "全部", value: null, choose: true }];
		stateList.forEach(v => {
			stateFilterList.push({ name: v.text, value: v.id });
		});
		puApi.getExamCategoryListAdmin().then(data => {
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
			}else{
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["query", "categoryId", "state"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `考试(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		getBtnList(state, isRecommend,type) {
			// d.type==1?'练习':d.type==2?'考试':'补考'
			if(!this.power)return;
			let power=this.power;
			let btnList = [];
			if (power.isUpdate) {
				btnList.push({ text: `编辑`, icon: "iconbianji", key: "bianji" });
			}
			if (power.isOnline) {
				//处理发布按钮
				if(state==4){
					btnList.push({ text: `关闭`, icon: "iconguanbi", key: "guanbi" });
				}else {
					let fb = { text: `发布`, icon: "iconfabu", key: "fabu" };
					if(state!=5){
						fb.color = "#999999";
						fb.disable = true;
					}
					btnList.push(fb);
				}
			}
			if (power.isStatistics&&type!=1) {
				btnList.push({ text: `统计`, icon: "icontongji", key: "tongji" });
			}
			if (state == 4) {
				// 报名
				if(type!=1){
					btnList.push({ text: `报名用户`, icon: "iconbaomingyonghu", key: "baoming" });
				}
				if (power.isRecommend) {
					// 发布中才有推荐相关
					if (isRecommend) {
						btnList.push({ text: `取消推荐`, icon: "iconquxiaotuijian", key: "quxiaotuijian" });
					} else {
						btnList.push({ text: `推荐考试`, icon: "icontuijian", key: "tuijian" });
					}
				}
			}
			// 发布中没有删除
			if (power.isDelete && state != 4) {
				btnList.push({ text: `删除考试`, icon: "iconshanchu", key: "shanchu" });
			}
			//关闭 没有审核
			if (power.isAudit && state != 5) {
				btnList.push({ text: `审核考试`, icon: "iconshenhe", key: "shenhe" });
			}
			// 补考暂时不要
			return btnList;
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/detail/examDetail?examId=${item.examId}`
			});
		},
		onBtnClick({ btn: { key }, item }) {
			this.chooseItem = item;
			if (key == "guanbi") {
				// 关闭
				this.$refs.msg.show(`<span>是否关闭考试“</span><span style="color: #000;font-weight: bold">${item.examTitle}</span><span>”？</span>`, key);
			} else if (key == "fabu") {
				// 发布
				this.$refs.msg.show(`<span>是否发布考试“</span><span style="color: #000;font-weight: bold">${item.examTitle}</span><span>”？</span>`, key);
			} else if (key == "shanchu") {
				// 删除
				this.$refs.del.show(`删除考试“${item.examTitle}”`);
			} else if (key == "tuijian") {
				// 推荐
				this.onMsgConfirm(key);
			} else if (key == "quxiaotuijian") {
				// 取消推荐
				this.onMsgConfirm(key);
			} else if (key == "shenhe") {
				// 审核
				uni.navigateTo({
					url: `/pages/manage/exam/exam/examine?id=${item.examId}&categoryTitle=${item.categoryTitle||""}&examBankTitle=${item.examBankTitle||""}`
				})
			} else if (key == "bianji") {
				// 编辑
				uni.navigateTo({
					url: `/pages/manage/exam/exam/edit?id=${item.examId}&categoryTitle=${item.categoryTitle||""}&examBankTitle=${item.examBankTitle||""}`
				})
			} else if (key == "tongji") {
				// 统计
				uni.showLoading();
				examApi.getExamStatisticsAdmin(item.examId).then(data => {
					this.statistics = data;
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
			} else if (key == "baoming") {
				if(item.endTime<+new Date()){
					this.$toast("考试已结束，不能报名！");
					return;
				}
				// 报名用户
				uni.navigateTo({
					url: `/pages/manage/exam/exam/user?id=${item.examId}&name=${item.examTitle}&endTime=${item.endTime}`
				})
			}

		},
		onToUserReport() {
			// 查看用户报表
			uni.navigateTo({
				url: `/pages/manage/exam/exam/userReport?id=${this.chooseItem.examId}`
			})
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: `/pages/manage/exam/exam/edit?create=true`
			})
		},
		onMsgConfirm(key) {
			let r_ = undefined;
			uni.showLoading();
			if (key == "guanbi") {
				// 关闭
				r_ = examApi.postOnlineOfflineExamAdmin({
					examId: this.chooseItem.examId,
					state: 5
				});
			} else if (key == "fabu") {
				// 发布
				r_ = examApi.postOnlineOfflineExamAdmin({
					examId: this.chooseItem.examId,
					state: 4
				});
			} else if (key == "tuijian") {
				// 推荐
				r_ = examApi.postIsRecommendExamAdmin({
					examId: this.chooseItem.examId,
					isRecommend: 1
				});
			} else if (key == "quxiaotuijian") {
				// 取消推荐
				r_ = examApi.postIsRecommendExamAdmin({
					examId: this.chooseItem.examId,
					isRecommend: 0
				});
			}
			if (r_) {
				r_.then(data => {
					uni.hideLoading();
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: typeof err == "string" ? err : JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			}
		},
		onDelete(reason) {
			uni.showLoading();
			let rqData = {
				examId: this.chooseItem.examId,
				reason
			}
			examApi.postDelExamAdmin(rqData).then(data => {
				uni.hideLoading();
				this.getList(true);
			}).catch(err => {
				uni.hideLoading();
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
	.page-full {
	  min-height: calc(100% - #{$create-btn-height});
	}
	.mark {
	  position: fixed;
	  z-index: 11;
	}
	.statistics {
	  &-body {
	    width: 100%;
	    height: 548upx;
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
