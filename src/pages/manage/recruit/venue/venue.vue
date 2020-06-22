<template>
	<view class="venue-list page-full " :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter placeholder="请输入现场招聘名称搜索" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList(d)' :footerBgColor="getBtnList(d).length==1?'#F7FFFB':''" @onItemClick="onItemClick" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-article :isRecommend="d.isRecommend" :name="d.venueTitle" :tips="d | getTips" tipsColor="#999999" :state="d | getState" :stateBgColor="d | getStateBgColor" :globalColor="globalColor(d.endDate)">
							<template v-slot:intro>
								<view class="item-introductions uni-ellipsis" :style="{color:globalColor(d.endDate)}">
									<text v-if="d.regState==0" class="iconfont icondizhi"></text>
									<text space="ensp">{{d | getIntro}}</text>
								</view>
							</template>
						</list-item-article>
					</template>
				</list-item>
			</template>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建招聘</text>
		</view>
		<msg-modal ref="msgModal" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import workApi from "@/api/modules/work.js"
import User from "@/api/modules/user.js"
import { getVenueState, formatDate } from "@/utils/utils.js";
import listItemArticle from "@/components/listItemArticle.vue"

let stateList = getVenueState();
let getListFn = workApi.getVenueListAdmin.bind(workApi);
let navTitle = "现场招聘";

