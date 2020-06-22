<template>
  <div class="live-detail">
    <header class="header-box">
      <div class="live-bgImg-wrapper">
        <img v-if="liveData.liveImg" :src="liveData.liveImg+'/750x422'" class="live-bgImg">
      </div>
      <user-org-box :dataOrg="dataOrg" :isTopNum0="true"></user-org-box>
    </header>

    <footer class="live-summary">

      <!-- <div :class="fixedHeader" id="fixedHeaderRoot"> -->
      <my-tabs :list="['简介', '目录']" :init="tabActive" @change="onTabsClick"></my-tabs>
      <!-- </div> -->

      <div class="live-summary-detail" v-if="tabActive == 0">
        <!--  #ifdef H5 -->
        <p v-html="liveData.introStr"></p>
        <!--  #endif -->
        <!--  #ifdef MP-WEIXIN -->
        <rich-text :nodes="liveData.introStr"></rich-text>
        <!--  #endif -->
      </div>
      <ul class="position-recruit-ul" v-if="tabActive == 1">
        <div v-if="isNoData" class="on-data-text">暂无目录</div>
        <span v-for="(item, idx) in liveMlList" :key="idx" :style="item.state == 2 ? 'color: #FC703E' : item.state == 4 ? 'color: #000000' : ''" :class="idx!=0?'scale-1px-top':''" class="children-j">
          <span class="text-ml-title2" :style="{color:item.state == 1 ? '#999' : '#000000'}">{{idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}}</span> <span class="text-ml-title text-ml-title1">{{item.liveChapterTitle}}</span>
          <span class="text-ml-title2" style="color: #FC703E" v-if="item.state == 2">
            直播中<span class="iconfont icon-zhibozhong iconzhibozhong" style="margin-left: 5px; color: #FC703E"></span>
          </span>
          <span class="text-ml-title2" v-if="item.state == 4">
            看录播<span class="iconfont icon-lubo iconlubo" style="margin-left: 5px;"></span>
          </span>
          <span class="text-ml-title2" style="color: #999999; margin-left: -12px;" v-if="item.state == 3">
            直播结束<span class="iconfont icon-zhibozhong iconzhibozhong" style="margin-left: 4px; color: #999999"></span>
          </span>
          <span class="text-ml-title2" style="color: #999999; margin-left: -12px;" v-if="item.state == 5">
            录播结束<span class="iconfont icon-lubo iconlubo" style="margin-left: 4px; color: #999999"></span>
          </span>
          <span class="text-ml-title3" v-if="item.state == 1">
            {{item.startTimeStr}}
          </span>
        </span>
      </ul>
    </footer>
  </div>
</template>

