<template>
	<view class="data-picker">
		<!-- 自定义picker -->
		<template v-if="!mode">
			<view class="mark" v-show="showFlag" @tap="onClose" @touchmove.stop.prevent="onMove"></view>
			<view class="picker-conten" :class="{'hidden':!showFlag,'full-height':showSearch,'picker-conten-fix-height':showTopBtn,'picker-conten-max-height':!buttonTop}">
				<view v-if="showSearch" class="search-content van-hairline--bottom">
					<view class="search-input">
						<text class="iconfont iconsousuo search-input-icon" @tap="onSearch"></text>
						<input type="text" v-model="searchText" :placeholder="searchPlaceholder" />
					</view>
					<text class="search-text" @tap="onSearch">搜索</text>
				</view>
				<!-- 使用搜索就只能使用bottom按钮 -->
				<view v-if="showTopBtn" class="top-btn van-hairline--bottom">
					<text @tap="onReset" class="btn cancle-btn">重置</text>
					<text @tap="onPickerConfirm" class="btn confirm-btn">确定</text>
				</view>
				<scroll-view :scroll-into-view="scrollIntoView" scroll-x v-if="showChoose"  class="choose-list" >
					<block v-for="(c,i) of chooseList" :key="i">
						<text :id="'id'+i" @tap="onChooseClick(i,c)" class="choose-item uni-ellipsis" :class="{'choose-item-show':chooseShowIndex==i}">{{c.name}}</text>
						<text v-if="i != chooseList.length-1" class="choose-item-delimiter iconfont icongengduo"></text>
					</block>
					<view v-show="chooseList.length == 0">
						<text class="choose-item choose-item-placeholder">请选择</text>
					</view>
				</scroll-view>
				<view :class="{'data-list':true,'data-list-height1':dataListHeight==1,'data-list-height2':dataListHeight==2,'data-list-height3':dataListHeight==3,'data-list-height4':dataListHeight==4}">
					<template v-for="(m,i) of showList">
						<view @tap="onItemClick(m)" class="data-item van-hairline--top" :class="{'data-item-choose':m.choose}" :key="i">
							<text>{{m.name}}</text>
							<text class="iconfont icongou" :class="{'data-item-choose-icon':m.choose}"></text>
						</view>
					</template>
				</view>
				<view v-if="!showTopBtn" class="bottom-btn van-hairline--top">
					<text @tap="onClose" class="btn reset-btn-search van-hairline--right" v-if="showSearch">取消</text>
					<text @tap="onReset" class="btn van-hairline--right" :class="{'reset-btn':!showSearch,'reset-btn-search':showSearch}" v-if="showResetBtn">重置</text>
					<text @tap="onPickerConfirm" class="btn confirm-btn" :class="{'confirm-btn':!showSearch,'confirm-btn-search':showSearch}" v-if="!(!showChoose&&!buttonTop)">确定</text>
				</view>
			</view>
		</template>
		<view v-else>
			<template v-if="packType==1">
				<picker ref="picker" :mode="mode" :value="value" :start="start" :end="end" @change="onPickerChange">
					<slot></slot>
				</picker>
			</template>
			<template v-if="packType==2">
				<template v-if="mode=='region'">
					<!-- #ifdef H5 -->
					<view @tap="pickerViewClick">
						<slot></slot>
					</view>
					<w-picker ref="wpicker" @confirm="WPickerConfirm" :mode="mode">
					</w-picker>
					<!-- #endif -->
				</template>
				<template v-else>
					<view @tap="pickerViewClick">
						<slot></slot>
					</view>
					<view class="mark" v-show="showFlag" @tap="onClose" @touchmove.stop.prevent="onMove"> </view>
					<view class="selector-picker" :class="{'show':showFlag}">
						<view class="top-btn van-hairline--bottom">
							<text @tap="onReset" class="btn cancle-btn">取消</text>
							<text @tap="onPickerConfirm" class="btn confirm-btn">确定</text>
						</view>
						<picker-view indicator-style="height: 50px;" @change="onMulPickerChange" :value="mulPickerDefaultVal">
							<template v-if="mulPickerColn==1">
								<picker-view-column>
									<view style="text-align: center;width: 100%;line-height: 50px;" v-for="(v,i) of dataList" :key="i">
										<text>{{v.name}}</text>
									</view>
								</picker-view-column>
							</template>
							<template v-else>
								<picker-view-column v-for="(v,i) of dataList" :key="i">
									<view style="text-align: center;width: 100%;line-height: 50px;" v-for="(vv,j) of v " :key="j">
										<text>{{vv.name}}</text>
									</view>
								</picker-view-column>
							</template>
						</picker-view>
					</view>
				</template>
			</template>
		</view>
	</view>
