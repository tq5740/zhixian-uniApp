import getRequest from "../request";

const key_="live";

export default {
	liveRq: getRequest(key_),
	/**
	 * 直播列表（管理端）
	 * @param {Object} data
	 */
	getLiveListAdmin(data){
		return this.liveRq.get("/live/live_list_admin",data);
	},
	
	/**
	 * 【管理端】上线下线直播
	 * @param {Object} data
	 */
	postOnlineOfflineLiveAdmin(data){
		return this.liveRq.post("/live/online_offline_live_admin",data);
	},
	
	/**
	 * 【管理端】逻辑删除直播
	 * @param {Object} data
	 */
	postDelLiveAdmin(data){
		return this.liveRq.post("/live/del_live_admin",data);
	},
	/**
	 * 查询直播（管理端）
	 * @param {Object} liveId
	 */
	getQueryLiveAdmin(liveId){
		return this.liveRq.get("/live/query_live_admin",{liveId});
	},
	
	
	/**
	 * 【管理端】审核直播
	 * @param {Object} data
	 */
	postAuditLiveAdmin(data){
		return this.liveRq.post("/live/audit_live_admin",data);
	},
	
	/**
	 * 直播统计（管理端）
	 * @param {Object} liveId
	 */
	getLiveStatisticsAdmin(liveId){
		return this.liveRq.get("/live/live_statistics_admin",{liveId});
	},
	
	/**
	 * 查询报名列表（管理端）
	 * @param {Object} data
	 */
	getLiveRegListAdmin(data){
		return this.liveRq.get("/reg/live_reg_list_admin",data);
	},
	/**
	 * 观看直播记录列表（管理端）
	 * @param {Object} data
	 */
	getLiveChapterRecordListAdmin(data){
		return this.liveRq.get("/record/live_chapter_record_list_admin",data);
	},
	
	/**
	 * 直播安排列表（管理端）
	 * @param {Object} data
	 */
	getLiveChapterListAdmin(data){
		return this.liveRq.get("/chapter/live_chapter_list_admin",data);
	},
	
	/**
	 * 创建直播安排（管理端）
	 * @param {Object} data
	 */
	postCreateLiveChapterAdmin(data){
		return this.liveRq.post("/chapter/create_live_chapter_admin",data);
	},
	/**
	 * 查询直播安排（管理端）
	 * @param {Object} liveChapterId
	 */
	getQueryLiveChapterAdmin(liveChapterId){
		return this.liveRq.get("/chapter/query_live_chapter_admin",{liveChapterId});
	},
	
	/**
	 * 修改直播安排（管理端）
	 * @param {Object} data
	 */
	postUpdateLiveChapterAdmin(data){
		return this.liveRq.post("/chapter/update_live_chapter_admin",data);
	},
	
	
	/**
	 * 开始/关闭录播（管理端）
	 * @param {Object} data
	 */
	postBeganCloseLiveChapterVideoAdmin(data){
		return this.liveRq.post("/chapter/began_close_live_chapter_video_admin",data);
	},
	
	/**
	 * 章节录播列表（管理端）
	 * @param {Object} liveChapterId
	 */
	getLiveChapterRecordListAdminOfChapter(liveChapterId){
		return this.liveRq.get("/chapter/live_chapter_record_list_admin",{liveChapterId});
	},
	
	/**
	 * 开始录播/下载直播回放（管理端）
	 * @param {Object} data
	 */
	postDownloadLiveChapterAdmin(data){
		return this.liveRq.post("/chapter/download_live_chapter_admin",data);
	},
	
	
	/**
	 * 修改直播报名（管理端）
	 * @param {Object} data
	 */
	postUpdateLiveRegAdmin(data){
		return this.liveRq.post("/reg/update_live_reg_admin",data);
	},
	
	
	/**
	 * 逻辑删除报名（管理端）
	 * @param {Object} liveRegIds
	 */
	postDelLiveRegAdmin(liveRegIds){
		return this.liveRq.post("/reg/del_live_reg_admin",{liveRegIds});
	},
	
	/**
	 * 创建直播报名（管理端）
	 * @param {Object} data
	 */
	postCreateLiveRegAdmin(data){
		return this.liveRq.post("/reg/create_live_reg_admin",data);
	},
	
	/**
	 * 创建直播（管理端）
	 * @param {Object} data
	 */
	postCreateLiveAdmin(data){
		return this.liveRq.post("/live/create_live_admin",data);
	},
	/**
	 * 修改直播（管理端）
	 * @param {Object} data
	 */
	postUpdateLiveAdmin(data){
		return this.liveRq.post("/live/update_live_admin",data);
	},
	
	
	/**
	 * 查询直播（管理端）
	 * @param {Object} liveId
	 */
	getQueryLiveAdmin(liveId){
		return this.liveRq.get("/live/query_live_admin",{liveId});
	},
	
	
	/**
	 * 查询直播配置（管理端）
	 */
	getQueryLiveConfigAdmin(){
		return this.liveRq.get("/config/query_live_config_admin");
	},
	
	/**
	* 【管理端】修改直播配置
	* @param {Object} data
	*/
	postUpdateLiveConfigAdmin(data){
	return this.liveRq.post("/config/update_live_config_admin",data);
	},
	
	/**
	 * 直播回收站列表（管理端）
	 * @param {Object} data
	 */
	getRecycleLiveListAdmin(data){
		return this.liveRq.get("/live/recycle_live_list_admin",data);
	},
	
	
	/**
	 * 恢复直播（管理端）
	 * @param {Object} liveId
	 */
	postRecoverLiveAdmin(liveId){
		return this.liveRq.post("/live/recover_live_admin",{liveId});
	},
	
	
	/**
	 * 物理删除直播（管理端）
	 * @param {Object} liveId
	 */
	postDeleteLiveAdmin(liveId){
		return this.liveRq.post("/live/delete_live_admin",{liveId});
	},

	/**
	 * 直播详情
	 * @param {Object} data
	 */
	getQueryLive(data){
		return this.liveRq.get("/live/query_live", data);
	},

	/**
	 * 获取直播章节
	 * @param {Object} data
	 */
	getLiveChapterList(data){
		return this.liveRq.get("/live/live_chapter_list", data);
	},

	/**
	 * 推荐直播
	 * @param {Object} data
	 */
	isRecommendAdmin(data){
		return this.liveRq.post("/live/is_recommend_admin", data);
	},
}
