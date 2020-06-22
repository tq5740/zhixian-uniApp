let menuTree = {
	index:[{
		name: "首页",
		key: "/index",
		children: [{
			name: "统计", //基本概况
			key: "/index/index",
			url: "/pages/statistics/statistics",
		}]
	}],
	manage:[{
			name: "组织管理",
			key: "/org",
			iconClass: "iconzuzhiguanli",
			children: [{
					iconClass: "iconzuzhiliebiao",
					name: "组织列表",
					key: "/org/org",
					url: "/pages/manage/organization/organization/organization"
				},
				{iconClass:"iconbumenguanli",name:"部门管理",key: "/org/dep",url:"/pages/manage/organization/department/department"},
				{iconClass:"icongangweiguanli",key: "/org/post",name:"岗位管理",url:"/pages/manage/organization/post/post"},
				// {iconClass:"iconqiyezhuce",key: "/org/reg",name:"企业注册",url:"/pages/manage/organization/register/register"}
			]
		},
		{
			name: "用户管理",
			key: "/user",
			iconClass: "iconyuangongguanli",
			children: [{
					iconClass: "iconyuangongliebiao",
					name: "员工列表",
					key: "/user/staff",
					url: "/pages/manage/user/user/user"
				}, {
					iconClass: "iconrenzhengguanli",
					name: "认证管理",
					key: "/user/auth",
					url: "/pages/manage/user/auth/auth"
				},
				{
					iconClass: "iconguanliyuan",
					name: "管理员",
					key: "/user/admin",
					url: "/pages/manage/user/admin/admin"
				}, {
					iconClass: "iconzuijinzhuce",
					name: "最近注册",
					key: "/user/reg",
					url: "/pages/manage/user/latelyregister/latelyregister"
				},
				{
					iconClass: "iconzuijindenglu",
					name: "最近登录",
					key: "/user/login",
					url: "/pages/manage/user/latelylogin/latelylogin"
				}
			]
		},
		{
			name: "文章管理",
			key: "/article",
			iconClass: "iconwenzhangguanli",
			children: [{
					iconClass: "iconwenzhangliebiao",
					name: "文章列表",
					key: "/article/article",
					url: "/pages/manage/article/article/article"
				}, {
					iconClass: "iconbaomingliebiao",
					name: "报名列表",
					key: "/article/reg",
					url: "/pages/manage/article/signup/signup"
				},
				{iconClass:"iconwenzhangfenlei",name:"文章分类",key: "/article/category",url:"/pages/manage/article/category/category"},
				{
					iconClass: "iconhuishouzhan",
					name: "文章回收站",
					key: "/article/recycle",
					url: "/pages/manage/article/recycle/recycle"
				}
			]
		},
		{
			name: "招聘管理",
			key: "/work",
			iconClass: "iconzhaopinguanli",
			children: [{
					iconClass: "iconzhiweiguanli",
					name: "职位管理",
					key: "/work/work",
					url: "/pages/manage/recruit/work/work"
				},
				{
					iconClass: "icontoudijilu",
					name: "投递记录",
					key: "/work/booking",
					url: "/pages/manage/recruit/booking/booking"
				},
				{
					iconClass: "iconxianchangzhaopin",
					name: "现场招聘",
					key: "/work/venue",
					url: "/pages/manage/recruit/venue/venue"
				},
				// {iconClass:"iconzhaopinhuibaomingqiye",name:"招聘会报名企业",key: "/work/venueorg",url:""},{iconClass:"iconrencaisousuo",name:"人才搜索",key: "/work/person",url:""},
				{
					iconClass: "icongongzuodizhi",
					name: "工作地址",
					key: "/work/id",
					url: "/pages/manage/recruit/address/address"
				},
				{
					iconClass: "iconhuishouzhan",
					name: "职位回收站",
					key: "/work/recycle",
					url: "/pages/manage/recruit/recycle/recycle"
				}
			]
		},
		{
			name: "培训管理",
			key: "/train",
			iconClass: "iconpeixunguanli",
			children: [{
					iconClass: "iconkechengliebiao",
					name: "课程列表",
					key: "/train/course",
					url: "/pages/manage/train/course/course"
				},
				{iconClass:"iconkechengfenlei",name:"课程分类",key: "/train/course_category",url:"/pages/manage/train/courseCategory/courseCategory"},
				{
					iconClass: "iconkechenghuishouzhan",
					name: "课程回收站",
					key: "/train/course_recycle",
					url: "/pages/manage/train/courseRecycle/courseRecycle"
				},
				{
					iconClass: "iconpeixunguanlierji",
					name: "培训管理",
					key: "/train/train",
					url: "/pages/manage/train/train/train"
				},
				{iconClass:"iconpeixunfenlei",name:"培训分类",key: "/train/train_category",url:"/pages/manage/train/trainCategory/trainCategory"},
				{
					iconClass: "iconhuishouzhan",
					name: "培训回收站",
					key: "/train/train_recycle",
					url: "/pages/manage/train/trainRecycle/trainRecycle"
				},
				// {
				// 	iconClass: "iconshibaopeixun",
				// 	name: "失保培训",
				// 	key: "/train/train_class",
				// 	url: "/pages/manage/train/trainClass/trainClass"
				// },
				{iconClass:"iconpeixunpeizhi",name:"培训配置",key: "/train/train_config",url:"/pages/manage/train/trainConfig/config"},
			]
		},
		{
			name: "直播管理",
			key: "/live",
			iconClass: "iconzhiboguanli",
			children: [{
					iconClass: "iconzhiboliebiao",
					name: "直播列表",
					key: "/live/live",
					url: "/pages/manage/live/live/live"
				},
				{
					iconClass: "iconzhibofenlei",
					name: "直播分类",
					key: "/live/category",
					url: "/pages/manage/live/category/category"
				},
				{
					iconClass: "iconpeixunpeizhi",
					name: "直播配置",
					key: "/live/config",
					url: "/pages/manage/live/config/config"
				},
				{
					iconClass: "iconhuishouzhan",
					name: "直播回收站",
					key: "/live/recycle",
					url: "/pages/manage/live/recycle/recycle"
				}
			]
		},
		{
			name: "考试管理",
			key: "/exam",
			iconClass: "iconkaoshiguanli",
			children: [{
					iconClass: "iconkaoshiguanli",
					name: "考试管理",
					key: "/exam/exam",
					url: "/pages/manage/exam/exam/exam"
				}, {
					iconClass: "iconshijuanguanli",
					name: "考试分类",
					key: "/exam/category",
					url: "/pages/manage/exam/category/category"
				}, {
					iconClass: "icontikuguanli",
					name: "题库管理",
					key: "/exam/bank",
					url: "/pages/manage/exam/bank/bank"
				}, {
					iconClass: "iconzhishidianguanli",
					name: "知识点管理",
					key: "/exam/point",
					url: "/pages/manage/exam/point/point"
				}, 
				// {
				// 	iconClass: "iconshitiguanli",
				// 	name: "试题管理",
				// 	key: "/exam/temporary_question",
				// 	url: "/pages/manage/exam/temporaryQuestion/temporaryQuestion"
				// }, 
				{
					iconClass: "icongongzuodizhi",
					name: "考场地址列表",
					key: "/exam/address",
					url: "/pages/manage/exam/address/address"
				}, {
					iconClass: "iconkaoshipeizhi",
					name: "考试配置",
					key: "/exam/config",
					url: "/pages/manage/exam/config/config"
				},
				// {
				// 	iconClass: "iconshijuanguanli",
				// 	name: "试卷管理",
				// key: "/exam",
				// 	url: ""
				// },
				{
					iconClass: "iconhuishouzhan",
					name: "考试回收站",
					key: "/exam/recycle",
					url: "/pages/manage/exam/recycle/recycle"
				}
			]
		},
		{
			name: "证书管理",
			key: "/trainClass",
			iconClass: "iconzhengshuguanli",
			children: [{
					iconClass: "iconzhengshushenqing",
					name: "证书申请",
					key: "/trainClass/apply",
					url: "/pages/manage/certificate/apply/apply"
				},
				{
					iconClass: "iconzhengshudayin",
					name: "证书打印",
					key: "/trainClass/print",
					url: "/pages/manage/certificate/print/print"
				}
			]
		},
		{
			name: "系统管理",
			key: "/system",
			iconClass: "iconxitongguanli",
			children: [{
					iconClass: "iconjibenpeizhi",
					name: "基本配置",
					key: "/system/config",
					url: "/pages/manage/system/basic/basic"
				},
				{
					iconClass: "iconbannerliebiao",
					name: "banner列表",
					key: "/system/banner",
					url: "/pages/manage/system/banner/banner"
				}
			]
		}
	]
}
export default menuTree;
