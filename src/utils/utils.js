// #ifdef H5
import jweixin from "jweixin-module";
// #endif

/**
 *
 * @param data 微信签名配置
 */
export function weixinShareConfig(
	data,
	jsApiList = [
		"onMenuShareTimeline",
		"onMenuShareAppMessage",
		"onMenuShareQQ",
		"onMenuShareWeibo",
		"onMenuShareQZone"
	]
) {
	jweixin.config({
		debug: false,
		appId: data.appid,
		timestamp: data.timestamp,
		nonceStr: data.nonceStr,
		signature: data.signature,
		jsApiList
	});
}

export function wxBound(appId) {
	let baseUrl = "https://hr.weijiuye.com.cn/pages/mine/setting/wxOpenIdBound&response_type=code&scope=snsapi_userinfo&state=weixin";
	location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + baseUrl);
}

export function escape2Html(str) {
	return str ? decodeURIComponent(str).replace(/section/g, "div")
		.replace(/strong/g, "div")
		.replace(/footer/g, "div")
		.replace(/<img[^>]*>/gi, function (match, capture) {
			return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width: 100%"')
		})
		// #ifdef MP-WEIXIN
		.replace(/width: 100%;/g, "")
		// #endif
		: "没有数据"
}

// 下载图片
export function downImg(url) {
	var a = document.createElement('a');
	var event = new MouseEvent('click');
	a.download = '附件.jpg';
	a.href = url
	a.dispatchEvent(event)
}


/**
 *
 * @param data {latitude,longitude,name,address,scale}
 */
export function openLocation(data) {
	// #ifdef H5
	location.href = 'https://apis.map.qq.com/tools/routeplan/eword=' + data.address + '&epointx=' + data.longitude +
		'&epointy=' + data.latitude + '?referer=成都微就业&key=Z45BZ-X4LKO-KXJW4-SMWLQ-QAASJ-3VBIP';
	// #endif

	// #ifdef MP-WEIXIN
	let configLoc = {
		latitude: data.latitude,
		longitude: data.longitude,
		name: data.address,
		address: data.address,
		scale: 15
	}
	wx.openLocation(configLoc);
	// #endif
}


/**
 *
 * @param config {title,link,imgUrl,desc}
 */
export function wxShare(config) {
	const _config = {
		title: config.title,
		link: config.link,
		imgUrl: config.imgUrl,
		desc: config.desc
	};
	jweixin.ready(function () {
		//分享到朋友圈
		jweixin.onMenuShareTimeline(_config);
		jweixin.onMenuShareAppMessage(_config);
		jweixin.onMenuShareQQ(_config);
		jweixin.onMenuShareWeibo(_config);
		jweixin.onMenuShareQZone(_config);
	});
}

export function getAppVersion() {
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		return "ios";
	} else if (/(Android)/i.test(navigator.userAgent)) {
		return "android";
	} else {
		return "pc";
	}
}

export function isWxBrowser() {
	var ua = navigator.userAgent.toLowerCase();
	return /micromessenger/.test(ua);
}




export function sleep(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}


/**
 *
 * @param timeStr yyyy-mm-dd hh:mm:ss
 *
 */
export function getTimeStamp(timeStr) {
	var dateStr = timeStr.replace(/-/g, "/");
	return +new Date(dateStr);
}

/**
 *
 * @param time 时间戳
 * @param format 需要格式的类型 `YYYY-MM-DD h:m:s` `YYYY-MM-DD` `h:m:s`等
 */
export function formatDate(time, fmt) {
	var date = new Date(time);
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}

	var o = {
		"M+": date.getMonth() + 1,
		"D+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds()
	};

	for (let i in o) {
		if (new RegExp("(" + i + ")").test(fmt)) {
			let str = o[i] + "";
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : str.padLeft("0", 2)
			);
		}
	}
	return fmt;
}

String.prototype.padLeft = function (padchar, num) {
	return padchar.repeat(this.length > num ? 0 : num - this.length) + this;
};
/**
 *
 * @param str 手机号码
 */
export function mobileReg(str) {
	return /^[0-9]\d{10}$/.test(str);
}

