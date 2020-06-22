<template>
	<!-- 1.只有搜素框、2.搜索框和1一级筛选、3.搜索框和1一二级筛选、4.搜索框和1一二三级筛选 -->
	<view class="search-filter" >
		<view class="mark" v-show="!markHide" @tap="onMarkClick" @touchmove.stop.prevent="onMove"></view>
		<view class="search-filter-content van-hairline--bottom" :style="{position:isFixed?'fixed':'sticky'}">
			<!-- 筛选条件 -->
			<view v-show="showFilter && showFilterOfOut" class="filter-item-list-view">
				<view class="filter-item-list">
					<scroll-view class="scroll-view" scroll-x v-if="isOneLevel">
						<template v-for="(f,i) of dataList">
							<view class="filter-item" :key="i" @tap="onFilterItemClick(i,f)" :class="{'filter-item-choose':isOneLevel&&filterMenuListShowIndex==i}">
								<text class="filter-item-text uni-ellipsis">{{f.name}}</text>
							</view>
						</template>
					</scroll-view>
					<template v-else>
						<template v-for="(f,i) of dataList">
							<view class="filter-item" :key="i" @tap="onFilterItemClick(i,f)">
								<text class="filter-item-text uni-ellipsis">{{f.name}}</text>
								<text class="iconfont iconxiala filter-item-icon"></text>
							</view>
							<view class="filter-item-delimiter" v-if="!isOneLevel && (i+1)!=filterNum"></view>
						</template>
					</template>
					<text v-if="showSearch" class="iconfont iconsousuo search-icon" @tap="onShowSearch"></text>
				</view>
			</view>
			<view class="search-view" v-show="!hideSearch || !showFilterOfOut">
				<view class="search-content">
					<view class="search-input">
						<text class="iconfont iconsousuo search-input-icon" @tap="onSearch"></text>
						<input type="text" v-model="searchText" :blur="markHide"  :placeholder="searchPlaceholder" @focus="searchInputFocus" @input="onSearchInput" @blur="onSearchBlur" @confirm="onSearchConfirm" />
					</view>
					<text class="search-text" @tap="onSearch">搜索</text>
				</view>
				<scroll-view scroll-y v-show="searchList && searchDataList" class="search-list" @touchmove.stop.prevent="onMove">
					<view v-for="(v,i) of searchDataList" :key="i" @tap="onSearchDataClick(v)" class="search-list-item van-hairline--bottom">
						<text>{{v.name}}</text>
					</view>
				</scroll-view>
			</view>
			<template v-if="!isOneLevel">
				<template v-for="(f,i) of filterList">
					<view class="data-picker-view" :key="i" :id="i" v-show="filterMenuListShow && filterMenuListShowIndex==i">
						<data-picker :showChoose="!!f.showChoose" :banEmpty="false" :buttonTop="false" :showResetBtn="!!f.showResetBtn" :ref="i" @onPickerChoose="onPickerChoose" @onReset="onResetFilter" @onClose="onMarkClick" :dataList="f.children"></data-picker>
					</view>
				</template>
			</template>
		</view>
	</view>
</template>

