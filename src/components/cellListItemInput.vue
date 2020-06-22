<template>
    <div class="footer-cell-group scale-1px-bottom" @tap="isFocus = true">
        <span class="text">{{title}} <span v-if="isNoNull" style="color: #fc703e">*</span></span>
        <!--  #ifdef H5 -->
        <input @blur="onInputBlur" @focus="onInputFocus" :type="type" class="name-rg" :class="!isNoIcon ? 'mar20' : ''" :value="value" @input="stringValueInput" :placeholder="phder" />
        <!--  #endif -->
        <!--  #ifdef MP-WEIXIN -->
        <input :cursor-spacing="tanchuHeight" @focus="onInputFocus" class="name-rg" :type="type" :class="!isNoIcon ? 'mar20' : ''" :value="value" @input="stringValueInput" :placeholder="phder" />
        <!--  #endif -->
        <div v-if="isNoIcon">
            <i class="iconfont input-icon iconshuru" @tap="isFocus = true" v-if="getShowIconEdit"></i>
            <i class="iconfont input-icon iconshanchu" @tap="shanChu" v-if="!getShowIconEdit"></i>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            isFocus: false,
            value: ""
        }
    },
    props: {
        tanchuHeight: {
            type: Number,
            default: 100
        },
        title: {
            type: String,
            default: ""
        },
        phder: {
            type: String,
            default: ""
        },
        isNoNull: {
            type: Boolean,
            default: true
        },
        valueProps: {
            type: String,
            default: ""
        },
        isNoIcon: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: "text"
        }
    },
    watch: {
        valueProps:{
			handler() {
				this.value = this.valueProps;
			},
			immediate: true
		}
    },
    computed: {
        getShowIconEdit() {
            if (this.value.length > 0 && this.isFocus) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        onInputBlur() {
            // 兼容IOS输入法
            this.$iosScrollAuto();
        },
        onInputFocus() {
           this.$emit("focus", this.value);
        },
        stringValueInput(e) {
            this.value = e.detail.value;
            this.$emit("input", e.detail.value);
        },
        shanChu() {
            this.isFocus = false;
            this.value = '';
            this.$emit("input", "");
        }
    }
}
</script>
<style lang="scss" scoped>
    .footer-cell-group {
      position: relative;
      height: 100upx;
      background-color: #fff;
      margin-left: 30upx;
      .input-icon {
        position: absolute;
        font-size: 32upx;
        right: 30upx;
        top: 28upx;
        color: #ccc;
      }
    }
    .text {
      font-size: 32upx;
      line-height: 100upx;
    }
    .name-rg {
      text-align: right;
      height: 30upx;
      margin-top: 22upx;
      float: right;
      font-size: 32upx;
      margin-right: 80upx;
      color: #999999;
      width: 380upx;
    }
    .mar20 {
      margin-right: 20upx;
    }
</style>
