<template>
	<view class="serach scale-1px-bottom">
		<view class="content">
			<view class="content-box" :class="{'center':mode === 2}">
				<text class="icon icon-sousuo_hui"></text>
				<input class="input" :class="{'center':!active && mode === 2}" :focus="isFocus" :placeholder="plhder" v-model="inputVal" @focus="focus" @blur="blur" />
				<text v-if="isDelShow" class="icon icon-shanchu" @click="clear"></text>
			</view>
			<view v-show="(active&&show&&button === 'inside')||(isDelShow && button === 'inside')" class="serachBtn" @click="search">
				搜索
			</view>
		</view>
		<view v-if="button === 'outside'" class="button" :class="{'active':show||active}" @click="search">
			<view class="button-item">{{!show?searchName:'搜索'}}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		plhder: {
			value: String,
			default: '请输入搜索内容'
		},
		mode: {
			value: Number,
			default: 1
		},
		button: {
			value: String,
			default: 'outside'
		},
		show: {
			value: Boolean,
			default: true
		}
	},
	data() {
		return {
			active: false,
			inputVal: '',
			searchName: '取消',
			isDelShow: false,
			isFocus: false
		};
	},
	methods: {
		focus() {
			this.active = true;
		},
		blur() {
			this.isFocus = false;
			if (!this.inputVal) {
				this.active = false;
			}
		},
		clear() {
			this.inputVal = '';
			this.active = false;
			this.$emit('search', '');
		},
		getFocus() {
			this.isFocus = true;
		},
		search() {
			this.$emit('search', this.inputVal);
		}
	},
	watch: {
		inputVal(newVal) {
			if (newVal) {
				this.searchName = '搜索';
				this.isDelShow = true;
			} else {
				this.searchName = '取消';
				this.isDelShow = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.serach {
	  display: flex;
	  width: 100%;
	  height: 88upx;
	  box-sizing: border-box;
	  padding: 15upx;
	  font-size: 32upx;
	  background: rgb(242, 242, 242);
	  .content {
	    display: flex;
	    align-items: center;
	    width: 100%;
	    height: 60upx;
	    background: #fff;
	    overflow: hidden;
	    transition: all 0.2s linear;
	    border-radius: 10upx;
	    .content-box {
	      width: 100%;
	      display: flex;
	      align-items: center;
	      &.center {
	        justify-content: center;
	      }
	      .icon {
	        padding: 0 15upx;
	        &.icon-del {
	          font-size: 38upx;
	        }
	      }
	      .input {
	        width: 100%;
	        max-width: 100%;
	        line-height: 60upx;
	        height: 60upx;
	        font-size: 28upx;
	        transition: all 0.2s linear;
	        &.center {
	          width: 200upx;
	        }
	        &.sub {
	          width: auto;
	          color: grey;
	        }
	      }
	    }
	    .serachBtn {
	      height: 100%;
	      flex-shrink: 0;
	      padding: 0 30upx;
	      background: $uni-color-success;
	      line-height: 60upx;
	      color: #fff;
	      border-left: 1px #ccc solid;
	      transition: all 0.3s;
	      font-size: 32upx;
	    }
	  }

	  .button {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    position: relative;
	    flex-shrink: 0;
	    width: 0;
	    transition: all 0.2s linear;
	    white-space: nowrap;
	    overflow: hidden;
	    &.active {
	      padding-left: 15upx;
	      width: 100upx;
	    }
	  }
	}
	.icon {
	  font-family: iconfont;
	  font-size: 32upx;
	  font-style: normal;
	  color: #999;
	}
</style>
