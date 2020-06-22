import getRequest from "../request";

const key_="exam";

export default {
	examRq: getRequest(key_),
	/**
	 * 考试列表（管理端）
	 * @param {Object} data
	 */
	getExamListAdmin(data){
		return this.examRq.get("/exam/exam_list_admin",data);
	},
	
	/**
	 * 推荐考试（管理端）
	 * @param {Object} data
	 */
	postIsRecommendExamAdmin(data){
		return this.examRq.post("/exam/is_recommend_exam_admin",data);
	},	
	
	/**
	 * 上线下线考试（管理端）
	 * @param {Object} data
	 */
	postOnlineOfflineExamAdmin(data){
		return this.examRq.post("/exam/online_offline_exam_admin",data);
	},
	
	/**
	 * 逻辑删除考试（管理端）
	 * @param {Object} data
	 */
	postDelExamAdmin(data){
		return this.examRq.post("/exam/del_exam_admin",data);
	},
	
	/**
	 * 考试列表（管理端）
	 * @param {Object} examId
	 */
	getQueryExamAdmin(examId){
		return this.examRq.get("/exam/query_exam_admin",{examId});
	},
	
	/**
	 * 审核考试（管理端）
	 * @param {Object} data
	 */
	postAuditExamAdmin(data){
		return this.examRq.post("/exam/audit_exam_admin",data);
	},
	
	/**
	 * 考试统计（管理端）
	 * @param {Object} examId
	 */
	getExamStatisticsAdmin(examId){
		return this.examRq.get("/exam/exam_statistics_admin",{examId});
	},
	
	/**
	 * 考试报名列表（管理端）
	 * @param {Object} data
	 */
	getExamRegListAdmin(data){
		return this.examRq.get("/reg/exam_reg_list_admin",data);
	},
	
	/**
	 * 考试记录（管理端）
	 * @param {Object} data
	 */
	getQueryExamRecordAdmin(data){
		return this.examRq.get("/exam/query_exam_record_admin",data);
	},
	/**
	 * 物理联合表删除考试报名记录,考试记录，答题记录（管理端）
	 * @param {Object} data
	 */
	postdeletExamRegAdmin(data){
		return this.examRq.post("/reg/delete_exam_reg_admin",data);
	},
	/**
	 *创建报名（管理端）
	 * @param {Object} data
	 */
	postCreateExamRegAdmin(data){
		return this.examRq.post("/reg/create_exam_reg_admin",data);
	},
	/**
	 * 题库列表（管理端）
	 * @param {Object} data
	 */
	getQueryExamBankTitleAdmin(data){
		return this.examRq.get("/bank/query_exam_bank_title_admin",data);
	},
	
	/**
	 *创建考试（管理端）
	 * @param {Object} data
	 */
	postCreateExamAdmin(data){
		return this.examRq.post("/exam/create_exam_admin",data);
	},	
	
	/**
	 *修改考试（管理端）
	 * @param {Object} data
	 */
	postUpdateExamAdmin(data){
		return this.examRq.post("/exam/update_exam_admin",data);
	},
	
	/**
	 * 查询考试（管理端）
	 * @param {Object} examId
	 */
	getQueryExamAdmin(examId){
		return this.examRq.get("/exam/query_exam_admin",{examId});
	},
	
	
	/**
	 * 查询题库（管理端）
	 * @param {Object} examBankId
	 */
	getQueryExamBankAdmin(examBankId){
		return this.examRq.get("/exam/query_exam_bank_admin",{examBankId});
	},
	
	/**
	 * 题库列表（管理端）
	 * @param {Object} data
	 */
	getExamBankListAdmin(data){
		return this.examRq.get("/bank/exam_bank_list_admin",data);
	},
	
	
	/**
	 *修改题库（管理端）
	 * @param {Object} data
	 */
	postUpdateExamBankAdmin(data){
		return this.examRq.post("/bank/update_exam_bank_admin",data);
	},
	
	/**
	 * 创建题库（管理端）
	 * @param {Object} data
	 */
	postCreateExamBankAdmin(data){
		return this.examRq.post("/bank/create_exam_bank_admin",data);
	},
	
	/**
	 * 删除题库（管理端）
	 * @param {Object} examBankId
	 */
	postDeleteExamBankAdmin(examBankId){
		return this.examRq.post("/bank/delete_exam_bank_admin",{examBankId});
	},
	
	
	/**
	 * 查询组卷的试题量（管理端）
	 * @param {Object} examBankId
	 */
	getQueryPapersNumberAdmin(examBankId){
		return this.examRq.get("/bank/query_papers_number_admin",{examBankId});
	},
	
	
	/**
	 * 查询组卷策略（管理端）
	 * @param {Object} examBankId
	 */
	getQueryExamTacticsAdmin(examBankId){
		return this.examRq.get("/tactics/query_exam_tactics_admin",{examBankId});
	},
	
	/**
	 *创建/修改组卷策略（管理端）
	 * @param {Object} data
	 */
	postCreateExamTacticsAdmin(data){
		return this.examRq.post("/tactics/create_exam_tactics_admin",data);
	},	
	
	/**
	 * 试题列表（管理端）
	 * @param {Object} data
	 */
	getExamQuestionListAdmin(data){
		return this.examRq.get("/question/exam_question_list_admin",data);
	},
	
	/**
	 * 根据试题id查询试题详细信息（管理端）
	 * @param {Object} examQuestionId
	 */
	getQueryExamQuestionAdmin(examQuestionId){
		return this.examRq.get("/question/query_exam_question_admin",{examQuestionId});
	},
	
	/**
	 * 试卷试题列表（管理端）
	 * @param {Object} data
	 */
	getExamPaperListAdmin(data){
		return this.examRq.get("/papers/exam_paper_list_admin",data);
	},
	/**
	 * 查询知识点列表（管理端）
	 * @param {Object} data
	 */
	getPointListAdmin(data){
		return this.examRq.get("/point/point_list_admin",data);
	},
	/**
	 * 查询知识点列表（管理端）
	 * @param {Object} data
	 */
	getExamPointListAdmin(data){
		return this.examRq.get("/point/exam_point_list_admin",data);
	},
	/**
	 * 创建知识点（管理端）
	 * @param {Object} data
	 */
	postCreateExamPointAdmin(data){
		return this.examRq.post("/point/create_exam_point_admin",data);
	},
	
	/**
	 * 修改知识点（管理端）
	 * @param {Object} data
	 */
	postUpdateExamPointAdmin(data){
		return this.examRq.post("/point/update_exam_point_admin",data);
	},
	/**
	 * 删除知识点（管理端）
	 * @param {Object} examPointId
	 */
	postDeleteExamPointAdmin(examPointId){
		return this.examRq.post("/point/delete_exam_point_admin",{examPointId});
	},
	
	/**
	 * 创建临时试题（管理端）
	 * @param {Object} data
	 */
	postCreateQuestionTemporaryAdmin(data){
		return this.examRq.post("/temporary/create_question_temporary_admin",data);
	},
	
	/**
	 * 修改临时试题（管理端）
	 * @param {Object} data
	 */
	postUpdateQuestionTemporaryAdmin(data){
		return this.examRq.post("/temporary/update_question_temporary_admin",data);
	},
	
	/**
	 * 临时试题列表（管理端）
	 * @param {Object} data
	 */
	getQuestionTemporaryListAdmin(data){
		return this.examRq.get("/temporary/question_temporary_list_admin",data);
	},
	
	/**
	 * 根据试题ID查询临时试题（管理端）
	 * @param {Object} examQuestionTemporaryId
	 */
	getQueryQuestionTemporaryAdmin(examQuestionTemporaryId){
		return this.examRq.get("/temporary/query_question_temporary_admin",{examQuestionTemporaryId});
	},
	
	/**
	 * 物理删除临时试题（管理端）
	 * @param {Object} data
	 */
	postDeleteQuestionTemporaryAdmin(data){
		return this.examRq.post("/temporary/delete_question_temorary_admin",data);
	},
	
	
	/**
	 * 审核临时试题并导入正式题库（管理端）
	 * @param {Object} data
	 */
	postAddQuestionTemporaryAdmin(data){
		return this.examRq.post("/temporary/add_question_temporary_admin",data);
	},
	
	
	/**
	 * 查询考场地址列表（管理端）
	 * @param {Object} data
	 */
	getExamAddressListAdmin(data){
		return this.examRq.get("/address/exam_address_list_admin",data);
	},
	
	/**
	 * 审核考场地址（管理端）
	 * @param {Object} data
	 */
	postAuditExamAddressAdmin(data){
		return this.examRq.post("/address/audit_exam_address_admin",data);
	},
	
	
	/**
	 * 创建考场地址（管理端）
	 * @param {Object} data
	 */
	postCreateExamAddressAdmin(data){
		return this.examRq.post("/address/create_exam_address_admin",data);
	},
	
	
	/**
	 * 修改考场地址（管理端）
	 * @param {Object} data
	 */
	postUpdateExamAddressAdmin(data){
		return this.examRq.post("/address/update_exam_address_admin",data);
	},
	
	/**
	 * 删除知识点（管理端）
	 * @param {Object} examAddressId
	 */
	postDeleteExamAddressAdmin(examAddressId){
		return this.examRq.post("/address/delete_exam_address_admin",{examAddressId});
	},
	
	/**
	 * 查询考试配置（管理端）
	 */
	getQueryExamConfigAdmin(){
		return this.examRq.get("/config/query_exam_config_admin");
	},
	
	
	/**
	 * 修改考试配置（管理端）
	 * @param {Object} data
	 */
	postUpdateExamConfigAdmin(data){
		return this.examRq.post("/config/update_exam_config_admin",data);
	},
	
	/**
	 * 考试回收站（管理端）
	 * @param {Object} data
	 */
	getRecycleExamListAdmin(data){
		return this.examRq.get("/exam/recycle_exam_list_admin",data);
	},
	
	
	/**
	 * 批量恢复考试（管理端）
	 * @param {Object} data
	 */
	postRecoverExamAdmin(data){
		return this.examRq.post("/exam/recover_exam_admin",data);
	},
	
	/**
	 * 物理删除考试（管理端）
	 * @param {Object} data
	 */
	postDeleteExamAdmin(data){
		return this.examRq.post("/exam/delete_exam_admin",data);
	},

	/**
	 * 查询考试
	 * @param {Object} data
	 */
	getQueryExam(data){
		return this.examRq.get("/exam/query_exam",data);
	},
	/**删除正式试题
	 * @param {Object} data
	 */
	postDeleteExamQuestionAdmin(data){
		return this.examRq.post("/question/delete_exam_question_admin",data);
		
	}
	
}

