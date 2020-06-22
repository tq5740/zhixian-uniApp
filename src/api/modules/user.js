import getRequest from "../request";
import {
	formatDate
} from "../../utils/utils.js"
import md5 from "../../utils/md5.min.js"

export default {
	userRq: getRequest("user"),
	perRq: getRequest("permission"),
	/**
	 * 用户登录
	 */
	postUserLogin() {
		let user = this.userRq.post("/user/user_login", {
			phone: "15223439743",
			password: md5("abc123456").toUpperCase(),
			device: "1",
			lat: "123.32",
			lng: "24.345"
		});
		return user.then((data) => {
			console.log(data);
			uni.setStorage({
				key: "userinfo",
				data: data
			});
			return Promise.resolve(data);
		}).catch((err) => {
			return Promise.reject(err);
		});
	},
	/**
	 * 基本概况查询用户
	 */
	getQueryBasicSituationUser() {
		return this.userRq.get("/user/query_basic_situation_user");
	},

	/**
	 * 最近登录---首页图表
	 */
	getLatelyLoginUserStatistic(data) {
		return this.userRq.get("/user/lately_login_user_statistic", data);
	},
	/**组织列表
	 * @param {Object} data
	 */
	getOrgList(data) {
		return this.userRq.get("/org/org_list", data);
	},
	/**启用/禁用组织
	 * @param {Object} data
	 */
	postIsForBiddenOrg(data) {
		return this.userRq.post("/org/isforbidden_org", data);
	},
	/**组织详情
	 * @param {Object} orgId 组织id
	 */
	getQueryOrg(orgId) {
		return this.userRq.get("/org/query_org", {
			orgId: orgId
		});
	},
	/**修改组织
	 * @param {Object} data
	 */
	postUpdateOrg(data) {
		return this.userRq.post("/org/update_org", data);
	},
	/**审核组织
	 * @param {Object} data
	 */
	postAuditOrg(data) {
		return this.userRq.post("/org/audit_org", data);
	},
	/**员工列表 ---组织用户
	 * @param {Object} data
	 */
	getOrguserList(data) {
		return this.userRq.get("/user/orguser_list", data);
	},
	/**
	 * 查询部门树
	 */
	getDeptList() {
		return this.userRq.get("/dept/dept_list");
	},
	/**
	 * 查询岗位树
	 */
	getQueryPostTree() {
		return this.userRq.get("/post/query_post_tree");
	},
	
	/**
	 * 修改岗位
	 */
	postUpdatePost(data) {
		return this.userRq.post("/post/update_post",data);
	},
	
	/**
	 * 删除岗位
	 */
	postDeletePost(data) {
		return this.userRq.post("/post/delete_post",data);
	},
	
	/**
	 * 创建岗位
	 */
	postCreatePost(data) {
		return this.userRq.post("/post/create_post",data);
	},
	
	/**
	 * 根据层级查岗位
	 */
	getQueryPostByHierarchy(data) {
		return this.userRq.get("/post/query_post_by_hierarchy", data);
	},
	/**重置密码
	 */
	postResetPwd(userId) {
		return this.userRq.post("/user/reset_password", {
			userId: userId || uni.getStorageSync("userinfo").userId
		});
	},
	/**审核组织用户
	 * @param {Object} data
	 */
	postAuditOrgUser(data) {
		return this.userRq.post("/user/audit_orguser_state", data);
	},

	/**删除用户组织关系
	 * @param {Object} data
	 */
	postDeleteOrgUser(userId) {
		return this.userRq.post("/user/delete_orguser", {
			userId
		});
	},
	/**创建组织用户
	 * @param {Object} data
	 */
	postCreateOrguser(data) {
		return this.userRq.post("/user/create_orguser", data);
	},
	/**修改组织用户
	 * @param {Object} data
	 */
	postUpdateOrguser(data) {
		return this.userRq.post("/user/update_orguser", data);
	},

	/**查询认证列表
	 * @param {Object} data
	 */
	getUserAuthList(data) {
		return this.userRq.get("/userAuth/userauth_list", data);
	},

	/**传入 姓名 身份证 修改认证
	 * @param {Object} data
	 */
	postUpdateUserAuth(data) {
		return this.userRq.post("/userAuth/update_userauth", data);
	},

	/**查询认证用户
	 * @param {String} userId
	 */
	getQueryUserAuth(userId) {
		return this.userRq.get("/userAuth/query_userauth", {
			userId
		});
	},
	/**审核用户认证
	 * @param {Object} data
	 */
	postAuditUserAuthState(data) {
		return this.userRq.post("/userAuth/audit_userauth_state", data);
	},
	/**查询权限内的 部门
	 * @param {Object} data
	 */
	getQueryUserPermissionDept() {
		return this.userRq.get("/dept/query_userPermission_dept");
	},
	
	/**根据用户权限查询用户 创建管理员用
	 * @param {Object} query
	 */
	getQueryUserVague(query) {
		return this.userRq.get("/user/query_user_vague", {
			query
		});
	},
	
	
	/**最近注册列表
	 * @param {Object} data
	 */
	getRecentlyRegList(data) {
		return this.userRq.get("/user/recently_reg_list", data);
	},
	
	/**最近注册重置密码(重置密码为abc123456)
	 * @param {Object} userId
	 */
	postUserResetPassword(userId){
		return this.userRq.post("/user/reset_password", {userId});
	},
	
	/**修改用户状态
	 * @param {Object} data
	 */
	postUpdateUserState(data){
		return this.userRq.post("/user/update_user_state", data);
	},
	
	/**单个用户登录记录
	 * @param {Object} data
	 */
	getUserLoginList(data){
		return this.userRq.get("/user/user_login_list", data);
	},
	/**最近登录列表
	 * @param {Object} data
	 */
	getRecentlyLoginList(data) {
		return this.userRq.get("/user/recently_login_list", data);
	},
	
	   
	/**
	 * 根据用户权限查询组织列表
	 */
	getQueryMyorgList(){
	    return this.userRq.get("/org/query_myorg_list");
	},

	/**
	 * 查询站点
	 * @param {Object} orgId
	 */
	 getOrgsite(orgId){
	    return this.userRq.get("/org/query_orgsite",{orgId});
	},
	
	/**
	 * 修改站点
	 * @param {Object} data
	 */
	postUpdateOrgsite(data) {
		return this.userRq.post("/org/update_orgsite", data);
	},

	// 2019.8.14 登录模块

	/**
	 * 登录
	 * @param {Object} data
	 */
    userLogin(data) {
		return this.userRq.post("/user/user_login", data);
	},

	/**
	 * 获取图片验证码
	 * @param {Object} data
	 */
	imageCode(data) {
		return this.userRq.get("/user/imageCode", data);
	},

	/**
	 * 根据token登录
	 * @param {Object} data
	 */
	getUserByToken(data) {
		return this.userRq.get("/user/get_userByToken", data);
	},

	/**
	 * 用户认证
	 * @param {Object} data
	 */
	oAuth(data) {
		return this.userRq.post("/user/OAuth", data);
	},

	/**
	 * 绑定用户手机号
	 * @param {Object} data
	 */
	bindUserPhone(data) {
		return this.userRq.post("/user/bind_user_phone", data);
	},

	/**
	 * 微信登录手机号解密
	 * @param {Object} data
	 */
	userDecrypt(data) {
		return this.userRq.post("/user/decrypt", data);
	},

	/**
	 * 忘记密码
	 * @param {Object} data
	 */
	forGetPaw(data) {
		return this.userRq.post("/user/forget_password", data);
	},

	/**
	 * 注册
	 * @param {Object} data
	 */
	userReg(data) {
		return this.userRq.post("/user/user_reg", data);
	},
	
	/**管理员用户列表
	 * @param {Object} data
	 */
	getUserAdminstratorList(data) {
		return this.perRq.get("/userAdmin/userAdminstrator_list", data);
	},
	/**查询角色列表
	 * @param {Object} data
	 */
	getRoleList(data) {
		return this.perRq.get("/role/role_list", data);
	},
	/**删除管理员
	 * @param {Object} data
	 */
	postDeleteUserAdminstrator(userId) {
		return this.perRq.post("/userAdmin/delete_userAdminstrator", {
			userId
		});
	},
	/**创建组织管理员
	 * @param {Object} data
	 */
	postCreateUserAdminstrator(data) {
		return this.perRq.post("/userAdmin/create_userAdminstrator", data);
	},
	/**修改管理员用户
	 * @param {Object} data
	 */
	postUpdateUserAdminstrator(data) {
		return this.perRq.post("/userAdmin/update_userAdminstrator", data);
	},

	/**修改用户手机号
	 * @param {Object} data
	 */
	updateUserPhone(data) {
		return this.userRq.post("/user/update_userPhone", data);
	},

	/**修改用户邮箱
	 * @param {Object} data
	 */
	sendEmail(data) {
		return this.userRq.get("/user/send_email", data);
	},

	/**修改用户密码
	 * @param {Object} data
	 */
	updatePassword(data) {
		return this.userRq.post("/user/update_userPassword", data);
	},

	/**微信登录手机号解密
	 * @param {Object} data
	 */
	userDecrypt(data) {
		return this.userRq.post("/user/decrypt", data);
	},

	/**绑定用户手机号
	 * @param {Object} data
	 */
	bindUserPhone(data) {
		return this.userRq.post("/user/bind_user_phone", data);
	},

	/**用户认证
	 * @param {Object} data
	 */
	oAuth(data) {
		return this.userRq.post("/user/OAuth", data);
	},

	/**更新用户信息
	 * @param {Object} data
	 */
	updateUser(data) {
		return this.userRq.post("/user/update_user", data);
	},

	/**获取用户信息
	 * @param {Object} data
	 */
	getQueryUser(data) {
		return this.userRq.get("/user/query_user", data);
	},

	/**获取openID
	 * @param {Object} data
	 */
	getWechatOpenid(data) {
		return this.userRq.get("/wechat/get_wechat_openid", data);
	},

	/**社保认证
	 * @param {Object} data
	 */
	wechatAuth(data) {
		return this.userRq.post("/userAuth/wechat_auth", data);
	},

	/**查询认证状态
	 * @param {Object} data
	 */
	queryUserinfoProgress(data) {
		return this.userRq.get("/edu/query_userinfo_progress", data);
	},

	/**查询认证信息
	 * @param {Object} data
	 */
	queryUserauth(data) {
		return this.userRq.get("/userAuth/query_userauth", data);
	},

	/**查询用户认证
	 * @param {Object} data
	 */
	getUserauth(data) {
		return this.userRq.get("/userAuth/query_orc_userauth", data);
	},

	/**ORC用户认证
	 * @param {Object} data
	 */
	orcUserauth(data) {
		return this.userRq.post("/userAuth/orc_userauth", data);
	},

	/**用户档案
	 * @param {Object} data
	 */
	getUserArchives(data) {
		return this.userRq.get("/edu/query_userinfo_edu_admin", data);
	},

	/**根据经纬度查询地址
	 * @param {Object} data  {lat=30.6894,lng=104.05192}
	 */
	getAddrByLngLat(data) {
		return this.userRq.get("/org/get_addr_lng_lat", data);
	},
    // 查询组织用户(1)
    queryRegByPhone(data) {   
        return this.userRq.get(`/org/query_org_reg_byphone`, data);
    },
	// 创建组织用户(1)
	createOrgReg(data) {
		return this.userRq.post(`/org/create_org_reg`, data);
	},
	// 修改组织用户(1)
	updateOrgReg(data) {
		return this.userRq.post(`/org/update_org_reg`, data);
	},
	
	/**
	 * 身份录入
	 * @param {Object} data
	 */
	postPrintIdcardAuth(data){
		return this.userRq.post("/userAuth/read_idcard_auth",data);
	},
	
	/**
	 * 获取随机号码
	 * @param {Object} data
	 */
	getGeneratePhone(){
		return this.userRq.get("/user/generate_phone");
	},
	
	/**部门列表
	 * @param {Object} data
	 */
	getDeptList(data) {
		return this.userRq.get("/dept/dept_list", data);
	},
	
	/**修改部门
	 * @param {Object} data
	 */
	postUpdateDept(data) {
		return this.userRq.post("/dept/update_dept", data);
	},
	
	/**创建部门
	 * @param {Object} data
	 */
	postCreateDept(data) {
		return this.userRq.post("/dept/create_dept", data);
	},
	
	/**移动部门
	 * @param {Object} data
	 */
	postMoveDept(data) {
		return this.userRq.post("/dept/move_dept", data);
	},
	/**删除部门
	 * @param {Object} data
	 */
	postDeleteDept(data) {
		return this.userRq.post("/dept/delete_dept", data);
	},
	
	/**
	 * 企业注册列表
	 * @param {Object} data
	 */
	getOrgRegListAdmin(data){
		return this.userRq.get("/org/org_reg_list_admin", data);
	},
	
	
	/**
	 * 批量修改用户部门
	 * @param {Object} data
	 */
	postUpdateBatchDept(data){
		return this.userRq.post("/user/update_batch_dept", data);
	},
	/**
	 * 批量修改用户岗位
	 * @param {Object} data
	 */
	postUpdateBatchPost(data){
		return this.userRq.post("/user/update_batch_post", data);
	}
	
	
	
}
