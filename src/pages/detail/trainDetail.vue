<template>
  <div class="train-detail">
    <header>
      <div class="train-bgImg-wrapper">
        <img v-if="trainData.trainImg" :src="trainData.trainImg+'/750x422'" class="train-bgImg">
      </div>

      <user-org-box :dataOrg="dataOrg" :isTopNum0="true" :dataLocation="dataLocation"></user-org-box>
    </header>

    <footer class="train-summary">

      <!-- <div :class="fixedHeader" id="fixedHeaderRoot"> -->
      <my-tabs :list="['简介', '目录']" :init="tabActive" @change="onTabsClick"></my-tabs>
      <!-- </div> -->

      <div class="train-summary-detail" v-if="tabActive == 0">
        <!--  #ifdef H5 -->
        <p v-html="trainData.introStr"></p>
        <!--  #endif -->
        <!--  #ifdef MP-WEIXIN -->
        <rich-text :nodes="trainData.introStr"></rich-text>
        <!--  #endif -->
      </div>
      <ul class="position-recruit-ul" v-if="tabActive == 1">
        <div v-if="isNoData" class="on-data-text">暂无目录</div>
        <li class="scale-1px-bottom" v-for="(item,idx) in trainMlList" :key="idx">
          <span :style="item.state == 3 ? 'color: #999;' : ''" class="title-ml" @click="onMlS1(idx)"><span class="title-ml-text">[{{idx > 8 ? '' : 0}}{{idx + 1}}] {{item.trainResourceTitle}}</span></span>
          <div v-if="item.isSelect">
            <span :style="itemChapter.state == 3 ? 'color: #999;' : ''" v-for="(itemChapter,idxChapter) in item.listChapter" :key="idxChapter.courseChapterId" :class="idxChapter!=0?'scale-1px-top':''" class="children-j">
              <span :class="stateIconList[itemChapter.state]"></span>
              第{{idxChapter+1}}节 {{itemChapter.courseChapterTitle}}</span>
          </div>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import userOrgBox from '../../components/userOrgBox'
import myTabs from '../../components/myTabs'
import Train from '../../api/modules/train'