/**
 * 统一社会信用码校验
 * @param {Object} str
 */
export function creditCode(str){
	return /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g.test(str);
}


/**
 *	邮箱
 * @param {Object} str
 */
export function checkEmail2(str){
	return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(str);
}

export function getScrollY() {
	var s = 0;
	s =
		window.pageYOffset ||
		document.documentElement.scrollTop ||
		document.body.scrollTop;
	return s;
}

export const getTimeSpan = (data, closer) => {
	let getTimepan = (Date.now() - data) / 1000;
	let day = Math.floor(getTimepan / 86400);
	let hour = Math.floor((getTimepan - day * 86400) / 3600);
	let minute = Math.floor((getTimepan - day * 86400 - hour * 3600) / 60);
	let second = Math.floor(getTimepan - day * 86400 - hour * 3600 - minute * 60);
	let str = "";
	if (closer) {
		if (day < 0) {
			return "刚刚";
		}
		if (day > 9) {
			return formatDate(data, "YYYY-MM-DD");
		}
		if (day > 0) {
			return day + "天前";
		}
		if (hour > 0) {
			return hour + "小时前";
		}
		if (minute > 0) {
			return minute + "分钟前";
		}
		return "刚刚";
	} else {
		return formatDate(data, "YYYY-MM-DD");
	}
};

function toDecimal2NoZero(x) {
	var f = Math.round(x * 10) / 10;
	var s = f.toString();
	return s;
}

//格式化薪资
// export function formatSalary(lowSalary, highSalary, salaryType) {
//     if (salaryType == 3) {
//         return toDecimal2NoZero(lowSalary) + "元/天";
//     }
//     const lowSalaryVal = lowSalary / 1000;
//     const highSalaryVal = highSalary / 1000;
//     if (highSalaryVal && !lowSalaryVal) {
//         return `0-${toDecimal2NoZero(highSalaryVal)}k`;
//     }

//     if (!highSalaryVal && lowSalaryVal) {
//         return `${toDecimal2NoZero(lowSalaryVal)}k以上`;
//     }

//     if (toDecimal2NoZero(lowSalaryVal) == toDecimal2NoZero(highSalaryVal)) {
//         return toDecimal2NoZero(lowSalaryVal) + "k";
//     }

//     return `${toDecimal2NoZero(lowSalaryVal)}k-${toDecimal2NoZero(highSalaryVal)}k`;
// }

export function formatSalary(lowSalary, highSalary, salaryType) {
	if (salaryType == 1) {
		return lowSalary;
	}
	if (highSalary && !lowSalary) {
		return `0-${highSalary}`;
	}

	if (!highSalary && lowSalary) {
		return lowSalary;
	}

	if (lowSalary == highSalary) {
		return lowSalary;
	}

	return `${lowSalary}-${highSalary}`;
}


export function checkSize(size, mb) {
	return 1024 * 1024 * mb < size;
}

//数字四舍五入（保留n位小数）
export function getFloat(num, n = 0) {
	if (n <= 0) return num;
	num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
	return num;
}

//将秒转换为时间
export function secondToTime(time) {
	let hour = Math.floor(time / 3600) + "";
	let minute = Math.floor(time / 60) + "";
	let second = Math.floor(time % 60) + "";
	if (hour.length == 1) hour = "0" + hour;
	if (minute.length == 1) minute = "0" + minute;
	if (second.length == 1) second = "0" + second;
	return hour + ":" + minute + ":" + second;
}

//格式化出生年龄
export function getParseAge(birthDateTime) {
	if (!birthDateTime) return;
	const nowDateTime = +new Date();
	let hours = (nowDateTime - birthDateTime) / 3600000;
	return Math.floor(hours / 8640);
}

//格式化工作经验
export function getParseExperience(startWorkYear) {
	if (!startWorkYear) return;
	const parseStartWorkYear = +startWorkYear;
	const nowYear = +new Date().getFullYear();
	return nowYear >= parseStartWorkYear ? nowYear - parseStartWorkYear : 0;
}
export function dataURLtoFile(dataurl, filename) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {
		type: mime
	});
}

