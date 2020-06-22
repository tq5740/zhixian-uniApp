import Vue from 'vue'
import App from './App'
import store from "./store"
import {
	openLocation,
	formatDate,
	mobileReg,
	getTimeSpan,
	formatSalary,
	getFloat,
	getParseAge,
	getParseExperience,
	getImageIp,
	isEmpty,
	escape2Html
} from "./utils/utils"
import menuTree from "@/utils/menuTree"
import msgModal from "./components/msgModal.vue"
import searchFilter from "./components/searchFilter.vue"
import listItem from './components/listItem.vue'
import infoList from './components/infoList.vue'
import noData from './components/noData.vue'
import tree from '@/components/tree.vue'
import listItemQuestionDetail from "@/components/listItemQuestionDetail.vue";
import editQuestion from "@/components/editQuestion.vue";
import './static/style/icon.css'
import './static/style/iconColor.scss'
import './static/style/reset.scss'
import User from "@/api/modules/user.js"
Vue.component("msg-modal", msgModal);
Vue.component("search-filter", searchFilter);
Vue.component("list-item", listItem);
Vue.component("info-list", infoList);
Vue.component("no-data", noData);
//全局注册组件，然后在tree,listItemQuestionDetail,editQuestion里递归(小程序不支持直接用组件name属性进行递归)
Vue.component("tree", tree);
Vue.component("listItemQuestionDetail", listItemQuestionDetail);
Vue.component("editQuestion", editQuestion);

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$store = store; // 注册vuex
Vue.prototype.$escape2Html = escape2Html; // 统一富文本格式
Vue.prototype.$openLocation = openLocation; // 导航统一方法
Vue.prototype.$formatDate = formatDate; // 格式化时间
Vue.prototype.$mobileReg = mobileReg; // 手机号码格式验证
Vue.prototype.$getTimeSpan = getTimeSpan; // 过去时间格式
Vue.prototype.$formatSalary = formatSalary; // 薪资格式化
Vue.prototype.$getFloat = getFloat; // 保留N为小数
Vue.prototype.$getParseAge = getParseAge; // 格式化出生年龄
Vue.prototype.$getParseExperience = getParseExperience; // 格式化工作经验
Vue.prototype.$isEmpty = isEmpty; // 判空
Vue.prototype.$isHaveEmpty = function (values) {
	for (let v of values) {
		if (this.$isEmpty(v))
			return true;
	}
}; // 判空
Vue.prototype.$toast = function (msg = "") {
	uni.showToast({
		title: msg,
		icon: "none",
		duration: 2000
	});
}
Vue.prototype.$iosScrollTop = function () {
	// #ifdef H5
	let visionHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	let scrolledHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	let trueHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
	if (trueHeight - (visionHeight + scrolledHeight) <= 100) {
		setTimeout(() => {
			document.getElementsByTagName("body")[0].scrollTop = 10000;
		}, 100);
	}
	// #endif
}
Vue.prototype.$iosScrollAuto = function () {
	// #ifdef H5
	document.documentElement.scrollTop = 1 + document.documentElement.scrollTop;
	document.body.scrollTop = 1 + document.body.scrollTop;
	// #endif
}


Vue.prototype.$formatDuration = function (val) { //格式化时长
	if (!(/^\d+$/.test(val))) return "-";
	let s = val % 60; //秒
	let m = Math.floor(val / 60); //分
	let h = 0;
	if (m > 59) {
		h = Math.floor(m / 60); //时
		m = m % 60;
	}
	return `${h == 0 ? "00" : h}:${m == 0 ? "00" : m}:${s == 0 ? "00" : s}`;
}
Vue.prototype.$updateNavbarTitle = function (title) {// 修改导航栏标题
	this.$store.commit("updateNavbarTitle", title);
}
Vue.prototype.$imgSize = {
	"width100": "/100x100",
	"width210": "/210x297",
	"width224": "/224x126",
	"width240": "/240x150",
	"width800": "/800x450"
};

Vue.prototype.$getImgSize = function (w = 1, h = 1) {
	let p1 = w * h;
	let r = undefined;
	let last = 0;
	for (let s in this.$imgSize) {
		// let p2=eval(this.$imgSize[s].replace("/","").replace("x","*"));//小程序不支持eval
		let nums = this.$imgSize[s].replace("/", "").split("x");
		let p2 = Number.parseInt(nums[0]) * Number.parseInt(nums[1]);

		if (p1 == p2) {
			r = s;
			break;
		} else if (p1 < p2) {
			if (!r) {
				r = s;
				break;
			}
			if (p1 > (p2 - last)) {
				r = s;
				break;
			}
		} else if (p1 > p2) {
			r = s;
			last = p2;
		}
	}
	return this.$imgSize[r];
}

