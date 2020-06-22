import getRequest from "../request";

const key_="train";

export default {
	trRq: getRequest(key_),
	/**
	 * 课程列表（管理端）
	 * @param {Object} data
	 */
	getCourseListAdmin(data){
		return this.trRq.get("/course/course_list_admin",data);
	},
	
	/**
	 * 上线下线（管理端）
	 * @param {Object} data
	 */
	postOnlineOfflineCourseAdmin(data){
		return this.trRq.post("/course/online_offline_admin",data);
	},
	/**
	 * 是否推荐（管理端）
	 * @param {Object} data
	 */
	postIsRecommedCourseAdmin(data){
		return this.trRq.post("/course/is_recommend_admin",data);
	},
	/**
	 * 逻辑删除课程（管理端）
	 * @param {Object} data
	 */
	postDelCourseAdmin(data){
		return this.trRq.post("/course/del_course_admin",data);
	},
	
	/**
	 * 审核课程（管理端）
	 * @param {Object} data
	 */
	postAuditCourseAdmin(data){
		return this.trRq.post("/course/audit_course_admin",data);
	},
	
	/**
	 *  查询课程（管理端）
	 * @param {Object} courseId
	 */
	getQueryCourseAdmin(courseId){
		return this.trRq.get("/course/query_course_admin",{courseId});
	},
	
	/**
	 *  查询课程统计（管理端）
	 * @param {Object} courseId
	 */
	getQueryCourseStatisticsAdmin(courseId){
		return this.trRq.get("/course/query_course_statistics_admin",{courseId});
	},
	
	/**
	 *  查询学习课程的人员（管理端）
	 * @param {Object} data
	 */
	getCourseRecordListAdmin(data){
		return this.trRq.get("/course/course_record_list_admin",data);
	},
	
	
	/**
	 *  课程章节记录列表--查看学习详情--第三步（管理端）
	 * @param {Object} data
	 */
	getCourseChapterRecordListAdmin(data){
		return this.trRq.get("/course/course_chapter_record_list_admin",data);
	},
	
	
	/**
	 *  章节列表 /树形结构（管理端）
	 * @param {Object} courseId
	 */
	getCourseChapterListAdmin(courseId){
		return this.trRq.get("/course/course_chapter_list_admin",{courseId});
	},
	
	/**
	 * 创建课程章节（管理端）
	 * @param {Object} data
	 */
	postCreateCourseChapterAdmin(data){
		return this.trRq.post("/course/create_course_chapter_admin",data);
	},
	
	/**
	 * 修改课程章节（管理端）
	 * @param {Object} data
	 */
	postUpdateCourseChapterAdmin(data){
		return this.trRq.post("/course/update_course_chapter_admin",data);
	},
	
	/**
	 *  删除章节（管理端）
	 * @param {Object} data
	 */
	getDeleteCourseChapterAdmin(data){
		return this.trRq.get("/course/delete_course_chapter_admin",data);
	},
	
	/**
	 * 创建课程记录/用户报名记录
	 * @param {Object} data
	 */
	postCreateCourseRecordAdmin(data){
		return this.trRq.post("/course/create_course_record_admin",data);
	},
	
	/**
	 * 删除课程记录
	 * @param {Object} data
	 */
	postDeleteCourseRecordAdmin(data){
		return this.trRq.post("/course/delete_course_record_admin",data);
	},
	
	
	/**
	 *  查询课程（管理端）
	 * @param {Object} courseId
	 */
	getQueryCourseAdmin(courseId){
		return this.trRq.get("/course/query_course_admin",{courseId});
	},
	
	/**
	 * 删除课程记录
	 * @param {Object} data
	 */
	getRecycleCourseListAdmin(data){
		return this.trRq.get("/course/recycle_course_list_admin",data);
	},
	
	/**
	 *  恢复课程（管理端）
	 * @param {Object} courseIds
	 */
	postRecoveryCourseAdmin(courseIds){
		return this.trRq.post("/course/recovery_course_admin",{courseIds});
	},
	
	
	/**
	 *  彻底删除课程（管理端）
	 * @param {Object} courseId
	 */
	postDeleteCourseAdmin(courseId){
		return this.trRq.post("/course/delete_course_admin",{courseId});
	},
	
	
	/**
	 * 培训列表（管理端）
	 * @param {Object} data
	 */
	getTrainListAdmin(data){
		return this.trRq.get("/train/train_list_admin",data);
	},
	
	/**
	 * 是否推荐（管理端）
	 * @param {Object} data
	 */
	postIsRecommedTrainAdmin(data){
		return this.trRq.post("/train/is_recommend_admin",data);
	},
	
	/**
	 * 上线下线（管理端）
	 * @param {Object} data
	 */
	postOnlineOfflineTrainAdmin(data){
		return this.trRq.post("/train/online_offline_admin",data);
	},
	
	
	/**
	 * 逻辑删除培训（管理端）
	 * @param {Object} data
	 */
	postDelTrainAdmin(data){
		return this.trRq.post("/train/del_train_admin",data);
	},
	
	/**
	 *  查询培训（管理端）
	 * @param {Object} trainId
	 */
	getQueryTrainAdmin(trainId){
		return this.trRq.get("/train/query_train_admin",{trainId});
	},
	
	
	/**
	 * 审核培训（管理端）
	 * @param {Object} data
	 */
	postAuditTrainAdmin(data){
		return this.trRq.post("/train/audit_train_admin",data);
	},
	
	/**
	 *  查询培训统计（管理端）
	 * @param {Object} trainId
	 */
	getQueryTrainIdStatisticsAdmin(trainId){
		return this.trRq.get("/train/query_train_statistics_admin",{trainId});
	},
	
	/**
	 * 查询用户报名记录（管理端）
	 * @param {Object} data
	 */
	getTrainRecordListAdmin(data){
		return this.trRq.get("/train/train_record_list_admin",data);
	},
	
	
	/**
	 * 查询用户报名记录（管理端）
	 * @param {Object} data
	 */
	getDetailedTrainRecordAdmin(data){
		return this.trRq.get("/train/detailed_train_record_admin",data);
	},
	/**
	 * 移除用户报名记录
	 * @param {Object} data
	 */
	postDeleteTrainRecordAdmin(data){
		return this.trRq.post("/train/delete_train_record_admin",data);
	},
	
	/**
	 * 添加用户报名记录
	 * @param {Object} data
	 */
	postCreateTrainRecordAdmin(data){
		return this.trRq.post("/train/create_train_record_admin",data);
	},
	
	/**
	 * 查询培训列表
	 * @param {Object} data
	 */
	getTrainResourceListAdmin(data){
		return this.trRq.get("/train/train_resource_list_admin",data);
	},
	
	/**
	 * 移除资源
	 * @param {Object} data
	 */
	postDeleteTrainResourceAdmin(data){
		return this.trRq.post("/train/delete_train_resource_admin",data);
	},
	
	/**
	 * 课程资源列表（培训勾选课程用）
	 * @param {Object} data
	 */
	getCourseListResources(data){
		return this.trRq.get("/course/course_list_resources",data);
	},
	
	/**
	 * 创建资源（管理端）
	 * @param {Object} data
	 */
	postCreateTrainResourceAdmin(data){
		return this.trRq.post("/train/create_train_resource_admin",data);
	},
	
	
	/**
	 * 创建培训（管理端）
	 * @param {Object} data
	 */
	postCreateTrainAdmin(data){
		return this.trRq.post("/train/create_train_admin",data);
	},
	/**
	 * 修改培训（管理端）
	 * @param {Object} data
	 */
	postUpdateTrainAdmin(data){
		return this.trRq.post("/train/update_train_admin",data);
	},
	/**
	 * 培训回收站
	 * @param {Object} data
	 */
	getRecycleTrainListAdmin(data){
		return this.trRq.get("/train/recycle_train_list_admin",data);
	},
	/**
	 * 恢复培训（管理端）
	 * @param {Object} trainIds
	 */
	postRecoveryTrainAdmin(trainIds){
		return this.trRq.post("/train/recovery_train_admin",{trainIds});
	},
	
	/**
	 *  彻底删除培训（管理端）
	 * @param {Object} trainId
	 */
	postDeleteTrainAdmin(trainId){
		return this.trRq.post("/train/delete_train_admin",{trainId});
	},

	/**
	 *  课程详情
	 * @param {Object} data
	 */
	queryCourse(data){
		return this.trRq.get("/course/query_course", data);
	},

	/**
	 *  课程详情目录
	 * @param {Object} data
	 */
	courseCatalog(data){
		return this.trRq.get("/course/course_catalog", data);
	},

	/**
	 *  查询培训
	 * @param {Object} data
	 */
	queryTrain(data){
		return this.trRq.get("/train/query_train", data);
	},

	/**
	 *  查询培训目录
	 * @param {Object} data
	 */
	trainResourceList(data){
		return this.trRq.get("/train/train_resource_list", data);
	},

	/**
	 *  审核培训报名
	 * @param {Object} data
	 */
	auditTrainRecordAdmin(data){
		return this.trRq.post("/train/audit_train_record_admin", data);
	},
	
	
	/**
	 *  培训配置
	 */
	queryTrainConfigAdmin(){
		return this.trRq.get("/train/query_train_config_admin");
	},
	
	/**
	 *  修改培训配置
	 * @param {Object} data
	 */
	updateTrainConfigAdmin(data){
		return this.trRq.post("/train/update_train_config_admin", data);
	},
	
	
}
