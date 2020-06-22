
export default {
	/**
	 * 修改导航栏标题
	 */
	updateNavbarTitle(state, title) {
		uni.setNavigationBarTitle({ title: title });
	},

	/**
	 * 修改用户信息
	 */
	setUserInfo(state, userInfo) {
		state.userInfo = userInfo;
		uni.setStorage({
			data: userInfo,
			key: "userinfo"
		});
	},

	setAppShowData(state, payload) {
		state.appShowData = payload;
	},

	/**
	 * 修改权限菜单列表
	 */
	setMethodTree(state, methodTree) {
		//重组权限
		let powerList = recombination(methodTree)
		let index = {};
		let manage = {};
		["/index"].forEach(k => {
			index[k] = powerList[k];
		});
		["/org", "/user", "/article", "/train", "/live", "/exam", "/work", "/system", "/trainClass"].forEach(k => {
			manage[k] = powerList[k];
		});

		state.methodTree = {
			index,
			manage
		};
	}
}


function recombination(list, power = {}) {
	list.forEach(v => {
		if (v.children && v.children.length > 0) {
			v.children = recombination(v.children);
		} else {
			v.children = {};
		}
		// v.pageUrl为空,表示本身就是按钮一级，靠父级的属性就可判断
		if (v.pageUrl)
			power[v.pageUrl] = v;
	});
	return power;
}
