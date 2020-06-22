<template>
  <div class="venue-detail">
    <div v-if="!isPlaceholders">
      <div class="venue-detail-wrap">

        <venue-top-detail :venueDetailData="venueDetailData"></venue-top-detail>

        <div class="split-line"></div>
        <div class="venue-container">
          <!--  #ifdef H5 -->
          <p class="venue-msg" v-html="venueDetailData.introStr"></p>
          <!--  #endif -->

          <!--  #ifdef MP-WEIXIN -->
          <rich-text class="venue-msg" :nodes="venueDetailData.introStr"></rich-text>
          <!--  #endif -->

          <div class="split-line"></div>
          <div class="cont_title cont_title1 border-bottom">
            <div class="cont_title_t1">
              <span class="iconfont icon-juxing"></span>
              参会须知
            </div>
          </div>
          <!--  #ifdef H5 -->
          <p class="venue-notice" v-html="venueDetailData.notice"></p>
          <!--  #endif -->

          <!--  #ifdef MP-WEIXIN -->
          <rich-text class="venue-notice" :nodes="venueDetailData.notice"></rich-text>
          <!--  #endif -->
        </div>
      </div>

      <div v-if="isPlaceholders">
        <placeholders></placeholders>
      </div>
    </div>
  </div>
</template>
<script>
import Work from "../../api/modules/work";
import placeholders from "../../components/placeholders";
import venueTopDetail from "../../components/venueTopDetail";

