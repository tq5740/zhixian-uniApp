import getRequest from "../request";

export default {
	perRq: getRequest("permission"),
	
	/**查询菜单树
	 * @param {Object} data
	 */
	getQueryMethodTree(data) {
		return this.perRq.get("/method/query_method_tree", data);
	},

}
