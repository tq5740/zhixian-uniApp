<template>
  <div class="main-box">
    <div>
      <div class="article-detail">
        <div class="article-detail-container">
          <header class="article-header">关于我们</header>
          <aside class="article-profile scale-1px-bottom">
            <span class="article-resource">{{data.shortName}}</span>
          </aside>

          <!--  #ifdef H5 -->
          <p class="article-content" v-html="data.introStr"></p>
          <!--  #endif -->

          <!--  #ifdef MP-WEIXIN -->
          <rich-text class="article-content" :nodes="data.introStr"></rich-text>
          <!--  #endif -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "../../../api/modules/user";
export default {
  components: {},
  data() {
    return {
      data: {}
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  },
  onLoad() {
    User.getQueryOrg("1547610150543660").then(res => {
      res.introStr = this.$escape2Html(res.intro);
      res.updateTimeStr = this.$formatDate(res.updateTime, "YYYY-MM-DD");
      this.data = res;
    });
  },
  onShow() {
    this.$updateNavbarTitle("关于我们");
  }
}
</script>
<style lang="scss" scoped>
  .About {
    min-height: 100%;
    background-color: #f2f2f2;
    overflow-x: hidden;
    padding: 20upx;
    font-size: 25upx;
  }
  /deep/.content img {
    max-width: 100% !important;
  }
  .content section,
  .content h1,
  .content h2,
  .content h3,
  .content h4,
  .content h5,
  .content h6,
  .content span,
  .content div,
  .content p,
  .content header,
  .content footer,
  .content code {
    font-size: 28upx !important;
  }
  .mode {
    font-size: 28upx;
    color: #42b983;
    margin-bottom: 20upx;
    .iconfont {
      font-size: 28upx;
      margin-right: 10upx;
    }
  }

  .main-box {
    .article-detail {
      position: relative;
      min-height: 100%;
      padding-bottom: 98upx;
      font-size: 26upx;
      color: #000;
      .article-detail-container,
      .article-comment-container {
        background-color: #fff;
      }
      .article-detail-container {
        padding: 30upx 20upx;
        margin-bottom: 20upx;
      }
      .article-header {
        margin-bottom: 30upx;
        font-size: 40upx;
        font-weight: bold;
        word-wrap: break-word;
      }
      .article-profile {
        height: 62upx;
        font-size: 28upx;
        color: #999;
      }
      .article-resource {
        color: #42b983;
      }
      .article-content {
        overflow-x: hidden;
        display: block;
        font-size: 28upx;
        padding-top: 20upx;
      }
    }
  }
</style>