// #ifdef H5
import { wxShare, getAppVersion, isWxBrowser } from '../../utils/utils'
// #endif
export default {
  components: {
    venueTopDetail, placeholders
  },
  data() {
    return {
      title: "",
      venueDetailData: {},
      isPlaceholders: true,
      imgSrcDomain: this.$store.state.configData.imgDomain,
      venueId: ""
    }
  },

  onLoad(options) {
    this.venueId = options.venueId;
    this.getvenueDetailData();
  },
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    return {
      title: this.venueDetailData.venueTitle,
      path: "/pages/work/venue/detail?venueId=" + this.venueId
    }
  },
  // #endif
  onShow() {
    this.$updateNavbarTitle(this.title);
    // #ifdef H5
    if (getAppVersion() === "android" && isWxBrowser()) {
      this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
    }
    // #endif
  },
  computed: {
    
  },
  methods: {
    getvenueDetailData() {
      if (!this.venueId) return;
      const data = {
        venueId: this.venueId
      };
      Work.getQueryVenue(data).then((res) => {
        this.$updateNavbarTitle(res.venueTitle);
        this.title = res.venueTitle;
        this.isPlaceholders = false;
        res.introStr = this.$escape2Html(res.intro);

        res.notice = res.notice ? res.notice.replace(/\n|\r\n/g, "<br>") : "";
        res.deadlineStr = this.$formatDate(res.deadline, "YYYY-MM-DD");
        res.startTimeString = this.$formatDate(res.startDate, "YYYY-MM-DD");
        res.endTimeString = this.$formatDate(res.endDate, "YYYY-MM-DD");
        this.venueDetailData = res;

        // #ifdef H5
        setTimeout(() => {
          let ShareConfig = {};
          ShareConfig.title = res.venueTitle;
          ShareConfig.link = window.location.href;
          ShareConfig.imgUrl = res.venueImg ? this.$store.state.configData.imgDomain + res.venueImg + "/100x100" : this.$store.state.configData.imgDomain + "/default/cdwork/venue_img.jpg/100x100";
          ShareConfig.desc = `举办时间：${res.startDate == res.endDate
            ? this.$formatDate(res.startDate, "YYYY-MM-DD") + " [" + res.period + "]"
            : this.$formatDate(res.startDate, "YYYY-MM-DD") +
            " ~ " + this.$formatDate(res.endDate, "YYYY-MM-DD") + " [" + res.period + "]"
            }`;
          wxShare(ShareConfig);
        }, 1000);
        // #endif
      });
    }
  }
}
</script>
<style scoped lang="scss">
  .icon-gengduo {
    font-size: 28upx;
    color: #999;
  }
  .icon-juxing {
    color: #42b983;
  }
  .bac-list {
    background-color: #f5f5f5;
  }
  .venue-detail {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    font-size: 28upx;
    color: #666;
    background-color: #fff;
    .venue-navigation {
      height: 88upx;
      padding: 0 20upx;
      display: flex;
      align-items: center;
    }
    .split-line {
      height: 20upx;
      background-color: #f5f5f5;
    }
    .split-box {
      height: 78upx;
    }

    .location-icon {
      margin-right: 8upx;
      flex-shrink: 0;
      font-size: 28upx;
      color: #42b983;
    }
    .location-sp {
      flex: 1;
      overflow: auto;
      white-space: nowrap;
    }
    .venue-msg,
    .venue-notice {
      display: inline-block;
      line-height: 2.2;
      padding: 30upx 20upx;
    }
    .bottom-bar {
      border-top: 1px solid #dfdfdf;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 98upx;
      z-index: 1;
      font-size: 24upx;
      color: #42b983;
      background-color: #fff;
    }
    .bottom-bar-btn {
      float: left;
      height: 100%;
      width: 150upx;
      padding-left: 50upx;
      padding-top: 8upx;
    }
    .bottom-bar-item {
      float: left;
      width: 298upx;
      text-align: center;
      font-size: 30upx;
      margin-top: 30upx;
      span {
        font-size: 36upx;
      }
    }
    .item-rigth {
      border-right: 1px solid #dfdfdf;
    }
    .last1 {
      border-right: 1px solid #dfdfdf;
    }

    .position-btn {
      flex: 2;
      font-size: 32upx;
      background-color: #42b983;
      color: #fff;
    }
    .position-btn.disable {
      background-color: #c7c7c7;
    }
    .venue-btn-icon {
      font-size: 48upx;
    }
    .venue-header {
      padding: 15upx 30upx;
      text-align: center;
    }
    .venue-name {
      text-align: left;
      margin-bottom: 30upx;
      color: #000;
      font-size: 40upx;
    }
    .recruit-hold-dateTime {
      text-align: left;
      margin-bottom: 20upx;
    }
    .venue-hold-dateTime,
    .venue-hold-location {
      font-size: 26upx;
    }
    .venue-hold-dateTime {
      margin-bottom: 20upx;
      text-align: left;
    }
    .venue-tip-header {
      padding: 28upx 0;
      text-align: center;
      color: #000;
      font-size: 32upx;
    }
    .venue-container {
      /deep/ img {
        max-width: 100%;
      }
    }
  }
  .cont_title {
    margin-top: 20upx;
    height: 102upx;
    padding: 28upx 20upx;
    display: flex;
    align-items: center;
    font-size: 32upx;
    background-color: #fff;
    .cont_title_t1 {
      display: flex;
      align-items: center;
    }
    .cont_title_t2 {
      color: #999;
      font-size: 28upx;
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }
  .cont_title1 {
    margin-top: 0;
  }
  .cont_title_no {
    margin-top: 0;
  }
  .gengduo_icon {
    width: 28upx;
    height: 52upx;
  }
  .cont_title_icon {
    width: 32upx;
    height: 32upx;
    margin-right: 10upx;
  }
  .venue-ul {
    font-size: 32upx;
  }
  .venue-li {
    margin-bottom: 20upx;
    padding: 0 20upx;
    background-color: #fff;
  }
  .venue-li:last-child {
    margin-bottom: 0;
  }
  .venue-avatar {
    width: 80upx;
    height: 80upx;
    margin-right: 20upx;
  }
  .venue-profile {
    padding: 30upx 0;
    display: flex;
    align-items: center;
  }
  .venue-subject {
    margin-bottom: 14upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .org-detail-desc {
    height: 32upx;
    display: flex;
    align-items: center;
    font-size: 24upx;
    color: #999;
  }
  .org-type {
    padding-right: 20upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .org-scale {
    flex: 1;
    padding-left: 20upx;
  }
  .venue-details {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
  .venue-address {
    padding: 30upx 0;
    display: flex;
    align-items: center;
  }
  .address-sp {
    margin: 0 10upx;
    flex: 1;
    font-size: 28upx;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stand-id {
    color: #42b983;
  }
  .icon-canhuiqiye,
  .icon-zaizhaozhiwei {
    display: inline-block;
    margin-right: 16upx;
  }
  .none-tips {
    float: left;
    font-size: 24upx;
    padding-right: 10upx;
  }
  .org-category {
    float: left;
    padding-left: 10upx;
    padding-right: 10upx;
    height: 24upx;
    line-height: 24upx;
    margin-top: 0upx;
    border-right: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
  }
  .org-scale {
    float: left;
    padding-left: 10upx;
  }
</style>

<style lang="scss">
  .venue-msg section,
  .venue-msg h1,
  .venue-msg h2,
  .venue-msg h3,
  .venue-msg h4,
  .venue-msg h5,
  .venue-msg h6,
  .venue-msg span,
  .venue-msg div,
  .venue-msg p,
  .venue-msg header,
  .venue-msg footer,
  .venue-msg code {
    font-size: 28upx !important;
  }
  .venue-msg img {
    max-width: 100%;
  }
</style>
