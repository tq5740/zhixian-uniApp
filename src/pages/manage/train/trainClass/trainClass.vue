<template>
	<view class="train-class">
		<search-filter searchPlaceholder="请输入培训专业搜索"
		:filterList="filterList" @onFilterMenuClick="onFilterMenuClick" 
		 @onSearch="onSearch"></search-filter>
		<view class="list-content">
			<list-item v-for="(d,i) of dataList"
			 :item="d" :btnList="getBtnList()"
			@onBtnClick="onBtnClick"  @onItemClick="onItemClick"
			 :key="i">
				<template v-slot:content>
					<view class="data-item">
						<view class="top">
							<view class="name uni-ellipsis">
								<text>【{{d.type==1?"技能培训":"创业培训"}}】{{d.trainMajor}}</text>
							</view>
							<view class="address uni-ellipsis">
								<text class="iconfont icondizhi"></text>
								<text>{{d.district}}</text>
							</view>
						</view>
						<view class="center">
							<text>等级：</text><text class="level">{{d.majorLevel}}</text>
							<text>时间段：</text>
							<text space="ensp">{{$formatDate(d.startDate,"YYYY-MM-DD")}} 至 {{$formatDate(d.endDate,"YYYY-MM-DD")}}</text>
						</view>
						<view class="footer">
							<text>创建时间：</text>
							<text>{{$formatDate(d.createTime,"YYYY-MM-DD hh:mm:ss")}}</text>
						</view>
					</view>
				</template>
			</list-item>
		</view>
		<no-data :isNoData="noData"></no-data>
		<view class="statistics" v-show="showFlag">
			<view class="mark" @tap="showFlag=false"></view>
			<view class="statistics-body">
				<view class="statistics-title"><text>统计</text></view>
				<view class="statistics-content">
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.allCounts}}</text>
							<text class="statistics-item-title">总人数</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">0</text>
							<!-- 认证人数目前没有 -->
							<text class="statistics-item-title">认证人数</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.noApplyPrints}}</text>
							<text class="statistics-item-title">待申请人数</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.noPrints}}</text>
							<text class="statistics-item-title">未打印人数</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.yesPrints}}</text>
							<text class="statistics-item-title">已打印人数</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.testRatio*100+"%"}}</text>
							<text class="statistics-item-title">考试合格率</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import puApi from "@/api/modules/public.js"
	
	let getListFn=puApi.getTrainClassListAdmin.bind(puApi);
	let navTitle=`失保培训`;
	let power=undefined;
	export default {
		data() {
			return {
				filterList:[{name:"专业等级",type:"majorLevel",children:[{name:"全部",value:undefined,choose:true},{name:"初级",value:"初级"},{name:"中级",value:"中级"},{name:"高级",value:"高级"}]},
				{name:"培训类型",type:"type",children:[{name:"全部",value:undefined,choose:true},{name:"技能培训",value:1},{name:"创业培训",value:2}]}],
				pageNum: 1,
				pageTotal:2,
				query:undefined,
				majorLevel:undefined,
				type:undefined,
				dataList:[],
				chooseItem:{},
				showFlag:false
			}
		},
		onLoad() {
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		onShow() {
			this.$updateNavbarTitle(navTitle);
		},
		methods: {
			/**
			 * 请求列表
			 */
			async getList(restart = false) {
				if(!power){
					power=await this._getPower();
				}
				this._getListFromServer(getListFn,restart,["query","majorLevel","type"]).then(total=>{
					if(typeof total == "number"){
						navTitle=`失保培训(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				let btnList=[{text:`申请考试`,icon:'iconshenqingkaoshi',key:'kaoshi'},{text:`学员`,icon:'iconbaomingyonghu',key:'xueyuan'}];
				if(power.isStatistics){
					btnList.push({text:`统计`,icon:'icontongji',key:'tongji'});
				}
				return btnList;
			},
			onBtnClick({btn:{key},item}){
				this.chooseItem=item;
				if(key=="tongji"){
					this.showFlag=true;
				}else if(key=="kaoshi"){
					uni.navigateTo({
						url:`/pages/manage/train/trainClass/applyExam?orgId=${item.orgId}&classId=${item.classId}`
					})
				}else if(key=="xueyuan"){
					uni.navigateTo({
						url:`/pages/manage/train/trainClass/user?classId=${item.classId}`
					})
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/train/trainClass/classDetail?tClass=${JSON.stringify(item)}`
				})
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
	.data-item{
		padding:25upx 20upx;
		background:#FFFFFF;
		.top{
			font-size: $font-size-30;font-weight:bold;
			display:flex;justify-content:space-between;
			margin-bottom: 30upx;
			.name{
				max-width: 574upx;
				position: relative;
				left: -16upx;
			}
			.address{
				font-size: $font-size-24;color:$color-999;background: $color-f2;
				padding: 0px 10upx;
				height: 38upx;line-height: 38upx;
				font-weight: normal;
				border-radius:50upx;
				.iconfont{font-size: $font-size-24;color:#b1b1b1;margin-right: 4upx;}
			}
		}
		.center{
			font-size: $font-size-24;color: $color-666;
			margin-bottom: 24upx;
			.level{
				color: #6D9985;margin-right: 29upx;
			}
		}
		.footer{
			font-size: $font-size-24;color: $color-999;
		}
	}
	
	.mark{position: fixed;z-index: 11; }
	.statistics{
		&-body{
			width: 100%;
			height: 450upx;background: #FFFFFF; position: fixed; bottom:0px;
			z-index: 11;
		}
		&-title{
			$h:87upx;
			height: $h;line-height: $h;text-align: center;font-size: $font-size-30;color: $color-666;
		}
		&-row{position: relative;width: 100%;display: flex;}
		&-item{
			position: relative;
			width: 250upx;height: 180upx;
			display:flex; flex-direction: column;  justify-content: center; align-items: center;
			&-title{font-size: $font-size-24;color: #333333;margin-top: 25upx;}
			&-text{font-size: $font-size-36;color: #6D9985;}
		}
	}
</style>
