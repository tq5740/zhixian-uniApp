<template>
	<view class="user page-full">
		<search-filter searchPlaceholder="请输入批次号/专业证搜索" :filterList="filterList" @onFilterMenuClick="onFilterMenuClick" @onSearch="onSearch"></search-filter>
		<view class="list-conten">
			<list-item v-for="(o,i) of dataList" :key="i" :item="o" :btnList='getBtnList(o)'  @onItemClick="onItemClick" @onBtnClick="onBtnClick">
				<template v-slot:content>
					<list-item-org-user :logo="o.idPhoto||defaultImg.user" :name="o.name" :intro="'身份证号：'+o.idNumber" :state="o.state|getState" :stateBgColor="o.state|getStateBg">
						<template v-slot:tips>
							<view class="tips">
								<text class="reason" v-if="o.state==2||o.state==5">
									{{o.reason}}
								</text>
								<text class="score" v-else space="emsp">
									<text class="exam">学习结果：<text class="result">{{$isEmpty(o.studyResult)?"-":o.studyResult?"合格":"不合格"}}</text></text>
									<text class="exam">考试结果：<text class="result">{{$isEmpty(o.testResult)?"-":o.testResult?"合格":"不合格"}}</text></text>
								</text>
							</view>
						</template>
					</list-item-org-user>
				</template>
			</list-item>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
		<view class="certificate" v-show="certificateUrl">
			<view class="mark"  @touchmove.stop.prevent="onMove" @tap="certificateUrl=''">
				<image :src="$store.state.configData.imgDomain+certificateUrl" ></image>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from "vuex";
import puApi from "@/api/modules/public.js"
import userApi from "@/api/modules/user.js"
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
		return {
			filterList: [],
			pageNum: 1,
			pageTotal: 2,
			classId: undefined,
			state: undefined,//状态
			query: undefined,//查询条件
			dataList: [],
			chooseItem: undefined,
			certificateUrl:'',
			hierarchy:"",
			print:false//从打印列表过来
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
		}
	},
	onLoad({ classId,hierarchy,print,noPrints,yesPrints}) {
		this.classId = classId;
		this.hierarchy=hierarchy;
		if(print){
			// 从打印列表过来
			this.print=true;
			this.filterList=[{ name: "全部", value: null, choose: true ,type: "state"},{value: 3,name: `待打印(${noPrints})`,type: "state"},{value: 4,name: `已打印(${yesPrints})`,type: "state"}];
		}else{
			let stateFilterList = [{ name: "全部", value: null, choose: true ,type: "state"}];
			stateList.forEach(v => {
				stateFilterList.push({ name: v.text, value: v.id , type: "state"});
			});
			this.filterList=stateFilterList;
		}
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	onShow(refresh) {
		if(refresh){
			this.getList(true);
		}else{
			this.$updateNavbarTitle(navTitle);
		}
		
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
		getBtnList(u) {
			let btnList=[];
			if(!this.print){
				btnList.push({ text: "重置密码", icon: "iconzhongzhimima",key:"resetpwd" });
			}
			if(u.authState!=4|| !u.idPhoto){
				btnList.unshift({ text: "身份录入", icon: "iconshenfenluru",key:"inputIdentity" });
				return btnList;
			}
			let state=u.state;
			if (state == 1 ||state == 2) {
				 btnList.unshift({ text: "申请证书", icon: "iconzhengshu", key: "shenqing" });
			} else if (state == 3){
				btnList.unshift({ text: "打印证书", icon: "iconzhengshu", key: "dayin" });
			} else if (state == 4) {
				btnList.unshift({ text: "查看证书", icon: "iconzhengshu", key: "chakan" });
			}
			return btnList;
		},
		onItemClick(item) {
			for (let k of Object.keys(item)) {
				if(this.$isEmpty(item[k])){
					item[k]="";
				}
			}
			uni.navigateTo({
				url: `/pages/manage/certificate/apply/userDetail?user=${JSON.stringify(item)}`
			})
		},
		onBtnClick({ btn: { key }, item }) {
			this.chooseItem = item;
			if (key == "shenqing") {
				this.$refs.msg.show(`<span>是否申请“</span><span style="color: #000;font-weight: bold">${item.name}</span><span>”的证书？</span>`, key);
			} else if (key == "dayin") {
				this.$refs.msg.show(`<span>是否打印“</span><span style="color: #000;font-weight: bold">${item.name}</span><span>”的证书？</span>`, key);
			} else if (key == "chakan") {
				if(!item.certificateUrl){
					this.$toast("暂无证书信息");return;
				}
				this.certificateUrl=item.certificateUrl||'';
			}else if (key == "resetpwd") {
				this.$refs.msg.show(`<span>确定要将“${item.name}”的密码重置为：</span><span style="color: #000">cdjy9957</span><span>？</span>`, 'resetpwd');
			}else if (key == "inputIdentity") {
				uni.navigateTo({
					url:`/pages/manage/certificate/apply/inputIdentity?id=${item.classUserId}&idNumber=${item.idNumber}&name=${item.name}&phone=${item.phone}&hierarchy=${this.hierarchy}`
				})
			}
		},
		onMsgConfirm(key) {
			uni.showLoading();
			let r_ = undefined;
			if (key == "shenqing") {
				r_ = puApi.postApplyCertificateAdmin({
					classId: this.classId,
					trainUserIds: this.chooseItem.classUserId
				});
			} else if (key == "dayin") {
				r_ = puApi.postUpdatePrintState({
					trainClassUserIds: this.chooseItem.classUserId,
					state: 4
				});
			}else if (key == "resetpwd") {
				r_ = userApi.postUserResetPassword(this.chooseItem.userId);
			}
			if (r_) {
				r_.then(data => {
					uni.hideLoading();
					this.$toast("操作成功");
					setTimeout(()=>{
						this.getList(true);
					},1000);
				}).catch(err => {
					uni.hideLoading();
				});
			}
		},
		onFilterMenuClick(obj) {
			if (this[obj.type] != obj.value) {
				this[obj.type] = obj.value;
				this.getList(true);
			}
		},
		onMove() { return ;},
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
	.mark{
		z-index: 11;
		position: fixed;
		image{
			position: absolute;
			top: 50%;left: 50%;transform: translate(-50%,-50%);
			z-index: 13;
			max-width: 100%;
		}
	}
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
	  .result {
	    color: #6d9985;
		margin-right: 20upx;
	  }
	}
	.toauth{
		 font-size: $font-size-24;
		  background: #ffffff;
		   color: #fc703e;
		   height: 88upx;line-height: 88upx;
		   padding-left: 20upx;
		   position: relative;
	}
</style>
