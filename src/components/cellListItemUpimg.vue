<template>
    <div class="footer-cell-group  scale-1px-bottom">
        <span class="text">{{title}} <span v-if="isNoNull" style="color: #fc703e">*</span></span>
        <div class="upImg" @click="onUpImg">
            <i class="iconfont input-icon pa_icons iconshangchuantupian"></i>
        </div>
        <img :src="imgSrc+'/100x100'" @click="onClickImg" v-if="imgSrc" class="img-class" alt="" />

        <div v-if="isShowPop" @click="isShowPop = false" class="pop">
            <img :src="imgSrc" class="pop-img" alt="">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgSrc: "",
            isShowPop: false
        }
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        imgPath: {
            type: String,
            default: ""
        },
        isNoNull: {
            type: Boolean,
            default: true
        },
        isNoImgSrc: {
            type: Boolean,
            default: true
        },
        imgSrcProp: {
            type: String,
            default: ""
        }
    },
    watch: {
        imgSrcProp() {
            this.imgSrc = this.imgSrcProp;
        }
    },
    created() {
        this.imgSrc = this.imgSrcProp;
    },
    methods: {
        onUpImg() {
            if (this.isNoImgSrc) {
                this.$store.dispatch("setUploadImage", this.imgPath).then(res => {
                    this.$emit("getSrcImg", res);
                });
            }
        },
        onClickImg() {
            uni.previewImage({ urls: [this.imgSrc] })
        }
    }
}
</script>
<style lang="scss" scoped>
    .footer-cell-group {
      height: 259upx;
      background-color: #fff;
      margin-left: 30upx;
      padding-top: 30upx;
      .text {
        font-size: 32upx;
      }
      .upImg {
        height: 120upx;
        width: 120upx;
        margin-top: 20upx;
        border-color: #b0b0b0;
      }
      .img-class {
        width: 122upx;
        height: 120upx;
        position: absolute;
        left: 150upx;
        top: 112upx;
      }
      .pa_icons {
        font-size: 120upx !important;
        width: 120upx !important;
        height: 120upx !important;
        position: absolute;
        left: 0;
        color: #b0b0b0;
      }
    }
    .pop {
      padding: 20upx;
      height: 100%;
      width: 100%;
      position: fixed;
      z-index: 50000;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .pop-img {
      max-width: 100%;
      margin-top: 100upx;
    }
</style>