export function wxLogin(appId) {
	let baseUrl = "https://hr.weijiuye.com.cn/pages/login/wxlogin&response_type=code&scope=snsapi_userinfo&state=weixin";
	location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + baseUrl);
}


export function hasScrolled() {
	if (document.documentElement.scrollTop > 0) {
		document.documentElement.scrollTop = 0
		return false;
	}
	return true;
}
export function emptyLength(arr) {
	let _number_ = 0;
	arr.forEach(val => {
		if (val != "") {
			_number_ += 1;
		}
	})
	return _number_;
}
export function checkEmail(val) {
	var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
	if (myReg.test(val)) {
		return true;
	} else {
		return false;
	}
}
export function isEmojiCharacter(substring) {
	for (var i = 0; i < substring.length; i++) {
		var hs = substring.charCodeAt(i);
		if (0xd800 <= hs && hs <= 0xdbff) {
			if (substring.length > 1) {
				var ls = substring.charCodeAt(i + 1);
				var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
				if (0x1d000 <= uc && uc <= 0x1f77f) {
					return true;
				}
			}
		} else if (substring.length > 1) {
			var ls = substring.charCodeAt(i + 1);
			if (ls == 0x20e3) {
				return true;
			}
		} else {
			if (0x2100 <= hs && hs <= 0x27ff) {
				return true;
			} else if (0x2B05 <= hs && hs <= 0x2b07) {
				return true;
			} else if (0x2934 <= hs && hs <= 0x2935) {
				return true;
			} else if (0x3297 <= hs && hs <= 0x3299) {
				return true;
			} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
				hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
				hs == 0x2b50) {
				return true;
			}
		}
	}
}

export function isChina(s) {
	let patrn = /[\u4E00-\u9FA5]/gi;
	if (!patrn.exec(s)) {
		return false;
	} else {
		return true;
	}
}

/**
 * 组织类型
 */
export function getOrgType() {
	return ["市场主体", "机关群团", "事业单位", "社会组织", "中/高职院校"];
}
/**
 * 组织状态
 */
export function getOrgState() {
	return ["草稿", "未通过", "审核中", "已认证", "禁用"];
}

/**
 * 组织列表筛选条件
 */
export function getOrgFilterList() {
	return [{
		name: "组织类型",
		type: "orgType",
		children: [{
			name: "全部",
			value: null,
			choose: true
		}, {
			name: "市场主体",
			value: 1,
			choose: false
		}, {
			name: "机关群团",
			value: 2,
			choose: false
		}, {
			name: "事业单位",
			value: 3,
			choose: false
		}, {
			name: "社会组织",
			value: 4,
			choose: false
		}, {
			name: "中/高职院校",
			value: 5,
			choose: false
		}]
	},
	{
		name: "组织状态",
		type: "state",
		children: [{
			name: "全部",
			value: null,
			choose: true
		}, {
			name: "草稿",
			value: 1,
			choose: false
		}, {
			name: "未通过",
			value: 2,
			choose: false
		}, {
			name: "审核中",
			value: 3,
			choose: false
		}, {
			name: "已认证",
			value: 4,
			choose: false
		}, {
			name: "禁用",
			value: 5,
			choose: false
		}]
	}
	];
}
/**
 * 认证列表筛选条件
 */
export function getAuthFilterList() {
	return [{
		name: '全部',
		value: "",
		choose: true,
		type: "state"
	}, {
		name: '已认证',
		value: 4,
		choose: false,
		type: "state"
	},
	{
		name: '审核中',
		value: 3,
		choose: false,
		type: "state"
	}, 
	{
		name: '未通过',
		value: 2,
		choose: false,
		type: "state"
	}];
}

export function list2FilterList(arr, nameKey, valueKey) {
	arr.forEach(v => {
		if (v.children)
			list2FilterList(v.children, nameKey, valueKey);
		v.name = v[nameKey];
		v.value = v[valueKey];
	})
}
/**
 * 文章状态
 */
export function getArticleState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	},
	{
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 5,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}

/**
 * 文章报名状态
 */
export function getArticleRegState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	}, {
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "已通过",
		color: "#42B983"
	}
	];
}
/**
 * 职位状态
 */