</template>

<script>
// #ifdef H5
import wPicker from "./w-picker";
// #endif
// !!!!如果要动态更新dataList，需要先置空dataList，然后延迟重置dataList(定时器、$nextTick)
export default {
	// #ifdef H5
	components: {
		wPicker
	},
	// #endif
	props: {
		dataList: {
			type: Array,
			default() { return [] }
		},
		mode: { type: String, default: "" },//mode不为空，使用picker基础组件
		start: { type: String },//mode = date,表示有效时间范围的开始
		end: { type: String },//mode = date时,表示有效时间范围的结束
		value: { type: [String, Number, Array], default: "" },
		showChoose: { type: Boolean, default: true },//显示选择结果
		buttonTop: { type: Boolean, default: false },//按钮位置
		showResetBtn: { type: Boolean, default: false },//是否显示重置按钮
		showSearch: { type: Boolean, default: false },//是否使用搜索
		searchPlaceholder: { type: String, default: "请输入企业名称搜索" },//是否使用搜索
		banEmpty: { type: Boolean, default: true },//是否禁止空选择(未选择不可点击确定)
	},
	computed: {
		showTopBtn(){
			return this.buttonTop&&!this.showSearch;
		},
		dataListHeight(){
			// 显示choose-list和bottom-btn/top-btn
			if(this.showChoose){
				if(this.showSearch){
					return 3;//搜索(全屏)
				}else{
					return 1;
				}
			}else{
				// 不显示choose-list,
				if(this.showSearch){
					return 3;//搜索(全屏)
				}else{
					if(this.buttonTop){
						return 4;//不搜索，显示top-btn
					}else{
						return 2;//不搜索(不全屏)，不显示bottom-btn/top-btn
					}
				}
			}
		}
	},
	data() {
		return {
			showList: [],
			chooseList: [],
			chooseShowIndex: -1,
			lastChoose: false,//选择到最后一层
			showFlag: false,
			packType: -1,//1普通picker，2picker-view
			target: undefined,
			scrollIntoView: undefined,
			mulPickerColn: undefined,
			mulPickerVal: [],
			mulPickerDefaultVal:[],//多选的默认选择
			searchText:"",//搜索关键字
		};
	},
	watch: {
		mode: {
			handler: function (newValue, oldValue) {
				if (newValue) {
					this.showFlag = true;
					if (newValue == "selector") {
						this.showFlag = false;
						this.packType = 2;
						// 处理dataList
						this.mulPickerList = [];
						if (this.dataList) {
							if (this.dataList.length > 0) {
								this.mulPickerColn = this.isArrayFn(this.dataList[0]) ? 2 : 1;
							} else
								this.mulPickerColn = 1;
							setTimeout(()=>{
								if(this.mulPickerColn==1){
									let valI=this.dataList.findIndex(v=>{
										return v.choose;
									});
									if(valI!=-1) this.mulPickerDefaultVal.push(valI);
								}else{
									this.dataList.forEach(v=>{
										let valI=v.findIndex(vv=>{
											return vv.choose;
										});
										if(valI!=-1) this.mulPickerDefaultVal.push(valI);
									})
								}
							},1000);
						}
					}
					else if (newValue == "time" || newValue == "date")
						this.packType = 1;
					else if (newValue == "region") {
						// #ifdef H5
						this.packType = 2;
						// #endif
						// #ifdef MP-WEIXIN
						this.packType = 1;
						// #endif
					}
				}
			},
			immediate: true
		},
		dataList: {
			handler: function (newValue, oldValue) {
				if (this.mode) return;
				// 初始化
				if (!this.showList || this.showList.length == 0) {
					this.showList = newValue;
					this.defaultChoose();
				}
				//dataList更新，如果要动态更新dataList，需要先置空dataList，然后延迟重置dataList(定时器、$nextTick);
				if (!newValue || newValue.length == 0) {
					this.showList = [];//重置showList,为datalist更新做准备
					this.chooseList = [];
					this.lastChoose = false;
				}
			},
			immediate: true
		}
	},
	methods: {
		show(target) {
			this.target = target;
			this.showFlag = true;
		},
		onClose() {
			this.showFlag = false;
			this.$emit("onClose");
		},
		defaultChoose(list) {
			if (!list) {
				list = this.dataList;
			}
			let obj = list.find(v => {
				return v.choose;
			});
			if (obj) {
				this.onItemClick(obj);
				if (obj.children && obj.children.length > 0) {
					this.defaultChoose(obj.children);
				}
			}
		},
		onItemClick(obj) {
			// 展示下级
			if (obj.children && obj.children.length > 0) {
				this.showList = obj.children;
				if (this.lastChoose) {
					this.chooseList.pop().choose = false;//删除最后一个并将其改为未选择
				}
				this.lastChoose = false;
			} else {
				if (this.lastChoose == false) {
					this.lastChoose = true;
				} else {
					this.chooseList.pop().choose = false;//删除最后一个并将其改为未选择
				}
			}
			this.$set(obj, "choose", true);
			this.chooseList.push(obj);
			this.chooseShowIndex = this.chooseList.length - 1;
			this.scrollIntoView = "id" + this.chooseShowIndex;
			if(!this.showChoose&&!this.buttonTop){
				// showChoose=false:一般一级的，buttonTop=false:一般是列表搜索
				this.onPickerConfirm();
			}
		},
		onChooseClick(i, obj) {
			if (i == this.chooseShowIndex) return;
			// 删除chooseShowIndex之后的数据
			this.chooseList.slice(i + 1).forEach(v => {
				v.choose = false;
			})
			this.chooseList.splice(i + 1, this.chooseList.length - i);
			this.chooseShowIndex = i;
			this.showList = obj.children;
			this.lastChoose = false;
		},
		// 基础组件picker事件
		onPickerChange({ detail: { value } }) {
			if (this.mode == "selector") {
				let obj_ = this.dataList[value];
				this.$emit("onPickerChoose", { text: obj_.name, value: obj_.value, item: obj_, target: this.target });
			}
			this.$emit("onPickerChoose", { text: value, value: value, item: {}, target: this.target });
		},
		// 基础组件picker-view事件
		onMulPickerChange({ detail: { value } }) {
			this.mulPickerVal=value;
			if(this.mulPickerColn != 1&&this.mulPickerVal.length!=this.dataList.length){
				let len=this.mulPickerVal.length;
				while (this.dataList.length-len){
					this.mulPickerVal[this.dataList.length-len]=0;
					len++;
				}
			}
		},
		//选择完成
		onPickerConfirm() {
			let choose = undefined;
			if (this.mode == "selector") {
				let value = this.mulPickerVal;
				if (this.mulPickerColn == 1) {//dataList是一维数组
					let i=(value == undefined||value.length==0) ? 0 : value[0];
					let obj_ = this.dataList[i];
					if (!obj_){
						if(this.banEmpty)return ;
						else{
							obj_={name:"",value:""}
						}
					}
					choose = { text: obj_.name, value: obj_.value, item: obj_, target: this.target };
				} else {
					//dataList是二维数组
					if (value == undefined||value.length==0) {
						value = [];
						for (var i = 0; i < this.dataList.length; i++) {
							value.push(0);
						}
					}
					let arr_ = [];
					for (var i = 0; i < value.length; i++) {
						let j = value[i] == undefined ? 0 : value[i];
						let obj_ = this.dataList[i][j];
						arr_.push(obj_);
					}
					choose = { text: arr_, value: arr_, item: {}, target: this.target };
				}
			} else {
				let lastChoose = this.chooseList[this.chooseList.length - 1];
				if (!lastChoose) {
					if(this.banEmpty)return ;
					else{
						lastChoose={name:"",value:""}
					}
				}
				choose = { text: lastChoose.name, value: lastChoose.value, item: lastChoose, target: this.target };
			}
			this.$emit("onPickerChoose", choose);
			this.onClose();
		},
		// 选择重置
		onReset() {
			this.chooseList.forEach(v => {
				this.$set(v, "choose", false);
			});
			this.showList = this.dataList;
			// length=0，h5不会更新dom
			this.chooseList = [];
			this.lastChoose = false;
			if (this.mode == "selector") {
				this.showFlag = false;
			}else if(this.banEmpty){
				this.$set(this.showList[0], "choose", true);
				this.onItemClick(this.showList[0]);
			}
			if(this.showSearch){
				this.searchText="";
			}
			this.$emit("onReset");
		},
		onMove() { return ;},
		pickerViewClick() {
			if (this.mode == "selector") {
				this.showFlag = true;
			} else {
				this.$refs.wpicker.show();
			}
		},
		WPickerConfirm(result) {
			this.$emit("onPickerChoose", { text: result, value: result, item: {}, target: this.target });
		},
		onSearch(){
			if(this.$isEmpty(this.searchText)){
				if(this.showList!=this.dataList){
					this.showList=this.dataList;
					// this.chooseList.forEach(v => {
					// 	this.$set(v, "choose", false)
					// });
					// this.chooseList=[];this.lastChoose = false;
				}
			};
			this.chooseList.forEach(v => {
				this.$set(v, "choose", false)
			});
			this.chooseList=[];this.lastChoose = false;
			let list=searchTree(this.searchText,this.dataList);
			this.showList=list;
		},
		isArrayFn(value) {
			if (typeof Array.isArray === "function") {
				return Array.isArray(value);
			} else {
				return Object.prototype.toString.call(value) === "[object Array]";
			}
		}
	},
}
	function searchTree(text,source,target=[]){
		for (let v of source) {
			let obj=undefined;
			if(v.name.indexOf(text)!=-1){
				obj={...v};
				target.push(obj);//
			}else{
				if(v.children&&v.children.length>0){
					let result=searchTree(text,v.children,[]);
					if(result&&result.length>0){
						// obj={...v};
						// obj.children=result;
						target.splice(target.length,0,...result);
					}
				}
			}
			if(obj){
				obj.choose=false;
				// target.push(obj);
			}
		}
		return target;
	}
