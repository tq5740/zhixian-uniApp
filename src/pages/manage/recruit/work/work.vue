<template>
	<view class="work  page-full" :class="{'create-btn-padding-bottom':canCreate}">
		<search-filter searchPlaceholder="请输入职位名称搜索" 
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearchConfirm="onSearch" @onSearchBlur="onSearch"></search-filter>
		 <view class="list-conten">
			 <template v-for="(d,i) of dataList">
				<list-item :item="d" :btnList='getBtnList(d)'
					@onBtnClick="onBtnClick" @onItemClick="onItemClick" :key="i">
					 <template v-slot:content>
						<list-item-article :name="d.workTitle" :state="d.state | getState" :stateBgColor="d.state | getStateBgColor" 
						:intro="d | getIntro" :introColor="d.state | getIntroColor" :tips="d | getTips" tipsColor="#999999" :globalColor="d.state==5?'#999999':''">
						</list-item-article>
					  </template>
				 </list-item>
			 </template>
		</view>
		<view v-if="canCreate" class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建职位</text>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<delete-modal ref="del" @onDelete="onDelete"></delete-modal>
		<examine-modal ref="examine" @onExamine="onExamine"></examine-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
	import workApi from "@/api/modules/work.js"
	import {formatDate,getWorkState,getWorkEducation,getWorkExperience,getWorkNature} from "@/utils/utils.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	import deleteModal from "@/components/deleteModal.vue"
	import examineModal from "@/components/examineModal.vue"
	
	const stateList=getWorkState();
	const educationList=getWorkEducation();
	const experienceList=getWorkExperience();
	
	let getListFn=workApi.getWorkListAdmin.bind(workApi);
	let navTitle="职位";
	export default {
		components: {
			listItemArticle,examineModal,deleteModal
		},
		data() {
			
			return {
				canCreate:false,
				filterList:[
				{name:"工作性质",type:"workNature",children:[]},
				{name: "职位状态",type:"state",children:[]}],
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				workNature:undefined,
				state:undefined,
				sortField: "updateTime",
				dataList:[],
				chooseWork:undefined
			}
		},
		filters:{
			getState(value){
				return stateList[value-1].text;
			},
			getStateBgColor(value){
				return stateList[value-1].color;
			},
			getIntro: function(item) {
				if(item.state==2){
					return item.reason;	
				}else
					return `招聘人数：${item.recruitNumber}  学历要求：${educationList[item.education]}  经验要求：${experienceList[item.experience]}`;
			},
			getIntroColor: function(state) {
				if(state==2){
					return stateList[state-1].color;;	
				}else
					return "";
			},
			getTips: function(item) {
				return `更新时间：${formatDate(item.updateTime,"YYYY-MM-DD hh:mm:ss")}  浏览量：${item.browseNumber}`;
			},
		},
		onLoad() {
			let stateFilterList=[];
			stateList.forEach(v=>{
				stateFilterList.push({
					name:v.text,
					value:v.id
				})
			});
			const workNatrueList=getWorkNature();
			workNatrueList[0].choose=true;
			stateFilterList.unshift({name:"全部",value:null,choose:true});
			let filterList=[
				{name:"工作性质",type:"workNature",children:workNatrueList},
				{name: "职位状态",type:"state",children:stateFilterList}];
			this.filterList=filterList;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow(refresh) {
			if(refresh)
				this.getList(true,false);
			else
				this.$updateNavbarTitle(navTitle);
		},
		methods: {
			/**
			 * 请求列表
			 */
			async getList(restart = false,rename=true) {
				if(!this.power){
					this.power=await this._getPower();
					this.canCreate=this.power.isCreate;
				} else {
					this.canCreate=this.power.isCreate;
				}
				this._getListFromServer(getListFn,restart,["query","workNature","state","sortField"]).then(total=>{
					if(typeof total == "number"&&rename){
						navTitle=`职位(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(item){
				if(!item||!this.power)return;
				let power=this.power;
				// 草稿、已关闭：发布
				// 未通过、审核中：审核
				// 发布中:关闭
				let zp={text:`已投递`,icon:"iconyitoudi",key:"yitoudi"},ms={text:`待面试`,icon:"icondaimianshi",key:"mianshi"};
				let btnList=[zp,ms];
				// if(power.isQuery){
				// 	// 搜索暂时不做
				// 	let ss={text:`人才搜索`,icon:"iconsousuorencai",key:"sousuo",color:"#999999",disable:true};
				// 	btnList.push(ss);
				// }
				
				if(item.state==2 || item.state==5){
					// 投递、面试、搜索按钮灰色不能点击
					zp.color=ms.color="#999999";
					zp.disable=ms.disable=true;
				}
				if(item.state==4 || item.state==5){
					zp.text=`已投递(${item.bookingNumber})`;
					ms.text=`待面试(${item.interviewNumber})`;
				}
				if(power.isUpdate){
					btnList.unshift({text:`编辑`,icon:"iconbianji",key:"bianji"})
				}
				if(power.isOnline){
					if(item.state==4){
						btnList.push({text:`关闭职位`,icon:"iconguanbi",key:"guanbi"});
					}else if(item.state==5){
						btnList.push({text:`发布职位`,icon:"iconfabu",key:"fabu"});
					}
				}
				if(power.isAudit&&(item.state==2||item.state==3)){
					btnList.push({text:`审核职位`,icon:"iconshenhe",key:"shenhe"})
				}
				// 发布中没有删除
				if(power.isDelete&&item.state!=4){
					btnList.push({text:`删除职位`,icon:"iconshanchu",key:"shanchu"});
				}
				return btnList;
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/detail/workDetail?workId=${item.workId}`
				})
			},
			onBtnClick({btn:{key},item}){
				this.chooseWork=item;
				if("fabu"==key){
					this.$refs.msg.show(`<span>是否发布职位“</span><span style="color: #000;font-weight: bold">${item.workTitle}</span><span>”？</span>`,"fabu");
				}else if("guanbi"==key){
					this.$refs.msg.show(`关闭职位将会把与该职位相关的简历全部标记为不合适，你是否要这样做？`,"guanbi");
				}else if("shanchu"==key){
					this.$refs.del.clear();
					this.$refs.del.show(`删除职位“${item.workTitle}”`);
				}else if("shenhe"==key){
					this.$refs.examine.show(`审核职位“${item.workTitle}”`);
				}else if("mianshi"==key){
					uni.navigateTo({
						url:`/pages/manage/recruit/work/interview?workId=${item.workId}&work=${item.workTitle}`
					})
				}else if("yitoudi"==key){
					uni.navigateTo({
						url:`/pages/manage/recruit/work/booking?bookingNum=${item.bookingNumber}&workId=${item.workId}&work=${item.workTitle}`
					})
				}else if("bianji"==key){
					uni.navigateTo({
						url:`/pages/manage/recruit/work/edit?id=${item.workId}`
					})
				}
			},
			onCreateBtnClick(){
				uni.navigateTo({
					url:`/pages/manage/recruit/work/edit?create=true`
				})
			},
			onDelete(reason){
				workApi.postDelWorkAdmin({workId:this.chooseWork.workId,reason:reason}).then(data=>{
					this.getList(true);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						duration: 2000,
						icon: "none"
					});
				});
			},
			onExamine({pass,reason}){
				workApi.postAuditWorkAdmin({workId:this.chooseWork.workId,state:pass?4:2,reason:reason}).then(data=>{
					this.getList(true);
				}).catch(err => {
					uni.showToast({
						title: err,
						duration: 2000,  
						icon: "none"
					});
				});
			},
			onMsgConfirm(flag){
				let r_=undefined;
				if("fabu"==flag){
					let rqData={
						workId:this.chooseWork.workId,
						state:4
					};
					r_=workApi.postOnlineOfflineWorkAdmin(rqData);
				}else if("guanbi"==flag){
					let rqData={
						workId:this.chooseWork.workId,
						state:5
					};
					r_=workApi.postOnlineOfflineWorkAdmin(rqData);
				}
				if(r_){
					r_.then(data=>{
						this.getList(true);
					}).catch(err => {
						uni.showToast({
							title: err,
							duration: 2000,
							icon: "none"
						});
					});
				}
			},
			onFilterMenuClick(obj) {
				if(this.$isEmpty(obj.type))return;
				if (this[obj.type] != obj.value) {
					this[obj.type] = obj.value;
					this.getList(true);
				}
			},
			/**搜索
			 * @param {Object} value 搜索关键字
			 */
			onSearch(value) {
				if (this.query != value) {
					this.query = value;
					this.getList(true);
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.work{
		min-height: calc(100% - #{$create-btn-height});
	}
</style>
