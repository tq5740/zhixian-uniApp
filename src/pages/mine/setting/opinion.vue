<template>
  <div class="opinion">
    <div class="van-cell-text">
      <span class="red">*</span>建议内容
    </div>
    <div class="pr">
      <textarea rows="10" v-model="content" cursor-spacing="20" class="textHeight" maxlength="50" placeholder="限50字以内"></textarea>
      <i class="iconfont input-icon pa_icon iconshuru icon-shuru"></i>
    </div>

    <div class="van-cell-text margin_t_20">
      描述
    </div>

    <div class="pr">
      <textarea rows="10" v-model="describes" cursor-spacing="20" class="textHeight" maxlength="500" placeholder="请输入建议描述"></textarea>
      <i class="iconfont input-icon pa_icon iconshuru icon-shuru"></i>
    </div>

    <div class="upload">
      <div class="upload_txt">
        上传图片（最多上传3张）
      </div>
      <div class="padding_t_30 flex">
        <div class="not_yet"></div>
        <div v-for="(itme,key) in fileData" :key="key" @click="clickImg(key)">
          <img class="init_img" alt="" :src="imgDomainSrc + itme" />&nbsp;
        </div>

        <div class="clear"></div>
        <div class="upImg margin_t_30" @click="upImgRestriction">
          <i class="iconfont input-icon pa_icons iconshangchuantupian icon-shangchuantupian"></i>
        </div>
      </div>
    </div>
    <button class="saveStyle" @click="saveBtn" :loading="loading">保存</button>

  </div>
</template>

<script>
import Publics from '../../../api/modules/public'
export default {
  data() {
    return {
      loading: false,
      describes: "",
      content: "",
      fileData: [],
      file: "",
      k: 0
    }
  },
  // 生命周期
  onLoad() {
    this.$updateNavbarTitle("建议反馈");
  },
  computed: {
    imgDomainSrc() {
      return this.$store.state.configData.imgDomain;
    }
  },
  methods: {
    saveBtn() {
      if (this.content === "") {
        this.$toast("请填写建议内容");
        return;
      }
      let data = {
        type: 1,
        content: this.content,
        describes: this.describes,
        imgUrl: "" + this.fileData
      };
      Publics.createOpinion(data).then(res => {
        this.$toast("谢谢您给我们提出宝贵的建议~");
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 1500);
      })
    },
    upImgRestriction() {
      if (this.fileData.length == 3) {
        this.$toast("最多上传三张");
        return;
      } else {
        this.upLoadFunc();
      }
    },
    clickImg(k) {
      this.k = k;
      this.fileData.splice(this.k, 1);
    },
    upLoadFunc() {
      this.$store.dispatch("setUploadImage", "/publics/opinion/img").then(res => {
        let list = [res, ...this.fileData]
        this.fileData = list;
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .van-cell-text {
    height: 88upx;
    line-height: 88upx;
    background-color: #fff;
    font-size: 32upx;
    padding-left: 20upx;
  }
  .opinion {
    padding-bottom: 98upx;
    .textHeight {
      background-color: #fff;
      max-height: 300upx;
      width: 100%;
      padding: 20upx;
    }
    .flex {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      border-bottom: 0upx solid #f2f2f2;
    }
    .fl {
      float: left;
      overflow: hidden;
    }
    .clear {
      clear: both;
    }
    .saveStyle {
      border-radius: 0;
      border: 0;
      width: 100%;
      height: 98upx;
      line-height: 98upx;
      color: #fff;
      background: #42b983;
      font-size: 34upx;
      text-align: center;
      position: fixed;
      bottom: 0;
    }
    .pr {
      background-color: #fff;
      position: relative;
      top: -1px;
      overflow: auto;
      border-top: 1px solid #eeeeee;
    }
    .red {
      color: red;
    }
    .margin_t_20 {
      margin-top: 20upx;
    }
    .padding_t_30 {
      padding-top: 30upx;
    }
    .upload {
      padding: 30upx;
      .upload_txt {
        font-size: 32upx;
      }
      .not_yet {
        height: 120upx;
        width: 120upx;
        display: inline-block;
      }
      .init_img {
        height: 120upx;
        width: 120upx;
        overflow: hidden;
        margin-top: 5upx;
        margin-left: 15upx;
      }
      #img0 {
        padding-left: 15upx;
      }
      .upImg {
        height: 120upx;
        width: 120upx;
        position: absolute;
        .pa_icons {
          font-size: 120upx !important;
          color: #b0b0b0;
        }
        input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 0 solid;
          opacity: 0;
        }
      }
    }
  }
  .icon-shuru {
    font-size: 30upx;
    color: #cccccc;
    position: absolute;
    right: 20upx;
    bottom: 20upx;
  }
</style>
