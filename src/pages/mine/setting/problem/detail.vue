<template>
  <div class="problemdetailed">
    <div class="problemdetailed-item">
      <h1 class="scale-1px-bottom">{{Title}}</h1>

      <!--  #ifdef H5 -->
      <p class="wx-parse" v-html="Msg"></p>
      <!--  #endif -->

      <!--  #ifdef MP-WEIXIN -->
      <rich-text class="wx-parse" :nodes="Msg"></rich-text>
      <!--  #endif -->
    </div>
  </div>
</template>

<script>
import Publics from "../../../../api/modules/public";
export default {
  components: {

  },
  data() {
    return {
      Title: "",
      Msg: ""
    }
  },
  computed: {
  },
  onLoad(options) {
    Publics.queryProblem({ problemId: options.problemId }).then(res => {
      this.Title = res.problemTitle;
      this.Msg = decodeURIComponent(res.answer).replace(/section/g, "div")
        .replace(/margin-left:5\.2500pt/g, "")
        .replace(/<font/g, "<span")
        .replace(/<\/font>/g, "</span>")
        .replace(/strong/g, "div")
        .replace(/footer/g, "div")
        .replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
    });
  },
  onShow() {
   this.$updateNavbarTitle("问题解答");
  }
}
</script>
<style lang="scss" scoped>
  .problemdetailed {
    min-height: 100%;
    background-color: #f2f2f2;
    font-family: PingFang-SC-Medium;
    .problemdetailed-item {
      width: 100%;
      padding-top: 0;
      background-color: #fff;
      word-wrap: break-word;
      h1 {
        font-size: 34upx;
        font-weight: bold;
        color: rgb(1, 1, 1);
        padding: 28upx 25upx 34upx 25upx;
      }
      div {
        font-size: 30upx;
        font-weight: 500;
        color: rgb(102, 102, 102);
        line-height: 50upx;
      }
    }
    .wx-parse {
      display: inline-block;
      padding: 20upx;
    }
    .wx-parse img {
      max-width: 100%;
    }
  }
</style>