export function getWorkState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	},
	{
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 5,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}

/**
 * 职位学历要求
 */
export function getWorkEducation() {
	return ["全部", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"]
}
/**
 * 职位经验要求
 */
export function getWorkExperience() {
	return ["全部", "1年", "2年", "3-4年", "5-10年", "10年以上"]
}

/**
 * 工作性质
 */
export function getWorkNature() {
	return [{
		name: "全部",
		value: 0
	}, {
		name: "全职",
		value: 1
	}, {
		name: "兼职",
		value: 2
	}, {
		name: "实习",
		value: 3
	}];
}

/**
 * 投递状态
 */
export function getBookingState() {
	// 1：已预约；2：不合适；3：待面试；4：拒绝面试；5：未通过；6：待入职；7：未入职；8：已入职
	return [{
		name: "已预约",
		type: "state",
		value: 1
	},
	{
		name: "不合适",
		type: "state",
		value: 2
	},
	{
		name: "待面试",
		type: "state",
		value: 3
	},
	{
		name: "拒绝面试",
		type: "state",
		value: 4
	},
	{
		name: "未通过",
		type: "state",
		value: 5
	},
	{
		name: "待入职",
		type: "state",
		value: 6
	},
	{
		name: "未入职",
		type: "state",
		value: 7
	},
	{
		name: "已入职",
		type: "state",
		value: 8
	}
	];
}


/**
 * 投递记录
 */
export function bookingState() {
	// 1.待查阅	3.待面试 4.拒绝面试 6.待入职 7.拒绝入职
	return ["待查阅", "待面试", "拒绝面试", "待入职", "拒绝入职"];
}


/**
 * 现场招聘状态
 */
export function getVenueState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	}, {
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 5,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}

export function isEmpty(val) {
	if (val == undefined || val == null) {
		return true;
	}
	if (typeof val == 'string') {
		if (val.replace(/[" "]*/g, "") == "")
			return true;
	}
	return false;
}


/**
 * 课程状态
 */
export function getCourseState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	}, {
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 5,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}


/**
 * 课程学习用户的状态
 */
export function getCourseUserReportState() {
	return [{
		id: 1,
		text: "未尝试",
		color: "#B1B1B1"
	},
	{
		id: 2,
		text: "未完成",
		color: "#FFAE00"
	},
	{
		id: 3,
		text: "已完成",
		color: "#42B983"
	}
	];
}


/**
 * 从data中提取地址信息
 * @param {Object} data
 */
export function getAddressInfo(data) {
	let res=JSON.parse(data);
		if (res.status == 0) {
			let location;
			if (res.result.location) {
				location = res.result.location
			} else if (res.result.location) {
				location = {
					latitude: res.result.lat,
					longitude: res.result.lng
				}
			}
			let result = {
				address: res.result.address,
				province: res.result.address_component.province,
				city: res.result.address_component.city,
				district: res.result.address_component.district,
				street: res.result.address_component.street + res.result.address_component.street_number,
				location: location
			};
			return result;
		} else {
			uni.showToast({
				icon: "none",
				title: `[地图组件]${res.message}`
			});
			return {};
		}
}



/**
 * 失保培训学员状态
 */
export function getTrainClassUserState() {
	return [{
		id: 1,
		text: "待申请",
		color: "#B1B1B1"
	},
	{
		id: 2,
		text: "申请失败",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "待打印",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "已打印",
		color: "#42B983"
	}
	];
}

/**
 * 直播模板类型
 */
export function getLiveTemplateType() {
	return [{
		id: 1,
		text: "视频"
	},
	{
		id: 2,
		text: "视频+聊天"
	},
	// {
	// 	id: 3,
	// 	text: "视频+问答"
	// },
	// {
	// 	id: 4,
	// 	text: "视频+聊天+问答"
	// },
	{
		id: 5,
		text: "视频+文档+聊天"
	},
	// {
	// 	id: 6,
	// 	text: "视频+文档+聊天+问答"
	// }
	];
}


/**
 * 直播章节状态
 */
