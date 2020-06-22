<script>
	export default {
		onLaunch: function ({path,query,scene}) {
			console.log(path,query,scene);
			this.$store.dispatch("initUserInfo", {token:query.token});
		},
		onShow: function (data) {

		},
		onHide: function () {

		},
		onError(err) {
			console.log(err);
			uni.showToast({
				title: err.toString()
			});
		}
	};
</script>
<style lang="scss">
	//每个页面公共css
	page {
	  height: 100%;
	  box-sizing: border-box;
	}
	.page-full {
	  min-height: 100%;
	  // background-color: $color-f2;
	  background-color: #ededed;
	}

	/* #ifdef H5 */
	.uni-tabbar .uni-tabbar__bd {
	  // 框架的地步tabbar
	  height: 53px !important;
	}
	/* #endif */

	//列表创建按钮
	.create-btn {
	  position: fixed;
	  bottom: 0px;
	  z-index: 10;
	  background: #ffffff;
	  height: $create-btn-height;
	  line-height: $create-btn-height;
	  text-align: center;
	  width: 100%;
	  font-size: 32upx;
	  font-family: PingFang-SC-Medium;
	  font-weight: 500;
	  color: $color-main;
	  border-top: 1upx solid #d8d8d8;
	  .iconfont {
	    margin-right: 14upx;
	  }
	}
	.create-btn-padding-bottom {
	  padding-bottom: $create-btn-height;
	}
	// 吸底满宽按钮
	.bottom-full-btn {
	  $h: 98upx;
	  height: $h;
	  width: 100%;
	  line-height: $h;
	  text-align: center;
	  position: fixed;
	  bottom: 0px;
	  z-index: 10;
	  background: $color-main;
	  color: #ffffff;
	  font-size: $font-size-32;
	}

	.van-hairline {
	  &--top::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-top-width: 1px;
	  }

	  &--left::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-left-width: 1px;
	  }

	  &--right::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-right-width: 1px;
	  }

	  &--bottom::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-bottom-width: 1px;
	  }

	  &--right-bottom::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-bottom-width: 1px;
	    border-right-width: 1px;
	  }

	  &--top-bottom::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-width: 1px 0;
	  }

	  &--surround::after {
	    content: "";
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 200%;
	    height: 200%;
	    transform: scale(0.5);
	    transform-origin: 0 0;
	    pointer-events: none;
	    box-sizing: border-box;
	    border: 0 solid #d8d8d8;
	    border-width: 1px;
	  }
	}
	.scale-1px-top {
	  border: none;
	  position: relative;
	}
	.scale-1px-top:before {
	  content: "";
	  position: absolute;
	  display: block;
	  top: 0;
	  left: 0;
	  width: 200%;
	  height: 1px;
	  border-top: 1px solid #d8d8d8;
	  -webkit-transform: scale(0.5, 0.5);
	  transform: scale(0.5, 0.5);
	  -webkit-transform-origin: 0 0;
	  transform-origin: 0 0;
	}

	.scale-1px-bottom {
	  border: none;
	  position: relative;
	}
	.scale-1px-bottom:before {
	  content: "";
	  position: absolute;
	  display: block;
	  bottom: -1px;
	  left: 0;
	  width: 200%;
	  height: 1px;
	  border-bottom: 1px solid #d8d8d8;
	  -webkit-transform: scale(0.5, 0.5);
	  transform: scale(0.5, 0.5);
	  -webkit-transform-origin: 0 0;
	  transform-origin: 0 0;
	}

	/* 隐藏滚动条 */
	.hide-scrollbar ::-webkit-scrollbar {
	  display: none;
	}

	.uni-ellipsis {
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	}

	.mark {
	  background: rgba(0, 0, 0, 0.5);
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  left: 0upx;
	  top: 0upx;
	}
</style>