<script>
import dataPicker from "./dataPicker.vue"
export default {
	components: {
		dataPicker
	},
	props: {
		filterList: { type: Array, default() { return [] } },
		searchPlaceholder: { type: String, default: "" },
		value: { type: String, default: "" },
		searchDataList: { type: Array, default: null },
		showSearch: { type: Boolean, default: true },//是否在筛选条件中旁显示搜索按钮
		showChoose: { type: Boolean, default: true },//dataPicker显示选择结果
		showResetBtn: { type: Boolean, default: false },//是否显示重置按钮
	},
	computed: {
		filterNum() { return this.filterList.length; },
		showFilterOfOut() { return this.filterNum > 0; },
		isOneLevel() {
			let r_ = !this.filterList.some(v => {
				return v.children;
			});
			return r_;
		},
		isFixed(){//fixed定位
			return !this.markHide||(!this.isOneLevel&&this.filterMenuListShow);
		}
	},
	watch: {
		isOneLevel: {
			handler: function (newValue, oldValue) {
				if (newValue) {
					this.filterMenuListShowIndex = 0;
				} else {
					this.filterMenuListShowIndex = -1;
				}
			},
			immediate: true
		},
		filterList: {
			handler: function (newValue, oldValue) {
				if (newValue) {
					newValue.forEach(v=>{
						v.title=v.name;
					});
					this.dataList=newValue;
				}
			},
			immediate: true
		}
	},
	data() {
		return {
			hideSearch: true,//有筛选条件隐藏搜索框
			markHide: true,
			showFilter: true,//显示筛选条件
			searchList: false,//显示搜索框的搜素结果
			searchText: undefined,//搜索文本
			filterMenuListShow: false,
			filterMenuListShowIndex: -1,
			chooseFilter: {},//选中的1级(显示层级，并非filterList中的实际层级)对象，内含2级列表
			inputEventList: [],//input输入框待发送事件
			dataList:[],
		};
	},
	methods: {
		/**筛选类型点击（点击层级1）
		 * @param {Object} i 下标
		 * @param {Object} f 筛选类型
		 */
		onFilterItemClick(i, f) {
			if (!this.isOneLevel && this.filterMenuListShowIndex == i) {
				this.filterMenuListShow = false;
				this.filterMenuListShowIndex = -1;
				return;
			} else {
				this.filterMenuListShow = true;
				this.filterMenuListShowIndex = i;
				this.chooseFilter = f;
			}
			// 单层
			if (this.isOneLevel) {
				if (!f.choose) {
					this.filterList.forEach(v => {
						this.$set(v, "choose", false);
					});
					this.$emit("onFilterMenuClick", { type: f.type, value: f.value });
				}
				f.choose = true;
			} else {
				this.$refs[i][0].show();
			}
		},
		/**选择改变
		 * @param {Object} obj
		 */
		onPickerChoose(obj) {
			this.$emit("onFilterMenuClick", { type: this.chooseFilter.type, value: obj.value });
			let filter=this.dataList[this.filterMenuListShowIndex];
			if(filter){
				if(obj.text){
					if(obj.text=="全部"){
						filter.name=filter.title;
					}else{
						filter.name=obj.text;
					}
				}else{
					filter.name=filter.title;
				}
			}
		},
		/**
		 * 重置筛选
		 */
		onResetFilter() {
			// 重置暂不向上推送onFilterMenuClick事件
			// this.$emit("onFilterMenuClick",{type:this.chooseFilter.type,value:""});
		},
		onSearch() {
			this.$emit("onSearch", this.searchText);
			this.onMarkClick();
		},
		searchInputFocus(){
			this.searchList=true;
			this.markHide=false;
		},
		onSearchInput({ detail: { value } }) {
			this.inputEventList.push((len) => {
				if (len < this.inputEventList.length) return;
				this.$emit("onSearchInput", value);
				this.inputEventList.length = 0;
			});
			setTimeout(() => {
				let len = this.inputEventList.length;
				if (len > 0) {
					this.inputEventList[len - 1](len);
				}
			}, 500);
		},
		onSearchDataClick(obj) {
			this.$emit("onSearchDataClick", obj);
			this.onMarkClick();
		},
		onSearchBlur({ detail: { value } }) {
			this.$emit("onSearchBlur", value);
			this.$emit("onSearch", value);
			this.onMarkClick();
		},
		onSearchConfirm({ detail: { value } }) {
			this.$emit("onSearchConfirm", value);
			this.$emit("onSearch", value);
			uni.hideKeyboard();
			this.onMarkClick();
		},
		onShowSearch() {
			this.hideSearch = this.markHide = this.showFilter = this.filterMenuListShow = false;
		},
		onMarkClick() {
			this.filterMenuListShow = this.searchList = false;
			this.markHide = true;
			if (!this.isOneLevel)
				this.filterMenuListShowIndex = -1;
			if (this.showFilterOfOut) {
				// 有筛选条件
				this.showFilter =this.hideSearch=this.$isEmpty(this.searchText);
			}
		},
		onMove() { }
	}
}
</script>