export function getLiveChapterState() {
	return [{
		id: 1,
		text: "未开始",
		color: "#B1B1B1"
	},
	{
		id: 2,
		text: "直播中",
		color: "#42B983"
	},
	{
		id: 3,
		text: "直播结束",
		color: "#B1B1B1"
	},
	{
		id: 4,
		text: "录播中",
		color: "#FFAE00"
	},
	{
		id: 5,
		text: "录播结束",
		color: "#B1B1B1"
	}
	];
}



/**
 * 考试状态
 */
export function getExamState() {
	return [{
		id: 1,
		text: "草稿",
		color: "#FFAE00"
	}, {
		id: 2,
		text: "未通过",
		color: "#FC703E"
	},
	{
		id: 3,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 4,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 5,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}

/**
 * 试题题型
 */
export function getQuestionType() {
	return [
		{ name: "单选题", value: 1 },
		{ name: "多选题", value: 2 },
		{ name: "判断题", value: 3 },
		{ name: "情景题", value: 4 },
		{ name: "填空题", value: 5 },
		{ name: "问答题", value: 6 }
	]
}

/**
 * 试题困难度
 */
export function getQuestionDifficulty() {
	return [{
		id: 1,
		text: "困难",
		color: "#FC703E"
	}, {
		id: 2,
		text: "中等",
		color: "#FE9131"
	},
	{
		id: 3,
		text: "简单",
		color: "#FFAE00"
	}
	];
}


/**
 * 试题困难度
 */
export function getExamAddressState() {
	return [{
		id: 1,
		text: "未通过",
		color: "#FC703E"
	}, {
		id: 2,
		text: "审核中",
		color: "#FFAE00"
	},
	{
		id: 3,
		text: "发布中",
		color: "#42B983"
	},
	{
		id: 4,
		text: "已关闭",
		color: "#B1B1B1"
	}
	];
}
/**
 * 所属行业
 */
export function getIndustryList(){
	return  [
                {name:"计算机/互联网/通信/电子",value:"计算机/互联网/通信/电子"},
                {name:"会计/金融/银行/保险",value:"会计/金融/银行/保险"},
                {name:"专业服务/教育/培训",value:"专业服务/教育/培训"},
                {name:"贸易/消费/制造/营运",value:"贸易/消费/制造/营运"},
                {name:"房地产/建筑",value:"房地产/建筑"},
                {name:"能源/原材料",value:"能源/原材料"},
                {name:"广告/媒体",value:"广告/媒体"},
                {name:"制药/医疗",value:"制药/医疗"},
                {name:"物流/运输",value:"物流/运输"},
                {name:"服务业",value:"服务业"},
                {name:"政府",value:"政府"},
                {name:"非盈利机构",value:"非盈利机构"},
                {name:"其他行业",value:"其他行业"}];
}

/**
 * 组织性质
 */
export function getNatureList(){
	return  [
	 {name:"私营企业",value:"私营企业"},
	 {name:"外资企业",value:"外资企业"},
	 {name:"国有企业",value:"国有企业"},
	 {name:"民办非企业",value:"民办非企业"},
	 {name:"政府机关",value:"政府机关"},
	 {name:"事业单位",value:"事业单位"},
	 {name:"其它",value:"其它"}];
}

/**
 * 组织规模
 */
export function getScaleList(){
	return  [
	 {name:"50人以内",value:"50人以内"},
	 {name:"51-100人",value:"51-100人"},
	 {name:"101-200人",value:"101-200人"},
	 {name:"201-500人",value:"201-500人"},
	 {name:"501-1000人",value:"501-1000人"},
	 {name:"1001-2000人",value:"1001-2000人"},
	 {name:"2000人以上",value:"2000人以上"}];
}

/**
 * 搜素校验
 * @param {Object} text
 */
export function searchCheck(text,ignoreBlank=true){
	if(ignoreBlank&&isEmpty(text))return true;
	if(/^\d+$/.test(text)){
		if(text.length<6){
			uni.showToast({icon:"none",title:"请输入至少6位号码"});
			return false;
		}
		return true;
	}else{
		if(text.length<2){
			uni.showToast({icon:"none",title:"请输入至少2位字符"});
			return false;
		}
		return true;
	}
}
