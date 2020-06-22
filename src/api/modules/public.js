import getRequest, { apiBase,getBaseUrl } from "../request";

const key_ = "publics";

export default {
	puRq: getRequest(key_),
	
	// 上传文件 
	upload() {
		return getBaseUrl(key_) + "/system/upload";
	},
	/**上传图片
	 * @param {Object} data
	 */
	postUpload(data) {
		let urlBase = getBaseUrl(key_);
		return uni.uploadFile({
			url: urlBase + "/system/upload",
			filePath: data.filePath,
			name: data.name,
			formData: {
				token: uni.getStorageSync("userinfo").token,
				uploadType: data.uploadType,//1：上传头像/LOGO；2：上传封面；3：上传文件；4：上传视频
				path: data.path//用户头像：/user/user/photo；证件照：/user/user/id；企业LOGO：/user/org/logo；营业执照：/user/org/license；文章封面：/article/img
			}
		}).then(([err, res]) => {
			if (err) return Promise.reject(err);
			else {
				let data_ = JSON.parse(res.data);
				if (data_.code != 0) return Promise.reject(`[${data_.code}]${data_.msg}`);
				return Promise.resolve(data_.data);
			}
		});
	},
	/**上传视频
	 * @param {Object} data
	 */
	postUploadVideo(data) {
		let urlBase = getBaseUrl(key_);
		return uni.uploadFile({
			url: urlBase + "/system/upload_video",
			filePath: data.filePath,
			name: data.name,
			formData: {
				token: uni.getStorageSync("userinfo").token,
				path: data.path
			}
		}).then(([err, res]) => {
			if (err) return Promise.reject(err);
			else {
				let data_ = JSON.parse(res.data);
				if (data_.code != 0) return Promise.reject(`[${data_.code}]${data_.msg}`);
				return Promise.resolve(data_.data);
			}
		});
	},

	/**
	 * 管理端文章分类：https://www.eolinker.com/#/home/ams/project/inside/api/detail?apiID=1846073&groupID=-1&projectName=8001%E3%80%90%E5%85%AC%E5%85%B1%E3%80%91PUBLIC&projectHashKey=wEiDAuw1e0d29a2546e5e8687dae0cd95f6b65a5341b0e0&spaceKey=ZCAVMfG5921f3ddc3b7500c2f70162434f819e2dc253747
	 */
	getArticleCategoryListAdmin(data) {
		return this.puRq.get("/article/category_list_admin", data);
	},

	/**
	 * banner列表[管理端]
	 * @param {Object} data
	 */
	getUserBannerList(data) {
		return this.puRq.get("/banner/user/banner_list", data);
	},

	/**
	 * banner列表[管理端]
	 * @param {Object} data
	 */
	getBannerList(data) {
		return this.puRq.get("/banner/banner_list", data);
	},

	/**
	 * 创建banner
	 * @param {Object} data
	 */
	postCreateBanner(data) {
		return this.puRq.post("/banner/create_banner", data);
	},

	/**
	 * 修改banner
	 * @param {Object} data 
	 */
	postUpdateBanner(data) {
		return this.puRq.post("/banner/update_banner", data);
	},
	/**
	 * 删除banner
	 * @param {Object} bannerId
	 */
	postDeletBanner(bannerId) {
		return this.puRq.post("/banner/delete_banner", { bannerId });
	},


	/**
	 * 管理端课程分类：https://www.eolinker.com/#/home/ams/project/inside/api/detail?apiID=1846073&groupID=-1&projectName=8001%E3%80%90%E5%85%AC%E5%85%B1%E3%80%91PUBLIC&projectHashKey=wEiDAuw1e0d29a2546e5e8687dae0cd95f6b65a5341b0e0&spaceKey=ZCAVMfG5921f3ddc3b7500c2f70162434f819e2dc253747
	 */
	getCourseCategoryListAdmin(data) {
		return this.puRq.get("/course/category_list_admin", data);
	},
	/**
	 * 管理端培训分类：https://www.eolinker.com/#/home/ams/project/inside/api/detail?apiID=1846073&groupID=-1&projectName=8001%E3%80%90%E5%85%AC%E5%85%B1%E3%80%91PUBLIC&projectHashKey=wEiDAuw1e0d29a2546e5e8687dae0cd95f6b65a5341b0e0&spaceKey=ZCAVMfG5921f3ddc3b7500c2f70162434f819e2dc253747
	 * @param {Object} data {orgId}
	 */
	getTrainCategoryListAdmin(data) {
		return this.puRq.get("/train/category_list_admin", data);
	},
	/**
	 * 管理端直播分类：https://www.eolinker.com/#/home/ams/project/inside/api/detail?apiID=1846073&groupID=-1&projectName=8001%E3%80%90%E5%85%AC%E5%85%B1%E3%80%91PUBLIC&projectHashKey=wEiDAuw1e0d29a2546e5e8687dae0cd95f6b65a5341b0e0&spaceKey=ZCAVMfG5921f3ddc3b7500c2f70162434f819e2dc253747
	 * @param {Object} data {orgId}
	 */
	getLiveCategoryListAdmin(data) {
		return this.puRq.get("/live/category_list_admin", data);
	},

	/**
	 * 管理端直考试分类：https://www.eolinker.com/#/home/ams/project/inside/api/detail?apiID=1846073&groupID=-1&projectName=8001%E3%80%90%E5%85%AC%E5%85%B1%E3%80%91PUBLIC&projectHashKey=wEiDAuw1e0d29a2546e5e8687dae0cd95f6b65a5341b0e0&spaceKey=ZCAVMfG5921f3ddc3b7500c2f70162434f819e2dc253747
	 * @param {Object} data {orgId}
	 */
	getExamCategoryListAdmin(data) {
		return this.puRq.get("/exam/category_list_admin", data);
	},

	/**
	 * 验证码登录
	 */
	sendAuthCode() {
		return this.puRq.post("/sms/send_authCode");
	},

	// 验证码登录用户
    sendAuthCodeUser(data) {
        return this.puRq.post("/sms/send_authCode", data);
    },

	/**
	 * 培训班级列表（管理端）
	 * @param {Object} data
	 */
	getTrainClassListAdmin(data) {
		return this.puRq.get("/trainclass/train_class_list_admin", data);
	},

	/**
	 * 证书申请列表（管理端）
	 * @param {Object} data
	 */
	getTrainClassApplyListAdmin(data) {
		return this.puRq.get("/trainclass/train_class_apply_list_admin", data);
	},
	/**
	 * 证书打印列表（管理端）
	 * @param {Object} data
	 */
	getTrainClassPrintListAdmin(data) {
		return this.puRq.get("/trainclass/train_class_print_list_admin", data);
	},
	/**
	 * 申请考试--返回考试ID
	 * @param {Object} data
	 */
	postApplyExam(data) {
		return this.puRq.post("/trainclass/apply_exam", data);
	},
	/**
	 * 申请补考--返回考试ID
	 * @param {Object} data
	 */
	postApplyRepairExam(data) {
		return this.puRq.post("/trainclass/apply_repair_exam", data);
	},
	/**
	 * 培训班级人员列表（管理端）
	 * @param {Object} data
	 */
	getTrainClassUserListAdmin(data) {
		return this.puRq.get("/trainclass/train_class_user_list_admin", data);
	},

	/**
	 * 申请证书
	 * @param {Object} data
	 */
	postApplyCertificateAdmin(data) {
		return this.puRq.post("/trainclass/apply_certificate_admin", data);
	},

	/**
	 * 打印证书
	 * @param {Object} data
	 */
	postUpdatePrintState(data) {
		return this.puRq.post("/trainclass/update_print_state", data);
	},



	/**
	 * 创建培训分类
	 * @param {Object} data
	 */
	postCreateTrainCategory(data) {
		return this.puRq.post("/train/create_category", data);
	},
	
	/**
	 * 修改培训分类
	 * @param {Object} data
	 */
	postUpdateTrainCategory(data) {
		return this.puRq.post("/train/update_category", data);
	},
	
	/**
	 * 删除培训分类
	 * @param {Object} categoryId
	 */
	postDeleteTrainCategory(categoryId) {
		return this.puRq.post("/train/delete_category", { categoryId });
	},


	/**
	 * 创建课程分类
	 * @param {Object} data
	 */
	postCreateCourseCategory(data) {
		return this.puRq.post("/course/create_category", data);
	},
	
	/**
	 * 修改课程分类
	 * @param {Object} data
	 */
	postUpdateCourseCategory(data) {
		return this.puRq.post("/course/update_category", data);
	},
	
	/**
	 * 删除课程分类
	 * @param {Object} categoryId
	 */
	postDeleteCourseCategory(categoryId) {
		return this.puRq.post("/course/delete_category", { categoryId });
	},

	/**
	 * 创建文章分类
	 * @param {Object} data
	 */
	postCreateArticleCategory(data) {
		return this.puRq.post("/article/create_category", data);
	},
	
	/**
	 * 修改文章分类
	 * @param {Object} data
	 */
	postUpdateArticleCategory(data) {
		return this.puRq.post("/article/update_category", data);
	},
	
	/**
	 * 删除文章分类
	 * @param {Object} categoryId
	 */
	postDeleteArticleCategory(categoryId) {
		return this.puRq.post("/article/delete_category", { categoryId });
	},
	/**
	 * 创建直播分类
	 * @param {Object} data
	 */
	postCreateLiveCategory(data) {
		return this.puRq.post("/live/create_category", data);
	},

	/**
	 * 修改直播分类
	 * @param {Object} data
	 */
	postUpdateLiveCategory(data) {
		return this.puRq.post("/live/update_category", data);
	},

	/**
	 * 删除直播分类
	 * @param {Object} categoryId
	 */
	postDeleteLiveCategory(categoryId) {
		return this.puRq.post("/live/delete_category", { categoryId });
	},

	/**
	 * 创建考试分类
	 * @param {Object} data
	 */
	postCreateExamCategory(data) {
		return this.puRq.post("/exam/create_category", data);
	},

	/**
	 * 修改考试分类
	 * @param {Object} data
	 */
	postUpdateExamCategory(data) {
		return this.puRq.post("/exam/update_category", data);
	},

	/**
	 * 删除考试分类
	 * @param {Object} categoryId
	 */
	postDeleteExamCategory(categoryId) {
		return this.puRq.post("/exam/delete_category", { categoryId });
	},

	/**
	 * 常见问题
	 * @param {Object} categoryId
	 */
	problemList(data) {
		return this.puRq.get("/problem/problem_list", data);
	},

	/**
	 * 常见问题详情
	 * @param {Object} categoryId
	 */
	queryProblem(data) {
		return this.puRq.get("/problem/query_problem", data);
	},

	/**
	 * 创建意见
	 * @param {Object} categoryId
	 */
	createOpinion(data) {
		return this.puRq.post("/opinion/create_opinion", data);
	},

	/**
	 * banner上线下线
	 * @param {Object} data
	 */
	onlineOfflineBannerAdmin(data) {
		return this.puRq.post("/banner/online_offline_banner_admin", data);
	},
}
