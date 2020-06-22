import getRequest from "../request";

export default {
	workRq: getRequest("work"),
    /**
     * 管理端首页统计岗位数，就业数，职位数
     */
	getQueryBasicSituationWork() {
		return this.workRq.get("/work/query_basic_situation_work");
	},

	/**职位列表（管理端）
	 * @param {Object} data
	 */
	getWorkListAdmin(data) {
		return this.workRq.get("/work/work_list_admin", data);
	},

	/**
	 * 上线下线职位（管理端）
	 * @param {Object} data
	 */
	postOnlineOfflineWorkAdmin(data) {
		return this.workRq.post("/work/online_offline_work_admin", data);
	},

	/**
	 * 逻辑删除职位（管理端）
	 * @param {Object} data
	 */
	postDelWorkAdmin(data) {
		return this.workRq.post("/work/del_work_admin", data);
	},

	/**
	 * 审核职位（管理端）
	 * @param {Object} data
	 */
	postAuditWorkAdmin(data) {
		return this.workRq.post("/work/audit_work_admin", data);
	},


	/**
	 * 预约(投递)列表（管理端）
	 * @param {Object} data
	 */
	getBookingListAdmin(data) {
		return this.workRq.get("/booking/booking_list_admin", data);
	},

	/**
	 * 工作地点列表（管理端）	
	 * @param {Object} data
	 */
	getAddressListAdmin(data) {
		return this.workRq.get("/address/address_list_admin", data);
	},

	/**
	 * 创建工作地点【管理站】	
	 * @param {Object} data
	 */
	postCreateAddressAdmin(data) {
		return this.workRq.post("/address/create_address_admin", data);
	},

	/**
	 * 修改工作地点（管理端）
	 * @param {Object} data
	 */
	postUpdateAddressAdmin(data) {
		return this.workRq.post("/address/update_address_admin", data);
	},

	/**
	 * 删除工作地点（管理端）
	 * @param {Object} addressId
	 */
	postDeleteAddressAdmin(addressId) {
		return this.workRq.post("/address/delete_address_admin", { addressId });
	},

	/**
	 * 查询已删除的职位（管理端）
	 * @param {Object} data
	 */
	getRecycleWorkListAdmin(data) {
		return this.workRq.get("/work/recycle_work_list_admin", data);
	},

	/**
	 * 物理删除职位（管理端）
	 * @param {Object} addressId
	 */
	postDeleteWorkAdmin(workId) {
		return this.workRq.post("/work/delete_work_admin", { workId });
	},

	/**
	 * 恢复职位（管理端）
	 * @param {Object} addressId
	 */
	postRecoverWorkAdmin(workId) {
		return this.workRq.post("/work/recover_work_admin", { workId, isDel: 0 });
	},

	/**
	 * 招聘会列表（管理端）
	 * @param {Object} data
	 */
	getVenueListAdmin(data) {
		return this.workRq.get("/venue/venue_list_admin", data);
	},


	/**
	 * 上线下线招聘会（管理端）
	 * @param {Object} data
	 */
	postOnlineOfflineVenueAdmin(data) {
		return this.workRq.post("/venue/online_offline_admin", data);
	},

	/**
	 * 逻辑删除招聘会（管理端）
	 * @param {Object} venueId
	 */
	postDelVenueAdmin(venueId) {
		return this.workRq.post("/venue/del_venue_admin", { venueId });
	},

	/**
	 * 修改招聘会（管理端）
	 * @param {Object} data
	 */
	postUpdateVenueAdmin(data) {
		return this.workRq.post("/venue/update_venue_admin", data);
	},

	/**
	 * 查询招聘会（管理端）
	 * @param {Object} venueId
	 */
	getQueryenueAdmin(venueId) {
		return this.workRq.get("/venue/query_venue_admin", { venueId });
	},
	/**
	 * 创建招聘会（管理端）
	 * @param {Object} data
	 */
	postCreateVenueAdmin(data) {
		return this.workRq.post("/venue/create_venue_admin", data);
	},

	/**
	 * 审核招聘会（管理端）
	 * @param {Object} data
	 */
	postAuditVenueAdmin(data) {
		return this.workRq.post("/venue/audit_venue_admin", data);
	},

	/**
	 * 招聘会组织添加职位（管理端）
	 * @param {Object} data
	 */
	postCreateVenueWorkAdmin(data) {
		return this.workRq.post("/venue/create_venue_work_admin", data);
	},


	/**
	 * 职能树（用户端）
	 * @param {Object} data
	 */
	getWorkCategoryTree() {
		return this.workRq.get("/work_category/work_category_tree");
	},


	/**
	 * 创建职位（管理端）
	 * @param {Object} data
	 */
	postCreateWorkAdmin(data) {
		return this.workRq.post("/work/create_work_admin", data);
	},


	/**
	 * 修改职位（管理端）
	 * @param {Object} data
	 */
	postUpdateWorkAdmin(data) {
		return this.workRq.post("/work/update_work_admin", data);
	},

	/**
	 * 查询职位（管理端）
	 * @param {Object} workId
	 */
	getQueryWorkAdmin(workId) {
		return this.workRq.get("/work/query_work_admin", { workId });
	},

	/**
	 * 获取我的地址
	 * @param {Object} workId
	 */
	getMyAddress(data) {
		return this.workRq.get("/address/address_list", data);
	},
	/**
	 * 职位列表（用户端）
	 * @param {Object} workId
	 */
	getWorkList(data) {
		return this.workRq.get("/work/work_list", data);
	},
	/**
	 * 职位详情（用户端）
	 * @param {Object} data
	 */
	getWorkDetail(data) {
		return this.workRq.get("/work/query_work", data);
	},
	/**
	 * 招聘会详情
	 * @param {Object} data
	 */
	getQueryVenue(data) {
		return this.workRq.get("/venue/query_venue", data);
	}

	,
	/**
	 * 求职意向
	 * @param {Object} data
	 */
	getQueryIntention(data) {
		return this.workRq.get("/intention/query_intention", data);
	}

	,
	/**
	 * 修改简历状态
	 * @param {Object} data
	 */
	updateBooking(data) {
		return this.workRq.post("/booking/update_booking_admin", data);
	}

	,
	/**
	 * 推荐招聘会
	 * @param {Object} data
	 */
	isRecommendAdmin(data) {
		return this.workRq.post("/venue/is_recommend_admin", data);
	}



}