<style scoped lang="scss">
	$height: 90upx;
	.search-filter {
	  position: sticky;
	  width: 100%;
	   height: $height;
	  z-index: 11;
	  top: 0px !important;
	}
	
	.mark {
	  position: fixed;
	}
	.search-filter-content {
	  height: $height;
	  width: 100%;
	  background-color: #ffffff;
	  position: relative;
	  top: 0upx;
	}
	.search-view,
	.filter-item-list-view {
	  height: 100%;
	}
	.filter-item-list,
	.filter-menu,
	.search-content,
	.search-input {
	  display: flex;
	  align-items: center;
	}
	.filter-item-list,
	.filter-menu-list,
	.search-content {
	  position: relative;
	  z-index: 10;
	  background: #ffffff;
	}
	.filter-item {
	  & {
	    flex-grow: 1;
	    color: #000000;
		display: flex;align-items: center;justify-content: center;
		// width: 150upx;
	  }
	  &-list {
	    width: 100%;
	    height: 88upx;
	    // overflow: scroll;
	    white-space: nowrap;
		.scroll-view{
			width: 70%;flex-grow: 1;
			height: 100%;
			view{
				display: inline-block;text-align: center;
				height: $height;
				line-height: $height;
				padding: 0px 30upx;
			}
		}
	  }
	  &-text {
	    font-size: 30upx;
		display: inline-block;
		max-width: 150upx;
	  }
	  &-icon {
	    font-size: 18upx;
	    display: inline-block;
	    transition: transform 0.2s linear;
		padding-left: 22upx;
	  }
	  &-icon-rotate {
	    transform: rotate(180deg);
	  }
	  &-delimiter {
	    background-color: rgba(216, 216, 216, 1);
	    width: 2upx;
	    height: 38upx;
	  }
	}
	.search-icon {
	  width: 106upx;
	  height: 88upx;
	  line-height: 88upx;
	  background: #ffffff;
	  box-shadow: -3upx 0upx 12upx 0upx rgba(0, 0, 0, 0.05);
	  font-size: 32upx;
	  text-align: center;
	}
	.filter-menu {
	  & {
	    height: 87upx;
	    padding: 0px 40upx;
	    background-color: #ffffff;
	    border-top: 1upx solid rgba(216, 216, 216, 1);
	    font-size: 30upx;
	    font-family: PingFang-SC-Medium;
	    font-weight: 500;
	    justify-content: space-between;
	  }
	  &-list {
	    top: -2upx;
	    background-color: rgba(0, 0, 0, 0.5);
	  }
	}
	.filter-menu-choose,
	.filter-item-choose {
	  color: $color-main !important;
	}
	.filter-menu-choose-icon {
	  display: inline-block;
	}
	.icongou {
	  font-size: 40upx;
	  display: none;
	}
	.search-content {
	  height: 100%;
	  padding-left: 20upx;
	  border-bottom: 1upx solid rgba(216, 216, 216, 1);
	}
	.search-input {
	  width: 610upx;
	  height: 58upx;
	  background: $color-f2;
	  border-radius: 10upx;
	}
	input {
	  width: 535upx;
	  font-size: 28upx;
	}
	.search-input-icon {
	  font-size: 34upx;
	  color: #999999;
	  margin: 0px 20upx;
	}
	.search-text {
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: #000000;
	  margin-left: 29upx;
	}
	.data-picker-view,
	.search-list {
	  position: fixed;
	  width: 100%;
	  height: 100%;
	}
	.data-picker-view {
	  z-index: 0;
	  top: calc(#{$height} - 2upx);
	}
	.search-list {
	  & {
	    background: $color-white;
	    overflow: scroll;
	  }
	  &-item {
	    position: relative;
	    font-size: $font-size-30;
	    box-sizing: border-box;
	    padding: 30upx;
	  }
	}
</style>