import { wxShare, getAppVersion, isWxBrowser } from '../../utils/utils'
export default {
  components: {
    myTabs, userOrgBox
  },
  data() {
    return {
      tabActive: 0,
      trainId: "",
      dataLocation: {},
      dataOrg: {},
      trainData: {},
      trainMlList: [],
      isNoData: false,
      title: "",
      stateIconList: [
        "",
        "iconfont-state iconfont icon-weixuanzhong iconweixuanzhong",
        "iconfont-state iconfont icon-weiwancheng iconweiwancheng",
        "iconfont-state iconfont icon-yiwancheng iconyiwancheng"
      ]
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    },
    fixedHeader() {
      return [`train-tab`, this.headerFixed ? ` isFixed` : ``];
    }
  },
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    return {
      title: this.title,
      path: "/pages/train/detail?trainId=" + this.trainId
    }
  },
  // #endif
  onLoad(options) {
    this.trainId = options.trainId;
    this.getTrainIdDetail();
    this.getTrainMl();
  },
  onShow() {
    // #ifdef H5
    if (getAppVersion() === "android" && isWxBrowser()) {
      this.$store.dispatch("weiXinSigning", this.$store.state.configData.wxAppId);
    }
    // #endif
    if (this.title) {
      this.$updateNavbarTitle(this.title);
    }
  },
  methods: {
    onTabsClick(index) {
      this.tabActive = index;
    },

    onMlS1(index) {
      let isSelectS1 = this.trainMlList[index].isSelect;
      this.trainMlList.forEach(val => {
        val.isSelect = false;
      });
      this.trainMlList[index].isSelect = !isSelectS1;
    },

    getTrainIdDetail() {
      Train.getQueryTrainAdmin(this.trainId).then(res => {
        res.trainImg = res.trainImg ? this.configData.imgDomain + res.trainImg : this.configData.imgDomain + '/default/cdwork/train.jpg';
        res.org.orgLogoStr = res.org.orgLogo ? this.configData.imgDomain + res.org.orgLogo + "/100x100" : '/static/img/user/orgLogo.png';
        this.dataOrg = { orgId: res.orgId, ...res.org };
        if (res.trainType == 1 || res.trainType == 3) {
          this.dataLocation = {
            province: res.province,
            city: res.city,
            district: res.district,
            street: res.street,
            lat: res.lat,
            lng: res.lng
          }
        }
        this.title = res.trainTitle;
        this.$updateNavbarTitle(this.title);
        res.introStr = this.$escape2Html(res.intro);
        this.trainData = res;

        // #ifdef H5
        setTimeout(() => {
          let ShareConfig = {};
          ShareConfig.title = res.trainTitle;
          ShareConfig.link = location.href;
          ShareConfig.imgUrl = res.trainImg + "/100x100";
          let _str_ = decodeURIComponent(res.intro).replace(/<\/?.+?>/g, "");
          let _desc_ = _str_.replace(/ /g, "").replace(/&nbsp;/g, "");
          ShareConfig.desc = _desc_;
          wxShare(ShareConfig);
        }, 1000);
        // #endif

      })
    },
    getTrainMl() {
      let dataObject = { pageSize: 99, pageNum: 1, trainId: this.trainId, sortBy: true, sortField: "sort" };
      // #ifdef H5
      dataObject.isXcx = 0;
      // #endif
      // #ifdef MP-WEIXIN
      dataObject.isXcx = 1;
      // #endif
      Train.trainResourceList(dataObject).then(res => {
        if (res.result.length == 0) {
          this.isNoData = true;
          return;
        }
        res.result.forEach(val => {
          val.isSelect = false;
        });
        this.trainMlList = res.result;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .tips-min {
    font-size: 24upx;
    margin-left: 10upx;
  }
  .train-detail {
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
    .train-tab {
      position: -webkit-sticky;
      position: sticky;
      top: -2px;
      left: 0;
      z-index: 0;
    }
    .position-train-grade {
      width: 710upx;
      margin: auto;
      align-items: center;
      padding: 12upx 0;
      margin-bottom: 20upx;
      font-size: 24upx;
      color: #999;
      background-color: #fff;
    }
    .position-train-stars {
      flex: 1;
      line-height: 60upx;
      font-size: 26upx;
    }
    .position-train-stars-icon {
      width: 17px;
      height: 17px;
      margin-right: 5px;
      display: inline-block;
      color: rgb(255, 174, 0);
    }
    .train-summary-content,
    .train-address-ul {
      margin-bottom: 80upx;
    }
    .train-address-li {
      display: flex;
      margin-bottom: 40upx;
      font-size: 28upx;
      color: #999;
    }
    .train-address-li:last-child {
      margin-bottom: 0;
    }
    .location-icon {
      font-size: 28upx;
      margin-top: 4upx;
      flex-shrink: 0;
      margin-right: 6upx;
      color: #999;
    }
    .train-basic {
      display: flex;
      margin-bottom: 40upx;
    }
    .train-basic:last-child {
      margin-bottom: 0;
    }
    .train-basic-message {
      font-size: 28upx;
      color: #000;
    }
    .train-basic-item {
      width: 160upx;
      color: #999;
    }
    .train-basic-content {
      width: 550upx;
    }
    .train-summary-header {
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
    .train-profile {
      height: 32upx;
      display: flex;
      align-items: center;
      font-size: 24upx;
      color: #999;
    }
    .train-category {
      float: left;
      padding-left: 10upx;
      padding-right: 10upx;
      height: 24upx;
      line-height: 24upx;
      margin-top: 0upx;
      border-right: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
    }
    .train-scale {
      float: left;
      padding-left: 10upx;
    }

    .stars-rater {
      margin-left: 10upx;
    }
    .train-stars-icon {
      width: 17px;
      height: 17px;
      margin-right: 5px;
    }
    .train-stars-icon:last-child {
      margin-right: 0;
    }

    .train-bgImg-wrapper {
      position: relative;
      padding-top: 56.25%;
      background-color: #fff;
    }
    .train-bgImg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .train-detail-panel {
      display: flex;
      align-items: center;
      padding: 20upx;
      background-color: #fff;
    }
    .train-avatar {
      width: 100upx;
      height: 100upx;
      margin-right: 20upx;
    }
    .train-detail {
      background-color: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 6upx;
    }
    .train-name-wrap {
      padding-top: 6upx;
      margin-bottom: 20upx;
      font-size: 32upx;
    }
    .none-tips {
      float: left;
      font-size: 24upx;
      padding-right: 10upx;
    }

    .train-name {
      margin-bottom: 14upx;
      font-size: 32upx;
      width: 600upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .train-summary {
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
    .train-summary-detail {
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
    position: relative;
  }
  .title-ml {
    display: block;
    font-size: 30upx;
    color: #000;
    height: 88upx;
    line-height: 88upx;
  }
  .children-z,
  .children-j {
    display: block;
    font-size: 28upx;
    color: #000;
    line-height: 88upx;
    height: 88upx;
    width: 700upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .children-j {
    display: block;
    font-size: 26upx;
  }
  .icon-weixuanzhong {
    color: #999;
  }
  .icon-yiwancheng {
    color: #999;
  }
  .icon-weiwancheng {
    color: #42b983;
  }
  .iconfont-state {
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
    width: 680upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tips-dc {
    padding: 0 8upx;
    font-size: 26upx;
    border: 1px solid #42b983;
    border-radius: 8upx;
    color: #42b983;
  }
</style>