<template>
	<view class="search-filter">
		<view class="mark" v-show="!markHide" @tap="onMarkClick" @touchmove.stop.prevent="onMove"></view>
		<view class="search-filter-content van-hairline--bottom">
			<!-- 筛选条件 -->
			<view class="search-view" v-show="showFilter && showFilterOfOut">
				<view  class="current-select">
					<view class="current-select-body" @tap="onShowPicker">
						<text class="iconfont iconxialaxuanze"></text>
						<text>{{currentSelect}}</text>
					</view>
					<text v-if="showSearch" class="iconfont iconsousuo search-icon" @tap="onShowSearch"></text>
				</view>
			</view>
			<view class="search-view" v-show="!hideSearch || !showFilterOfOut">
				<view class="search-content">
					<view class="search-input">
						<text class="iconfont iconsousuo search-input-icon" @tap="onSearch"></text>
						<input type="text" v-model="searchText" :placeholder="searchPlaceholder"  @focus="searchInputFocus" @input="onSearchInput" @blur="onSearchBlur" @confirm="onSearchConfirm"/>
					</view>
					<text class="search-text" @tap="onSearch">搜索</text>
				</view>
			</view>
			<view v-show="showPicker">
				<data-picker :showChoose="showChoose" showSearch showResetBtn :buttonTop="true" ref="picker" @onPickerChoose="onPickerChoose" @onReset="onResetFilter" @onClose="onMarkClick" :dataList="dataList"></data-picker>
			</view>
		</view> 
	</view>
</template>

<script>
	import dataPicker from "./dataPicker.vue"
	export default {
		components: {
			dataPicker
		},
		props:{
			dataList:{type:Array,default(){return []}},
			searchPlaceholder:{type:String,default:""},
			value:{type:String,default:""},
			showSearch:{type:Boolean,default:true},//是否在筛选条件中旁显示搜索按钮
			showChoose:{type:Boolean,default:false},//dataPicker显示选择结果
		},
		computed:{
			showFilterOfOut(){return this.dataList.length>0;},//有筛选条件隐藏搜索框
		},
		data() {
			return {
				hideSearch:true,
				markHide:true,
				showFilter:true,//显示筛选条件
				showPicker:false,//dataPicker是否显示
				searchText:undefined,//搜索文本
				currentSelect:undefined,
				inputEventList:[],//input输入框待发送事件
			};
		},
		watch: {
			dataList:{
				handler:function(newValue, oldValue) {
						if(this.$isEmpty(this.currentSelect)){
							let item=this.dataList.find(d=>{
								return d.choose;
							});
							if(item){
								this.currentSelect=item.name;
							}
						}
				},
				immediate:true
			}
		},
		methods:{
			onShowPicker(){
				this.showPicker=true;
				this.$refs.picker.show();
			},
			/**选择改变
			 * @param {Object} obj
			 */
			onPickerChoose(obj){
				this.currentSelect=obj.text;
				this.$emit("onPickerChoose",obj.value);
			},
			/**
			 * 重置筛选
			 */
			onResetFilter(){
				// 重置暂不向上推送onFilterMenuClick事件
				// this.$emit("onFilterMenuClick",{type:this.chooseFilter.type,value:""});
			},
			onSearch(){
				this.$emit("onSearch",this.searchText);
				this.onMarkClick();
			},
			onSearchInput({detail:{value}}){
				this.inputEventList.push((len)=>{
					if(len<this.inputEventList.length)return;
					this.$emit("onSearchInput",value);
					this.inputEventList.length=0;
				});
				setTimeout(()=>{
					let len=this.inputEventList.length;
					if(len>0){
						this.inputEventList[len-1](len);
					}
				},500);
			},
			searchInputFocus(){
				this.markHide=false;
			},
			onSearchBlur({detail:{value}}){
				this.$emit("onSearchBlur",value);
				this.$emit("onSearch",value);
			},
			onSearchConfirm({detail:{value}}){
				this.$emit("onSearchConfirm",value);
				this.$emit("onSearch",value);
			},
			onShowSearch(){
				this.hideSearch=this.markHide=this.showFilter=this.showPicker=false;
			},
			onMarkClick(){
				this.showPicker=false;
				this.markHide=true;
				if(this.showFilterOfOut){
					// 有筛选条件
					this.hideSearch=this.showFilter=this.$isEmpty(this.searchText);
				}
			},
			onMove(){}
		}
	}
</script>

<style scoped lang="scss">
	$height:90upx;
	.search-filter{position: sticky;z-index: 10;
		/* #ifdef H5 */
		top: 0px !important;
		/* #endif */
	}
	.mark{position: fixed;}
	.search-filter-content{position: relative; height:$height;background-color: #FFFFFF;position: relative;}
	.search-view{height: 100%;}
	.search-content,.search-input,.current-select{display: flex;align-items: center;}
	.current-select{
		background: #FFFFFF;
		position:relative; z-index:11;
		height: 88upx;
		&-body{
			 flex-grow: 1;
			 font-size:$font-size-30 ;
			 margin-left:30upx;
			 color:$color-666;
			 .iconxialaxuanze{
				 margin-right: 14upx;
			 }
		}
	}
	.search-content{position: relative;z-index:10 ;}
	.search-icon{width:106upx;height:88upx;line-height: 88upx;background:#FFFFFF;box-shadow:-3upx 0upx 12upx 0upx rgba(0, 0, 0, 0.05);font-size: 32upx;text-align: center;}
	.icongou{font-size: 40upx;display: none;}
	.search-content{height: 100%;padding-left: 20upx;border-bottom: 1upx solid rgba(216,216,216,1);}
	.search-input{width:610upx;height:58upx;background:$color-f2;border-radius:10upx;}
	input{width: 535upx;font-size: 28upx;}
	.search-input-icon{font-size: 34upx;color:#999999;margin:0px 20upx}
	.search-text{font-size:32upx;font-family:PingFang-SC-Medium;font-weight:500;color:#000000;margin-left: 29upx;}
</style>

