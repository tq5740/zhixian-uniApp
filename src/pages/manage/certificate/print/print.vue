<template>
	<view class="train-class">
		<search-filter searchPlaceholder="请输入班级批次号搜索"  @onSearch="onSearch"></search-filter>
		<view class="list-content">
			<list-item v-for="(d,i) of dataList"
			 :item="d" :btnList="getBtnList()"
			@onBtnClick="onBtnClick"  @onItemClick="onItemClick"
			 :key="i">
				<template v-slot:content>
					<view class="data-item">
						<view class="top">
							<view class="name uni-ellipsis">
								<text>班级批次号：{{d.classId}}</text>
							</view>
							<view class="print">
								<text class="print-no">待打印:{{d.noPrints}}</text>
								<text class="print-yes">已打印:{{d.yesPrints}}</text>
							</view>
						</view>
						<view class="center">
							<text>培训专业：</text><text class="level">{{d.trainMajor}}({{d.majorLevel}})</text>
							<text>学员数量：</text><text class="number">{{d.allCounts}}人</text>
						</view>
						<view class="footer">
							<text>打印时间：</text>
							<text>{{getPrintTime(d.printTime)}}</text>
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
							<text class="statistics-item-title">学员总数</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.testRatio*100+"%"}}</text>
							<text class="statistics-item-title">学习标准</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.studyRatio*100+"%"}}</text>
							<text class="statistics-item-title">考试标准</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.noApplyPrints}}</text>
							<text class="statistics-item-title">待申请</text>
						</view>
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.noPrints}}</text>
							<text class="statistics-item-title">未打印</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.yesPrints}}</text>
							<text class="statistics-item-title">已打印</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.failApply}}</text>
							<text class="statistics-item-title">未通过</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import puApi from "@/api/modules/public.js"
	
	let getListFn=puApi.getTrainClassPrintListAdmin.bind(puApi);
	let navTitle=`证书打印`;
	export default {
		data() {
			return {
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
				if(!this.power){
					this.power=await this._getPower();
				}
				this._getListFromServer(getListFn,restart,["query","majorLevel","type"]).then(total=>{
					if(typeof total == "number"){
						navTitle=`证书打印(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(){
				if(!this.power)return;
				let power=this.power;
				let btnList=[{text:`学员`,icon:'iconbaomingyonghu',key:'xueyuan'}];
				if(power.isStatistics){
					btnList.push({text:`统计`,icon:'icontongji',key:'tongji'});
				}
				btnList.push({text:`统计`,icon:'icontongji',key:'tongji'});
				return btnList;
			},
			onBtnClick({btn:{key},item}){
				this.chooseItem=item;
				if(key=="tongji"){
					this.showFlag=true;
				}else if(key=="kaoshi"){
					uni.navigateTo({
						url:`/pages/manage/certificate/apply/applyExam?orgId=${item.orgId}&classId=${item.classId}&endDate=${item.endDate}`
					})
				}else if(key=="xueyuan"){
					uni.navigateTo({
						url:`/pages/manage/certificate/apply/user?classId=${item.classId}&hierarchy=${item.hierarchy}&print=true&yesPrints=${item.yesPrints}&noPrints=${item.noPrints}`
					})
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/certificate/print/classDetail?tClass=${JSON.stringify(item)}`
				})
			},
			getPrintTime(printTime){
				if(this.$isEmpty(printTime))return "-";
				else return this.$formatDate(printTime,"YYYY-MM-DD hh:mm:ss")
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
			}
			.print{
				text{
					$h:34upx;
					display: inline-block;height: $h;line-height:$h;font-size: 20upx;font-weight: normal;
					color: #FFFFFF;text-align: center;border-radius: 4upx;
					padding: 0upx 6upx;
				}
				&-no{
					background: #E2987D;
				}
				&-yes{
					background: #78BA9C;
					margin-left: 10upx;
				}
			}
			
		}
		.center{
			font-size: $font-size-24;color: $color-666;
			margin-bottom: 24upx;
			.level{
				color: #6D9985;margin-right: 29upx;
			}
			.number{
				color:#FC703E;margin-right: 29upx;
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
			background: #FFFFFF; position: fixed; bottom:0px;
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
