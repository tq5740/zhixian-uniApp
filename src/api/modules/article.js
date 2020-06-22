import getRequest from "../request";

export default{
    aRq:getRequest("article"),
    /**
     * 文章列表【管理站】
     */
    getArticleListAdmin(data){
        return this.aRq.get("/article_list_admin",data);
    },
	
	 /**
	 * 文章上线下线【管理站】
	 */
	postOnOffAdmin(data){
	    return this.aRq.post("/on_off_admin",data);
	},
	 /**
	 *推荐文章【管理站】
	 */
	postRecommendArticleAdmin(data){
	    return this.aRq.post("/recommend_article_admin",data);
	},
	 /**
	 * 查询文章【管理站】
	 */
	getQueryArticleAdmin(articleId){
	    return this.aRq.get("/query_article_admin",{articleId});
	},
	 /**
	 * 审核文章【管理站】
	 */
	postAuditArticleAdmin(data){
	    return this.aRq.post("/audit_article_admin",data);
	},
	
	/**
	 * 逻辑删除文章【管理站】
	 */
	postDelArticleAdmin(data){
	    return this.aRq.post("/del_article_admin",data);
	},
	
	/**
	 * 文章报名列表【管理站】
	 */
	getArticleRegListAdmin(data){
	    return this.aRq.get("/articleReg_list_admin",data);
	},
	
	/**
	 * 物理删除文章报名【管理站】
	 */
	postDeleteArticleRegAdmin(data){
	    return this.aRq.post("/delete_articleReg_admin",data);
	},
	
	/**
	 * 审核文章报名【管理站】
	 */
	postAuditArticleRegAdmin(data){
	    return this.aRq.post("/audit_articleReg_admin",data);
	},
	
	/**
	 * 文章回收站
	 */
	getRecycleArticleListAdmin(data){
	    return this.aRq.get("/recycle_article_list_admin",data);
	},
	
	/**
	 * 物理删除文章【管理站】
	 */
	postDeleteArticleAdmin(articleId){
	    return this.aRq.post("/delete_article_admin",{articleId});
	},
   
   /**
    * 恢复已删除文章【管理站】
    */
   postRecoveryArticleAdmin(articleId){
       return this.aRq.post("/rec_article_admin",{articleId});
   },
  
}