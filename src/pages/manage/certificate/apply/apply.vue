<template>
	<view class="train-class">
		<search-filter searchPlaceholder="请输入班级批次号搜索"  @onSearch="onSearch"></search-filter>
		<view class="list-content">
			<list-item v-for="(d,i) of dataList"
			 :item="d" :btnList="getBtnList(d.examId)"
			@onBtnClick="onBtnClick"  @onItemClick="onItemClick"
			 :key="i">
				<template v-slot:content>
					<view class="data-item">
						<view class="top">
							<view class="name uni-ellipsis">
								<text>班级批次号：{{d.classId}}</text>
							</view>
							<view class="address uni-ellipsis">
								<text class="iconfont icondizhi"></text>
								<text>{{d.district}}</text>
							</view>
						</view>
						<view class="center">
							<text>培训专业：</text><text class="level">{{d.trainMajor}}({{d.majorLevel}})</text>
							<text>学员数量：</text><text class="number">{{d.allCounts}}人</text>
						</view>
						<view class="footer">
							<text>时间段：</text>
							<text>{{$formatDate(d.startDate,"YYYY-MM-DD")}} 至 {{$formatDate(d.endDate,"YYYY-MM-DD")}}</text>
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
							<text class="statistics-item-text">{{$getFloat(chooseItem.testRatio*100,2)+"%"}}</text>
							<text class="statistics-item-title">考试标准</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.noApplyPrints}}</text>
							<text class="statistics-item-title">待申请</text>
						</view>
					</view>
					<view class="statistics-row van-hairline--top">
						<view class="statistics-item van-hairline--right">
							<text class="statistics-item-text">{{chooseItem.noApplyPrints}}</text>
							<text class="statistics-item-title">未打印</text>
						</view>
						<view class="statistics-item">
							<text class="statistics-item-text">{{chooseItem.yesPrints}}</text>
							<text class="statistics-item-title">已打印</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import puApi from "@/api/modules/public.js"
	
	let getListFn=puApi.getTrainClassApplyListAdmin.bind(puApi);
	let navTitle=`证书班级`;
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
						navTitle=`证书班级(${total})`;
						this.$updateNavbarTitle(navTitle);
					}
				});
			},
			getBtnList(examId){
				if(!this.power)return;
				let power=this.power;
				let btnList=[{text:`学员`,icon:'iconbaomingyonghu',key:'xueyuan'}];
				if(this.$isEmpty(examId)){
					btnList.unshift({text:`申请考试`,icon:'iconshenqingkaoshi',key:'kaoshi'},)
				}else if(examId.indexOf(",")==-1){
					btnList.unshift({text:`申请补考`,icon:'iconshenqingkaoshi',key:'kaoshi'},)
				}
				
				if(power.isStatistics){
					btnList.push({text:`统计`,icon:'icontongji',key:'tongji'});
				}
				btnList.push({text:`统计`,icon:'icontongji',key:'tongji'});
				return btnList;
			},
			onBtnClick({btn:{key,text},item}){
				this.chooseItem=item;
				if(key=="tongji"){
					this.showFlag=true;
				}else if(key=="kaoshi"){
					let isRepair=text=="申请补考";
					uni.navigateTo({
						url:`/pages/manage/certificate/apply/applyExam?orgId=${item.orgId}&classId=${item.classId}&examId=${item.examId}&endDate=${item.endDate}&isRepair=${isRepair}`
					})
				}else if(key=="xueyuan"){
					uni.navigateTo({
						url:`/pages/manage/certificate/apply/user?classId=${item.classId}&hierarchy=${item.hierarchy}`
					})
				}
			},
			onItemClick(item){
				uni.navigateTo({
					url:`/pages/manage/certificate/apply/classDetail?tClass=${JSON.stringify(item)}`
				})
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
