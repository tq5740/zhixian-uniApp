<template>
	<view class="page-full">
		<search-filter searchPlaceholder="请输入试题标题搜索" 
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list">
			<template v-for="(d,i) of dataList" >
				<list-item :item="d" 
					@onBtnClick="onBtnClick" :showFooter="!batchDelete" :key="i">
					<template v-slot:content>
						<view class="list-item-conten">
							<view class="user"  @tap="onItemClick(d)">
								<list-item-question :type="d.type" :title="d.examQuestionTitle" :difficulty="batchDelete?-1:d.diffculty"
								:point="d.examPointTitle | deleteNull"></list-item-question>
							</view>
								<view class="selecticon" v-show="batchDelete" @tap="chooseDelete(d)">
									<text class="iconfont iconweixuanzhong" v-show="!d.willDelete"></text>
									<text class="iconfont iconxuanzhong" v-show="d.willDelete"></text>
								</view>
							</view>
					</template>
				</list-item>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<view v-if="batchDelete" class="create-btn">
			<view class="delete" @tap="cancelDelete">
				<text>取消</text>
			</view>
			<view class="confirm-delete" @tap="confirmDelete">
				<text>确定删除</text>
			</view>
		</view>
		<view v-else class="create-btn">
			<view class="delete" @tap="batchDelete=true">
				<text class="iconfont iconshanchu"></text>
				<text>批量删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	import listItemQuestion from "@/components/listItemQuestion.vue"
	import examApi from "@/api/modules/exam.js"
	import {getQuestionType,getQuestionDifficulty } from "@/utils/utils.js"
	let getListFn=examApi.getExamQuestionListAdmin.bind(examApi);
	export default {
		components: {
			listItemQuestion
		},
		data() {
			let typeList=getQuestionType().concat([]);
			typeList.unshift({name:"全部",value:undefined,choose:true});
			let diffcultyList=[{name:"全部",value:undefined,choose:true}];
			getQuestionDifficulty().forEach(v=>{
				diffcultyList.push({name:v.text,value:v.id});
			});
			let filterList=[{name:"试题题型",type:"type",children:typeList},{name:"困难度",type:"diffculty",children:diffcultyList}];
			return {
				filterList:filterList,
				examBankId:undefined,
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				type:undefined,
				diffculty:undefined,
				dataList:[],
				batchDelete:false
			};
		},
		filters: {
			deleteNull: function(value) {
				if(!value)return "";
				return value.replace(/null*/g, "无");
			}
		},
		onLoad({examBankId,title}) {
			this.$updateNavbarTitle(title);
			this.examBankId=examBankId;
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods:{
			/**
			 * 请求列表
			 */
			getList(restart = false) {
				this._getListFromServer(getListFn,restart,["examBankId","query","type","diffculty"]);
			},
			// getBtnList(){
			// 	return [{text:"删除",icon:"iconshanchu"}];
			// },
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/exam/bank/questionDetail?examQuestionId=${item.examQuestionId}`
				})
			},
			onBtnClick({btn:{text},item}){
				if(text=="删除"){
					this.$refs.msg.show(`删除后该试题将不能参与组卷，是否删除？`,item.examBankQuestionId);
				}
			},
			chooseDelete(item){
				this.$set(item,"willDelete",!item.willDelete);
			},
			cancelDelete(){
				this.dataList.forEach(v=>{
					if(v.willDelete){
						this.$set(v,"willDelete",false);
					}
				});
				this.batchDelete=false;
			},
			confirmDelete(){
				let userIds=[];
				this.dataList.forEach(v=>{
					if(v.willDelete){
						userIds.push(v.examBankQuestionId);
					}
				});
				if(userIds.length==0){
					this.$toast("请选择要删除的试题");return;
				}
				this.$refs.msg.show(`删除后选中试题将不能参与组卷，是否删除？`,userIds.join(","));
				// this.onMsgConfirm(userIds.join(","));
			},
			onMsgConfirm(id){
				let r_=undefined;
				uni.showLoading();
				examApi.postDeleteExamQuestionAdmin({examBankQuestionIds:id}).then(data=>{
					uni.hideLoading();
					this.getList(true);
					this._refreshPrePage();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			onFilterMenuClick(obj) {
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

<style lang="scss" scoped>
	.block{
		margin-bottom: 20upx;
	}
	.page-full{
		padding-bottom: $create-btn-height;
		min-height: calc(100% - #{$create-btn-height});
	}
	
	.create-btn {
		display: flex;
	
		.delete {
			color: #666666;
			position: relative;
		}
	
		.delete::after {
			content: "";
			display: inline-block;
			position: absolute;
			right: 0upx;
			top: calc((#{$create-btn-height} - 38upx) / 2);
			width: 1upx;
			height: 38upx;
			background: #D8D8D8;
		}
	
		.confirm-delete {
			color: #FC703E;
		}
	
		view {
			text-align: center;
			flex-grow: 1;
		}
	}
	
	.list-item-conten {
		display: flex;
		align-items: center;
		width: 100%;
		background: #FFFFFF;
	
		.user {
			flex-grow: 1;
		}
	
		.selecticon {
			padding:0px 30upx;
	
			.iconfont {
				font-size: $font-size-40;
			}
		}
	}
	
</style>
