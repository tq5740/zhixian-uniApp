let Fly
import qs from "qs"
// #ifdef H5
Fly = require("flyio/dist/npm/fly");
// #endif

// #ifdef MP-WEIXIN
Fly = require("flyio/dist/npm/wx");
// #endif

// {
//     "publics": "http://192.168.10.16:8001/",
//     "user": "http://192.168.10.16:8002/",
//     "permission": "http://192.168.10.16:8003/",
//     "article": "http://192.168.10.16:8004/",
//     "train": "http://192.168.10.16:8005/",
//     "live": "http://192.168.10.15:8006/",
//     "exam": "http://192.168.10.15:8007/",
//     "advert": "http://192.168.10.16:8009/",
//     "work": "http://192.168.10.15:8010/"
// }

import apiBase from "./apiip.json"
import { CLIENT_RENEG_WINDOW } from "tls";
import store from "@/store/index.js"

let map = new Map();

// // h5测试打包
// let port =  {
// 		"publics": "//10.3.1.21:8001/publics",
// 		"user": "//10.3.1.21:8002/user",
// 		"permission": "//10.3.1.21:8003/permission",
// 		"article": "//10.3.1.21:8004/article",
// 		"train": "//10.3.1.21:8005/train",
// 		"work": "//10.3.1.21:8010/work",
// 		"exam": "//10.3.1.21:8007/exam",
// 		"advert": "//10.3.1.21:8009/advert",
// 		"live": "//10.3.1.21:8006/live",
// 		"eval": "//10.3.1.21:8008/eval"
// 	}
	

function getBaseUrl(key){
	let dev = process.env.NODE_ENV === 'development';
	let apis = dev ? apiBase.test : apiBase.prod;
	// #ifdef H5
	return  dev ? apis[key] : location.protocol + apis[key];
	// #endif
	// #ifdef MP-WEIXIN
	return  dev ?  apis[key] : "https:"+apis[key];
	// #endif
}

function createRequest() {
	let dev = process.env.NODE_ENV === 'development';
	let apis = dev ? apiBase.test : apiBase.prod;
	for (let key in apis) {
		let fly = new Fly;
		fly.config.baseURL=getBaseUrl(key);
		fly.myLock = false;//锁标识
		map.set(key, fly);
	}
}
function initRequest() {
	for (let [key, fly] of map) {

		// 拦截
		fly.interceptors.request.use((config) => {
			//    config: {
			//         baseURL,  //请求的基地址
			//         body, //请求的参数
			//         headers, //自定义的请求头
			//         method, // 请求方法
			//         timeout, //本次请求的超时时间
			//         url, // 本次请求的地址
			//         withCredentials, //跨域请求是否发送第三方cookie
			//         ... //options中自定义的属性
			//       }
			if (config.method == "POST") {
				config.headers["Content-Type"] = "application/x-www-form-urlencoded";
			}else if (config.method == "GET") {
				config.headers["Content-Type"] = "multipart/form-data";
			}
			if (!config.body)
				config.body = {};
			// 检查TOKEN
			if (config.url != "/user/user_login" && config.url != "/user/get_userByToken") {
				let u = store.state.userInfo;
				if (u) {
					config.body.token = u.token;
					config.body.siteHierarchy = u.hierarchy;
				}
			} else {
				for (let f of map.values()) {
					//锁定当前实例，后续请求会在拦截器外排队
					f.lock();
					f.myLock = true;
				}
			}
			return config;
		});

		fly.interceptors.response.use(
			({ data ,request}) => {
				// 正常情况下，登录和根据token获取用户信息会进行加锁(对所有实例),其它fly实例是不会有请求进入拦截器的
				// 延迟是为了处理登录成功后的信息存储
				if (fly.myLock) {
					setTimeout(() => {
						for (let f of map.values()) {
							if (f.myLock) {
								f.unlock();
								f.myLock = false;
							}
						}
					}, 500);
				}
				// res:{
				//     data, //服务器返回的数据
				//     engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
				//     headers, //响应头信息
				//     request  //本次响应对应的请求信息，即上面的request结构
				//   }
				if (data.code != 0) {
					setTimeout(()=>{
						uni.showToast({ title: data.msg, icon: "none", duration: 2000 });
					},0);
					if (data.code == 401) {
						// 当前页为登录页，不跳转
						let pages = getCurrentPages();
						if(pages[0]&&pages[0].route=="pages/login/index"){
							return Promise.reject(data.code);
						}else{
							toLogin();
						}
					}
					return Promise.reject(data.code);
				}
				return data.data;
			},
			(err) => {
				if (fly.myLock) {
					for (let f of map.values()) {
						if (f.myLock) {
							f.unlock();
							f.myLock = false;
							console.log("解锁");
						}
					}
				}
				console.log(err);
				setTimeout(()=>{
					uni.showToast({ title: err.message, icon: "none", duration: 2000 });
				},0);
				return Promise.reject(err.message);
			});
	}
}
createRequest();
initRequest();
function getRequest(baseKey) {
	return map.get(baseKey);
}

/**节流,防止接口并发出现401重定向至登录页**/
function debounce (wait=1000){
	let lastTime=Date.now();
	let timeId=null;
	return function(){
		let now=Date.now();
		if(timeId||now-lastTime<wait){
			clearTimeout(timeId);
			console.log("clearTimeout===========");
		}
		timeId=setTimeout(()=>{
			store.commit("setUserInfo", null);
			uni.removeStorageSync('user_token');
			uni.navigateTo({ url: '/pages/login/index' });
			console.log("toLogin===========");
			timeId=null;
		},wait);
		lastTime=now;
	}
}
let toLogin=debounce(2000);



export { getRequest as default, apiBase,getBaseUrl };