<script>
import userOrgBox from '../../components/userOrgBox'
import myTabs from '../../components/myTabs'
import Live from '../../api/modules/live'
import { numRandom, wxShare, getAppVersion, isWxBrowser } from '../../utils/utils'
export default {
  components: {
    myTabs, userOrgBox
  },
  data() {
    return {
      tabActive: 0,
      liveId: "",
      dataOrg: {},
      liveData: {},
      liveMlList: [],
      isNoData: false,
      title: ""
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    },
    fixedHeader() {
      return [`live-tab`, this.headerFixed ? ` isFixed` : ``];
    }
  },
  onLoad(options) {
    this.liveId = options.liveId;
    this.getLiveDetail();
  },
  beforeDestroy() {

  },
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    return {
      title: this.title,
      path: "/pages/live/detail?liveId=" + this.liveId
    }
  },
  // #endif
  onShow() {
    // #ifdef H5
    if (getAppVersion() === "android" && isWxBrowser()) {
      this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
    }
    // #endif
    this.getLiveChapter();
    if (this.title) {
      this.$updateNavbarTitle(this.title);
    }
  },
  methods: {
    getLiveDetail() {
      Live.getQueryLiveAdmin(this.liveId).then(res => {
        res.liveImg = res.liveImg ? this.configData.imgDomain + res.liveImg : this.configData.imgDomain + '/default/cdwork/live.jpg';
        res.introStr = this.$escape2Html(res.intro);
        res.org.orgLogoStr = res.org.orgLogo ? this.configData.imgDomain + res.org.orgLogo + "/100x100" : '/static/img/user/orgLogo.png';
        this.dataOrg = { ...res.org, orgId: res.orgId };
        this.$updateNavbarTitle(res.liveTitle);
        this.title = res.liveTitle;
        this.liveData = res;

        // #ifdef H5
        setTimeout(() => {
          let ShareConfig = {};
          ShareConfig.title = res.liveTitle;
          ShareConfig.link = location.href;
          ShareConfig.imgUrl = res.liveImg + "/100x100";
          let _str_ = decodeURIComponent(res.intro).replace(/<\/?.+?>/g, "");
          let _desc_ = _str_.replace(/ /g, "").replace(/&nbsp;/g, "");
          ShareConfig.desc = _desc_;
          wxShare(ShareConfig);
        }, 1000);
        // #endif
      })
    },
    getLiveChapter() {
      Live.getLiveChapterList({ liveId: this.liveId }).then(res => {
        if (!res.length) {
          this.isNoData = true;
        }
        res.forEach(item => {
          item.startTimeStr = this.$formatDate(item.startTime, "MM月DD日 hh:mm");
        });
        this.liveMlList = res;
      })
    },
    onTabsClick(index) {
      this.tabActive = index;
    }
  }
}
</script>
<style lang="scss" scoped>
  .tips-min {
    font-size: 24upx;
    margin-left: 10upx;
  }
  .live-detail {
    min-height: 100%;
    background-color: #fff;
    padding-bottom: 104upx;
    .isFixed {
      position: fixed;
      top: 0;
      left: 0;
      height: 50upx;
      width: 100%;
      z-index: 0;
    }
    .live-tab {
      position: -webkit-sticky;
      position: sticky;
      top: -2px;
      left: 0;
      z-index: 0;
    }
    .position-live-grade {
      width: 710upx;
      margin: auto;
      align-items: center;
      padding: 12upx 0;
      margin-bottom: 20upx;
      font-size: 24upx;
      color: #999;
      background-color: #fff;
    }
    .position-live-stars {
      flex: 1;
      line-height: 60upx;
      font-size: 26upx;
    }
    .position-live-stars-icon {
      width: 17px;
      height: 17px;
      margin-right: 5px;
      display: inline-block;
      color: rgb(255, 174, 0);
    }
    .live-summary-content,
    .live-address-ul {
      margin-bottom: 80upx;
    }
    .live-address-li {
      display: flex;
      margin-bottom: 40upx;
      font-size: 28upx;
      color: #999;
    }
    .live-address-li:last-child {
      margin-bottom: 0;
    }
    .location-icon {
      font-size: 28upx;
      margin-top: 4upx;
      flex-shrink: 0;
      margin-right: 6upx;
      color: #999;
    }
    .live-basic {
      display: flex;
      margin-bottom: 40upx;
    }
    .live-basic:last-child {
      margin-bottom: 0;
    }
    .live-basic-message {
      font-size: 28upx;
      color: #000;
    }
    .live-basic-item {
      width: 160upx;
      color: #999;
    }
    .live-basic-content {
      width: 550upx;
    }
    .live-summary-header {
      display: flex;
      align-items: center;
      margin-bottom: 50upx;
      font-size: 30upx;
      color: #000;
    }
    .horizontal-line {
      border-bottom: 1px solid #d8d8d8;
      flex: 1;
      margin-left: 30upx;
    }
    .position-btn-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 32upx;
      color: #fff;
    }
    .position-btn-close,
    .position-btn-publish {
      padding: 32upx 0;
      text-align: center;
    }
    .position-btn-close,
    .position-btn-publish {
      background-color: #42b983;
    }
    .position-btn-publish.disable {
      background-color: #e8e8e8;
    }
    .position-btn-pending {
      display: flex;
      background-color: #f5f5f5;
      height: 98upx;
    }
    .position-btn-editor {
      border-right: 1px solid rgb(216, 216, 216);
      align-items: center;
      padding: 10upx 50upx;
      color: #42b983;
      font-size: 24upx !important;
    }
    .customer-service-icon {
      font-size: 40upx !important;
      margin-left: 6upx;
    }
    .position-btn-empty {
      flex: 0.49333;
    }
    .position-btn-publish {
      flex: 1;
    }
    .position-btn-publish.unExsit {
      background-color: #ccc;
    }
    .live-profile {
      height: 32upx;
      display: flex;
      align-items: center;
      font-size: 24upx;
      color: #999;
    }
    .live-category {
      float: left;
      padding-left: 10upx;
      padding-right: 10upx;
      height: 24upx;
      line-height: 24upx;
      margin-top: 0upx;
      border-right: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
    }
    .live-scale {
      float: left;
      padding-left: 10upx;
    }

    .stars-rater {
      margin-left: 10upx;
    }
    .live-stars-icon {
      width: 17px;
      height: 17px;
      margin-right: 5px;
    }
    .live-stars-icon:last-child {
      margin-right: 0;
    }

    .live-bgImg-wrapper {
      position: relative;
      padding-top: 56.25%;
      background-color: #fff;
    }
    .live-bgImg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .live-detail-panel {
      display: flex;
      align-items: center;
      padding: 20upx;
      background-color: #fff;
    }
    .live-avatar {
      width: 100upx;
      height: 100upx;
      margin-right: 20upx;
    }
    .live-detail {
      background-color: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 6upx;
    }
    .live-name-wrap {
      padding-top: 6upx;
      margin-bottom: 20upx;
      font-size: 32upx;
    }
    .none-tips {
      float: left;
      font-size: 24upx;
      padding-right: 10upx;
    }

    .live-name {
      margin-bottom: 14upx;
      font-size: 32upx;
      width: 600upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .live-summary {
      width: 100%;
      color: #000;
      background-color: #fff;
    }
    .position-recruit-li {
      display: flex;
      flex-direction: column;
      padding: 30upx 20upx;
    }
    .position-salary {
      color: #fc703e;
      font-size: 32upx;
    }
    .live-summary-detail {
      min-height: 98upx;
      padding: 30upx 20upx;
      font-size: 28upx;
      overflow-x: hidden;
      word-wrap: break-word;
    }
    .position-profile-header {
      display: flex;
      margin-bottom: 20upx;
      font-size: 30upx;
    }
    .position-name {
      flex: 1;
      margin-right: 10upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-profile-bottom {
      display: flex;
      font-size: 26upx;
      color: #333;
    }
    .position-location {
      margin-right: 20upx;
      margin-top: -8upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-degree,
    .position-experience {
      flex-shrink: 0;
      height: 24upx;
      line-height: 24upx;
      padding: 0 20upx;
      flex-shrink: 0;
    }
  }
  .on-data-text {
    background-color: #fff;
    text-align: center;
    padding: 150upx;
    font-size: 28upx;
    height: 100%;
    color: #999;
  }
  .icon-dingwei_1 {
    font-size: 28upx;
    display: inline-block;
    margin-right: 5upx;
    color: #42b983;
  }
  .icon-gengduo {
    float: right;
    font-size: 28upx;
  }
  .position-recruit-ul {
    padding: 0 20upx;
  }
  .title-ml {
    display: block;
    font-size: 32upx;
    color: #000;
    line-height: 88upx;
  }
  .children-z,
  .children-j {
    display: block;
    font-size: 28upx;
    color: #999;
    line-height: 88upx;
    height: 88upx;
  }

  .children-j {
    font-size: 26upx;
    line-height: 88upx;
  }
  .icon-weixuanzhong {
    margin-right: 10upx;
    font-size: 26upx;
  }
  .tips-ks {
    padding: 0 8upx;
    font-size: 26upx;
    border: 1px solid #ff6600;
    border-radius: 8upx;
    color: #ff6600;
  }
  .title-ml-text {
    display: inline-block;
    width: 638upx;
  }
  .tips-dc {
    padding: 0 8upx;
    font-size: 26upx;
    border: 1px solid #42b983;
    border-radius: 8upx;
    color: #42b983;
  }
  .text-ml-title {
    display: inline-block;
    width: 534upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .text-ml-title2 {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #42b983;
  }
  .text-ml-title3 {
    color: #999 !important;
    margin-left: -70upx !important;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .text-ml-title1 {
    margin: 0 12upx;
  }
</style>