</script>

<style lang="scss" scoped>
	$line-height: 88upx;
	$picker-conten-height:680upx;
	
	.hidden {
	  display: none !important;
	}
	.full-height{
		height: 100% !important;
		bottom: 0px;
		box-sizing: border-box;
		z-index: 99 !important;
	}
	.picker-conten {
	  width: 100%;
	  position: fixed;
	  left: 0px;
	  z-index: 10;
	  /*overflow: scroll;*/
	  display: flex;
	  flex-direction: column;
	  &-fix-height{
		  height: $picker-conten-height;
		  bottom: 0px;
	  }
	  &-max-height{
		  max-height: $picker-conten-height;
	  }
	}
	.mark {
	  z-index: 10;
	  position: fixed;
	}
	.data-list {
	  background: $color-white;
	  width: 100%;
	  flex-grow: 1;
	  overflow: scroll;
	}
	.data-list-height1{
		max-height: calc(#{$picker-conten-height} - 88upx - 88upx);;
	}
	.data-list-height2{
		max-height: $picker-conten-height;
	}
	.data-list-height3{
		height:calc(#{$picker-conten-height} - 88upx - 88upx);
	}
	.data-list-height4{
		max-height: calc(#{$picker-conten-height} - 88upx);
	}
	.data-item,
	.top-btn,
	.choose-list {
	  display: flex;
	  align-items: center;
	}
	.icongou {
	  font-size: 40upx;
	  display: none;
	}
	.data-item {
	  & {
	    position: relative;
	    height: $line-height;
	    padding: 0px 40upx;
	    background-color: $color-white;
	    font-size: $font-size-30;
	    font-family: PingFang-SC-Medium;
	    font-weight: 500;
	    justify-content: space-between;
	  }
	  &-choose {
	    color: $color-main !important;
	    background: #f0f9f5;
	  }
	  &-choose-icon {
	    display: inline-block;
	  }
	}
	.bottom-btn,
	.top-btn {
	  background: $color-white;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  position: relative;
	}
	.bottom-btn {
	  & {
	    font-size: $font-size-30;
	    position: relative;
		display: flex;
	  }
	  > text {
	    text-align: center;
	    flex-grow: 1;
	  }
	}
	.btn {
	  display: inline-block;
	  height: $line-height;
	  line-height: $line-height;
	  position: relative;
	}
	.reset-btn {
	  position: relative;
	  color: $color-666;
	}
	.confirm-btn {
	  color: $color-main;
	}
	
	.confirm-btn-search {
	  background: $color-main;
	  color: $color-white;
	}
	.reset-btn-search {
	  position: relative;
	  color: $color-main;
	}
	
	.top-btn {
	  & {
	    justify-content: space-between;
	    font-size: $font-size-32;
	  }
	  > text {
	    margin: 0px 31upx;
	  }
	}
	.cancle-btn {
	  color: #000;
	}
	.choose-list {
	  width: 100%;
	  box-sizing: border-box;
	  height: $line-height;
	  white-space: nowrap;
	  background: $color-f2;
	  padding: 0px 30upx;
	  font-size: $font-size-28;
	}
	.choose-item,
	.choose-item-delimiter {
	  display: inline-block;
	  height: $line-height;
	  line-height: $line-height;
	}
	.choose-item {
	  & {
	    max-width: 276upx;
	  }
	  &-delimiter {
	    margin: 0upx 16upx;
	    font-size: $font-size-20;
	    vertical-align: top;
	  }
	  &-show {
	    color: $color-main;
	    border-bottom: 4upx solid $color-main;
	    height: calc(88upx - 4upx);
	    line-height: calc(88upx - 4upx);
	  }
	  &-placeholder {
	    color: $color-999;
	  }
	}
	.selector-picker {
	  z-index: 10;
	  position: fixed;
	  height: 680upx;
	  width: 100%;
	  bottom: 0;
	  left: 0;
	  background: #ffffff;
	  transform: translateY(100%);
	  &-indicator {
	    height: 68upx;
	  }
	  &-item {
	    height: 68upx;
	    line-height: 68upx;
	    text-align: center;
	    font-size: $font-size-32;
	  }
	  picker-view {
	    height: 100%;
	    width: 100%;
	  }
	  > .top-btn {
	    position: relative;
	  }
	}
	.selector-picker.show {
	  transform: translateY(0);
	}
	
	.search-content{
	  display: flex;
	  align-items: center;
	  height:88upx;
	  padding-left: 20upx;
	  position:relative;background:#FFFFFF;
	  .search-input {
		  display: flex;
		  align-items: center;
		  width: 610upx;
		  height: 58upx;
		  background: $color-f2;
		  border-radius: 10upx;
		}
		.search-input-icon {
		  font-size: 34upx;
		  color: #999999;
		  margin: 0px 20upx;
		}
		
		input {
		  width: 535upx;
		  font-size: 28upx;
		}
		.search-text {
		  font-size: 32upx;
		  font-family: PingFang-SC-Medium;
		  font-weight: 500;
		  color: #000000;
		  margin-left: 29upx;
		}
	}
</style>