function findMenu(query, list) {
	for (let l of list) {
		if (l.url) {
			if (l.url.indexOf(query) != -1) {
				return l
			}
		}
		if (l.children && l.children.length > 0) {
			let r = findMenu(query, l.children);
			if (r) return r;
		}
	}
	return undefined;
}


Vue.mixin({
	data() {
		return {
			isInterface: false
		}
	},
	computed: {
		noData() {
			if (this.dataList) {
				return this.dataList.length == 0 && this.isInterface;
			}
			return false;
		}
	},
	methods: {
		/**
		 * 从服务器获取数据
		 * @param {requestFn}  = Function//请求方法
		 * @param {restart}  = Boolean//true--重新第一页请求
		 * @param {params}  = Array//请求参数名
		 */
		_getListFromServer: async function (requestFn, restart = false, params = [], pageSize = 10, handler) {
			// 要保证实例上有pageNum、pageTotal、dataList值
			if (restart) {
				this.pageNum = 1;
				this.pageTotal = 2;
			}
			if (this.pageNum > this.pageTotal) {
				uni.showToast({
					icon: "none",
					title: "已全部加载"
				});
				return;
			}
			uni.showLoading();
			let rqData = {
				pageNum: this.pageNum,
				pageSize: pageSize
			}
			for (let p of params) {
				if (!this.$isEmpty(this[p]))
					rqData[p] = this[p];
			}
			return requestFn(rqData).then(data => {
				this.isInterface = true;
				if (handler) {
					handler(data.result);
				}
				if (restart) { //搜索条件变更
					this.dataList = data.result;
				} else {
					this.dataList.splice(this.dataList.length, 0, ...data.result);
				}
				++this.pageNum;
				if (this.pageTotal != data.pages || this.pageTotal == 2) {
					this.pageTotal = data.pages;
					uni.hideLoading();
					return Promise.resolve(data.total);
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		/**
		 * 获取页面权限
		 * @param {root}  = 页面归属(manage、index)
		 */
		_getPower: function (root = "manage") {
			return new Promise((resolve, reject) => {
				if (!this.$store.state.methodTree) {
					setTimeout(() => {
						resolve(this._getPower(root));
					}, 1000);
					return;
				}
				let power = {
					isAudit: false,//审核
					isCreate: false,//新增
					isDelete: false,//删除
					isForbidden: false,//禁用启用
					isImport: false, //导入
					isMove: false,//移动
					isOnline: false, //上下线
					isQuery: false, //查询
					isQuerySite: false,//查询站点
					isRecommend: false,//推荐
					isReset: false,//重置密码
					isStatistics: false, //统计
					isUpdate: false,//修改
					isUpdateSite: false//修改站点
				}
				if (this.$isEmpty(this.$mp)) resolve(power);
				if (this.$isEmpty(this.$mp.page)) resolve(power);
				let route = this.$mp.page.route;
				let menuList = menuTree[root];
				if (!menuList) resolve(power);
				let _mL = [];
				// 目前菜单就两级嵌套
				for (let l of menuList) {
					if (l.url&&l.url.indexOf(route) != -1) {
						_mL.push(l); break;
					}
					if (l.children && l.children.length > 0) {
						for (let m of l.children) {
							if (m.url&&m.url.indexOf(route) != -1) {
								_mL.push(l);//父级
								_mL.push(m);//子级
								break;
							}
						}
					}
				}
				if (_mL.length == 0) resolve(power);
				let serverMethodTree = this.$store.state.methodTree[root];
				for (let m of _mL) {
					if (serverMethodTree.children) {
						serverMethodTree = serverMethodTree.children[m.key];
					} else {
						serverMethodTree = serverMethodTree[m.key];
					}
					if (!serverMethodTree) resolve(power);
				}
				for (let k in power) {
					power[k] = serverMethodTree[k];
				}
				resolve(power);
			});
		},
		/**
		 * 刷新前页数据
		 * @param {num}  = 当前页面之前的第{{num}}个页面
		 * @param {handler}  = 具体的刷新函数，会将页面实例作为参数传入
		 */
		_refreshPrePage: function ({ num = 1, handler } = {}) {
			let pages = getCurrentPages();
			if (pages.length > num) {
				// 至少num+1个页面
				let prePage = pages[pages.length - (num + 1)];
				if (prePage) {
					setTimeout(() => {
						if (handler) {
							handler(prePage);
						} else {
							// 小程序只暴露生命周期函数，H5相反
							// #ifdef MP-WEIXIN
							prePage.onShow(true);
							// #endif
							// #ifdef H5
							prePage.getList(true, false);
							// #endif
						}
					}, 1500);
				}
			}
		}
	}
})

// 必须有vue实例，可以不挂载
 new Vue({
	...App,
	store
}).$mount();