export default {
	components: {
		listItemArticle
	},
	data() {
		let filterList = [];
		stateList.forEach(v => {
			filterList.push({ name: v.text, value: v.id });
		});
		filterList.unshift({ name: "全部", value: undefined, choose: true })
		return {
			canCreate: false,
			pageNum: 1,
			pageTotal: 2,
			query: undefined,
			type: undefined,
			state: undefined,
			orgId: undefined,
			dataList: [],
			filterList: [{ name: "类型", type: "type", children: [{ name: "全部", value: undefined, choose: true }, { name: "专场招聘", value: 1 }, { name: "校园招聘", value: 2 }] }, { name: "状态", type: "state", children: filterList }],
			chooseItem: undefined
		}
	},
	filters: {
		getState: function (venue) {
			if(venue.state==4&&Date.now()>venue.endDate){
				return "已过期";
			}
			return stateList.find(v => {
				return v.id == venue.state;
			}).text;
		},
		getStateBgColor: function (venue) {
			if(venue.state==4&&Date.now()>venue.endDate){
				return "#B1B1B1";
			}
			return stateList.find(v => {
				return v.id == venue.state;
			}).color;
		},
		getIntro(d) {
			// 0：已报名 1：未报名
			if (d.regState == 0) {
				return d.address;
			}
			// 未报名
			return `类型：${d.type == 1 ? "专场招聘" : "校园招聘"}  报名截止时间：${formatDate(d.deadline, "YYYY-MM-DD")}`;
		},
		getTips(d) {
			return `举办时间：${formatDate(d.startDate, "YYYY-MM-DD")} ${d.period}`;
		}
	},
	onLoad() {
		this.orgId = uni.getStorageSync("userinfo").org.orgId;
		this.getList();
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
		 * 
		 */
		async getList(restart = false, rename = true) {
			if (!this.power) {
				this.power = await this._getPower();
				this.canCreate = this.power.isCreate;
			} else {
				this.canCreate = this.power.isCreate;
			}
			this._getListFromServer(getListFn, restart, ["query", "type", "state", "orgId"]).then(total => {
				if (typeof total == "number" && rename) {
					navTitle = `现场招聘(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		globalColor(endDate){
			return Date.now()>endDate?"#999999":"";
		},
		getBtnList(d) {
			if(!this.power)return;
			let power=this.power;
			// 报名 <-->职位
			// 关闭 <-->发布
			// 编辑、删除
			let btnList = []
			let b_ = { text: "报名", icon: "iconbaoming", key: "venue" };
			if (d.regState == 0) {//已报名
				b_.text = "职位";
				b_.icon = "icontianjiaqiuzhiyixiang";
				b_.color = "#42B983";
				b_.key = "work";
			}
			btnList.push(b_);
			if (power.isUpdate) {
				btnList.push({ text: "编辑", icon: "iconbianji", key: "edit" });
			}
			let c_ = { text: "关闭", icon: "iconguanbi", key: "close" };
			if (power.isOnline) {
				if (d.state != 4) {//关闭
					c_.text = "发布";
					c_.icon = "iconfabu";
					c_.key = "release";
				}
				btnList.push(c_);
			}
			if (d.state == 2 || d.state == 3) {
				// 禁用报名、发布
				b_.color = c_.color = "#999999";
				b_.disable = c_.disable = true;
			}
			if (d.state == 5) {
				// 禁用报名
				b_.color = "#999999";
				b_.disable = true;
			}
			if (new Date().getTime() >= d.deadline) {
				// 禁用报名
				b_.color = "#999999";
				b_.disable = true;
			}
			if (d.state == 4) {
				if (power.isRecommend) {
					// 发布中才有推荐相关
					if (d.isRecommend) {
						btnList.push({ text: `取消推荐`, icon: "iconquxiaotuijian", key: "quxiaotuijian" });
					} else {
						btnList.push({ text: `推荐招聘会`, icon: "icontuijian", key: "tuijian" });
					}
				}
			}
			if (power.isDelete) {
				btnList.push({ text: "删除", icon: "iconshanchu", key: "delete" });
			}
			if (power.isAudit && d.state == 3) {
				btnList.push({ text: "审核", icon: "iconshenhe", key: "examine" });
			}
			// 改一下名字
			if(btnList.length==1){
				if(btnList[0].text=="报名"){
					btnList[0].text="报名招聘会"
				}else if(btnList[0].text=="职位"){
					btnList[0].text="查看职位"
				}
			}
			return btnList;
		},
		onItemClick(item) {
			if (item.state != 5) {
				uni.navigateTo({
					url: `/pages/detail/venueDetail?venueId=${item.venueId}`
				})
			}
		},
		onBtnClick({ btn: { key }, item }) {
			this.chooseItem = item;
			if (key == "close") {
				// 关闭
				this.$refs.msgModal.show(`<span>您确定要关闭现场招聘“</span><span style="color: #000;font-weight: bold">${item.venueTitle}</span><span>”？</span>`, key);
			} else if (key == "release") {
				// 发布
				this.$refs.msgModal.show(`<span>您确定要发布现场招聘“</span><span style="color: #000;font-weight: bold">${item.venueTitle}</span><span>”？</span>`, key);
			} else if (key == "delete") {
				// 删除
				this.$refs.msgModal.show(`<span>您确定要删除现场招聘“</span><span style="color: #000;font-weight: bold">${item.venueTitle}</span><span>”？</span>`, key);
			} else if (key == "tuijian") {
				// 推荐
				this.onMsgConfirm(key);
			} else if (key == "quxiaotuijian") {
				// 取消推荐
				this.onMsgConfirm(key);
			} else if (key == "edit") {
				// 编辑
				this.$toast("即将上线！");
				return;
				uni.navigateTo({
					url: `/pages/manage/recruit/venue/edit?id=${item.venueId}`
				})
			} else if (key == "examine") {
				// 审核
				uni.navigateTo({
					url: `/pages/manage/recruit/venue/examine?id=${item.venueId}`
				})
			} else if (key == "venue") {
				// 报名
				uni.navigateTo({
					url: `/pages/manage/recruit/venue/signup?id=${item.venueId}&signup=true`
				})
			} else if (key == "work") {
				// 职位
				uni.navigateTo({
					url: `/pages/manage/recruit/venue/signup?id=${item.venueId}`
				})
			}
		},
		onCreateBtnClick() {
			this.$toast("即将上线！");
			return;
			uni.navigateTo({
				url: `/pages/manage/recruit/venue/edit?create=true`
			});
		},
		onMsgConfirm(flag) {
			uni.showLoading();
			let r_ = undefined;
			if (flag == "close") {
				// 关闭
				r_ = workApi.postOnlineOfflineVenueAdmin({
					venueId: this.chooseItem.venueId,
					state: 5
				});
			} else if (flag == "release") {
				// 发布
				r_ = workApi.postOnlineOfflineVenueAdmin({
					venueId: this.chooseItem.venueId,
					state: 4
				});
			} else if (flag == "delete") {
				// 删除
				r_ = workApi.postDelVenueAdmin(this.chooseItem.venueId);
			} else if (flag == "tuijian") {
				// 推荐
				r_ = workApi.isRecommendAdmin({
					venueId: this.chooseItem.venueId,
					isRecommend: 1
				});
			} else if (flag == "quxiaotuijian") {
				// 取消推荐
				r_ = workApi.isRecommendAdmin({
					venueId: this.chooseItem.venueId,
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
						title: err,
						icon: "none"
					})
				})
			}
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
	.venue-list {
	  min-height: calc(100% - #{$create-btn-height});
	}
	.item-introductions {
	  width: 100%;
	  height: 30upx;
	  padding: 25upx 0px 25upx;
	  font-size: 24upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #666666;
	  .icondizhi {
	    font-size: 24upx;
	    margin-right: 10upx;
	  }
	}
</style>
