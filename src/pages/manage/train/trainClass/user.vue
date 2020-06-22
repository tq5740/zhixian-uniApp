<template>
	<view class="user page-full">
		<search-filter searchPlaceholder="请输入姓名/电话/身份证搜索" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<list-item v-for="(o,i) of dataList" :key="i" :item="o" :btnList='o.state|getBtnList' @onItemClick="onItemClick" @onBtnClick="onBtnClick">
				<template v-slot:content>
					<list-item-org-user :logo="o.idPhoto||defaultImg.user" :name="o.name" :intro="'身份证号：'+o.idNumber" :state="o.state|getState" :stateBgColor="o.state|getStateBg">
						<template v-slot:tips>
							<view class="tips">
								<text class="reason" v-if="o.state==2||o.state==5">
									{{o.reason}}
								</text>
								<text class="score" v-else space="emsp">
									<text>学习结果：<text class="result">{{o.studyResult?"合格":"不合格"}}</text></text>
									<text class="exam">考试结果：<text class="result">
											{{$isEmpty(o.testResult)?"-":o.testResult?"合格":"不合格"}}
										</text></text>
								</text>
							</view>
						</template>
					</list-item-org-user>
				</template>
			</list-item>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import { mapState } from "vuex";
import puApi from "@/api/modules/public.js"
import { getTrainClassUserState } from "@/utils/utils.js"
import listItemOrgUser from "@/components/listItemOrgUser.vue"

let getListFn = puApi.getTrainClassUserListAdmin.bind(puApi);
let navTitle = `培训班级人员`;
const stateList = getTrainClassUserState();
export default {
	components: {
		listItemOrgUser
	},
	computed: {
		...mapState(["defaultImg"])
	},
	data() {
		let stateFilterList = [{ name: "全部", value: null, choose: true }];
		stateList.forEach(v => {
			stateFilterList.push({ name: v.text, value: v.id });
		});
		let filterList = [{ name: "考试结果", type: "testResult", children: [{ name: "全部", value: null, choose: true }, { name: "合格", value: true }, { name: "不合格", value: false }] },
		{ name: "用户状态", type: "state", children: stateFilterList }];
		return {
			filterList: filterList,
			pageNum: 1,
			pageTotal: 2,
			classId: undefined,
			state: undefined,//状态
			query: undefined,//查询条件
			dataList: [],
			chooseItem: undefined
		};
	},
	filters: {
		getState(val) {
			return stateList.find(v => {
				return v.id == val;
			}).text;
		},
		getStateBg(val) {
			return stateList.find(v => {
				return v.id == val;
			}).color;
		},
		getBtnList(state) {
			if (state == 4 || state == 5) {
				return [{ text: "申请证书", icon: "iconzhengshu", key: "shenqing" }]
			} else if (state == 6) {
				return [{ text: "打印证书", icon: "iconzhengshu", key: "dayin" }]
			} else if (state == 7) {
				return [{ text: "查看证书", icon: "iconzhengshu", key: "chakan" }]
			}
		}
	},
	onLoad({ classId }) {
		this.classId = classId;
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	onShow() {
		this.$updateNavbarTitle(navTitle);
	},
	methods: {
		/**
		 * 请求列表
		 */
		getList(restart = false) {
			this._getListFromServer(getListFn, restart, ["classId", "query", "state"]).then(total => {
				if (typeof total == "number") {
					navTitle = `培训班级人员(${total})`;
					this.$updateNavbarTitle(navTitle);
				}
			});
		},
		onItemClick(item) {
			uni.navigateTo({
				url: `/pages/manage/train/trainClass/userDetail?user=${JSON.stringify(item)}`
			})
		},
		onBtnClick({ btn: { key }, item }) {
			this.chooseItem = item;
			if (key == "shenqing") {
				this.$refs.msg.show(`<span>是否申请“</span><span style="color: #000;font-weight: bold">${item.name}</span><span>”的证书？</span>`, key);
			} else if (key == "dayin") {
				this.$refs.msg.show(`<span>是否打印“</span><span style="color: #000;font-weight: bold">${item.name}</span><span>”的证书？</span>`, key);
			} else if (key == "renzheng") {

			} else if (key == "chakan") {

			}
		},
		onMsgConfirm(key) {
			uni.showLoading();
			let r_ = undefined;
			if (key == "shenqing") {
				r_ = puApi.getGetSwAttendance({
					classId: this.classId,
					classUserId: this.chooseItem.classUserId
				});
			} else if (key == "dayin") {
				r_ = puApi.postUpdatePrintState({
					trainClassUserIds: this.chooseItem.classUserId,
					state: 7
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
	},
}
</script>

<style lang="scss" scoped>
	.tips {
	  background: #ffffff;
	  font-size: $font-size-24;
	  padding: 0px 0px 20upx 120upx;
	  .reason {
	    color: #fc703e;
	  }
	  .score {
	    color: $color-999;
	  }
	  .exam {
	    margin-left: 30upx;
	  }
	  .result {
	    color: #6d9985;
	  }
	}
</style>
