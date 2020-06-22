<template>
  <div class="position-detail">
    <div v-if="!isPlaceholders">
      <header class="position-header">
        <div class="position-top-wrap border-bottom">
          <div class="position-top">
            <div class="position-name">
              <span>{{workDetailData.workTitle}}</span>
              <span class="position-name-icon" v-if="workDetailData.workNature">{{workNatureArr[workDetailData.workNature]}}</span>
            </div>
            <div class="position-dateTime">{{positionDateTime}}</div>
          </div>
          <div class="position-remuneration-wrap">
            <div class="position-remuneration" v-if="workDetailData.lowSalary== -1">
              面议
            </div>
            <div class="position-remuneration" v-if="(workDetailData.highSalary || workDetailData.lowSalary) && workDetailData.lowSalary!= -1">
              {{salary}} <span class="tips-min">元/{{workDetailData.salaryType == 1 ? "日" : "月"}}</span>
            </div>
          </div>
          <ul class="position-demand">
            <li class="position-demand-num">
              招聘人数：{{workDetailData.recruitNumber>0?'招'+workDetailData.recruitNumber+'人':'若干'}}</li>
            <li class="position-demand-degree">
              学历要求：{{education[workDetailData.education]}}</li>
            <li class="position-demand-experience">
              工作经验：{{experience[workDetailData.experience]}}</li>
          </ul>
        </div>
        <ul class="position-welfare scale-1px-top" v-if="workDetailData.welfare.length">
          <li class="position-welfare-li" v-for="value in workDetailData.welfare" :key="value">{{value}}</li>
        </ul>
      </header>

      <section class="position-address-wrapper" @click="onPositionAddressClick" v-if="addresses.length > 0">
        <div class="position-address">
          <div class="position-address-name">
            <i class="iconfont position-address-icon icondingwei_1"></i>
            <span class="position-address-profile">
              {{addresses[0].city}}{{addresses[0].district}}{{addresses[0].street}}
            </span>
          </div>
        </div>
        <i class="iconfont gengduo_icon icongengduo" style="color: #999999;"></i>
      </section>

      <user-org-box :dataOrg="dataOrg"></user-org-box>

      <div class="position-description">
        <div class="position-desc-subject scale-1px-bottom">职位描述</div>
        <div class="position-desc-content">
          <!--  #ifdef H5 -->
          <div class="text-line" v-if="workDetailData.intro" v-html="workDetailData.intro"></div>
          <!--  #endif -->

          <!--  #ifdef MP-WEIXIN -->
          <rich-text v-if="workDetailData.intro" class="text-line" :nodes="workDetailData.intro"></rich-text>
          <!--  #endif -->

          <p v-else>暂无数据</p>
        </div>
        <div style="clear: both;"></div>
      </div>

    </div>

    <div v-if="isPlaceholders">
      <placeholders></placeholders>
    </div>
  </div>
</template>

<script>
import Work from '../../api/modules/work'
import placeholders from '../../components/placeholders'
import userOrgBox from "../../components/userOrgBox"
// #ifdef H5
import { wxShare, getAppVersion, isWxBrowser } from '../../utils/utils'
// #endif
export default {
  components: {
    placeholders, userOrgBox
  },
  data() {
    return {
      isPlaceholders: true,
      dataOrg: {},
      complaintTitle: "",
      workNatureArr: ["全部", "全职", "兼职", "实习"],
      education: [
        "全部",
        "初中及以下",
        "高中",
        "中技/中专",
        "大专",
        "本科",
        "硕士",
        "博士"
      ],
      experience: ["全部", "1年", "2年", "3-4年", "5-10年", "10年以上"], //工作经验
      workDetailData: { welfare: [] },
      latitude: "",
      longitude: "",
      workId: "",
      addresses: [{}]
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.state.userInfo
    },
    configData() {
      return this.$store.state.configData;
    },
    positionDateTime() {
      return this.workDetailData.updateTime ? this.$formatDate(this.workDetailData.updateTime, 'YYYY-MM-DD') : '';
    },
    isLowSHighS() {
      return (this.workDetailData.highSalary || this.workDetailData.lowSalary) && this.workDetailData.lowSalary != -1;
    },
    salary() {
      return this.$formatSalary(this.workDetailData.lowSalary, this.workDetailData.highSalary, this.workDetailData.salaryType);
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },
  onShow() {
    // #ifdef H5
    if (getAppVersion() === "android" && isWxBrowser()) {
      this.$store.dispatch("weiXinSigning");
    }
    // #endif
  },
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    return {
      title: `${this.workDetailData.workTitle}-${this.workDetailData.org.orgName}`,
      path: "/pages/work/job/detail?workId=" + this.workId + "&workTitle=" + this.workTitle
    }
  },
  // #endif
  onLoad(options) {
    this.workId = options.workId;
    this.workTitle = options.workTitle;

    this.$nextTick(() => {
      this.queryWorkDetail();
    })

  },

  methods: {
    queryWorkDetail() {
      const workId = this.workId;
      if (!workId) return;
      const data = {
        workId: workId,
        lat: this.$store.state.pos.lat,
        lng: this.$store.state.pos.lng
      };
      Work.getWorkDetail(data).then(data => {
        this.isPlaceholders = false;
        this.$updateNavbarTitle(data.workTitle);
        const resData = data;
        this.addresses = resData.addresses;
        resData.welfare = JSON.parse(resData.welfare);
        this.workDetailData = resData;
        this.complaintTitle = data.workTitle;
        this.workDetailData.intro = resData.intro ? resData.intro.replace(/\n|\r\n/g, "<br>") : "";
        data.org.orgLogoStr = data.org.orgLogo ? this.configData.imgDomain + data.org.orgLogo + "/100x100" : '/static/img/user/orgLogo.png';
        this.dataOrg = { ...data.org, orgId: data.orgId };

        // #ifdef H5
        setTimeout(() => {
          let ShareConfig = {};
          ShareConfig.title = `${data.workTitle}-${data.orgName}`;
          ShareConfig.link = window.location.href;
          ShareConfig.imgUrl = this.$store.state.configData.imgDomain + data.orgLogo + "/100x100";
          let _str_ = data.intro.replace(/<\/?.+?>/g, "");
          let _desc_ = _str_.replace(/ /g, "").replace(/&nbsp;/g, "");
          ShareConfig.desc = _desc_;
          wxShare(ShareConfig);
        }, 1000);
        // #endif

      });
    },
    // 导航
    onPositionAddressClick() {
      if (this.addresses.length > 1) {
        uni.navigateTo({ url: "/pages/map/index?maplist=" + JSON.stringify(this.addresses) });
      } else if (this.addresses.length == 1) {
        let data = {
          latitude: new Number(this.addresses[0].lat),
          longitude: new Number(this.addresses[0].lng),
          address: this.addresses[0].province + this.addresses[0].city + this.addresses[0].district + this.addresses[0].street
        }
        this.$openLocation(data);
      } else {
        this.$toast("地址信息有误，无法导航！")
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .text-line {
    line-height: 2.2;
  }
  .position-detail {
    position: relative;
    min-height: 100%;
    background-color: #f2f2f2;
    overflow-x: hidden;
    /deep/ {
      .tip-box {
        bottom: 94upx;
        right: 50upx;
      }

      .tip-circle {
        height: 460upx;
        background: url("/static/img/guide/guideMineFirstStepImg.png") no-repeat;
        background-size: contain;
      }
      .tip-subject {
        width: 380upx;
        margin: 0 0 70upx 28upx;
      }
      .tip-subject-panel {
        bottom: 190upx;
      }
      .guide-btn {
        margin: 30upx 0 0 112upx;
      }
      .second-step {
        .tip-circle {
          background-image: url("/static/img/guide/guidePositionSecondStepImg.png");
        }
        .tip-box {
          bottom: 110upx;
          left: 102upx;
        }
        .tip-subject {
          margin: 0 0 84upx 52upx;
        }
        .guide-btn {
          margin-left: 144upx;
        }
      }
    }
    .position-detail-icon {
      font-size: 28upx;
      margin-right: 10upx;
    }
    .position-detail-icon.experience {
      width: 27upx;
      height: 27upx;
    }
    .position-address-icon {
      font-size: 30upx;
      margin-right: 10upx;
      flex-shrink: 0;
      color: #42b983;
    }
    .position-address-profile {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-address-wrapper {
      display: flex;
      align-items: center;
      padding: 30upx 20upx;
      margin-bottom: 20upx;
      background-color: #fff;
    }
    .position-header,
    .position-address,
    .position-description {
      background-color: #fff;
    }
    .position-description {
      padding-bottom: 30upx;
    }
    .position-position-header {
      height: 88upx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .horizontal-line {
      height: 2upx;
      width: 50upx;
      background-color: #d8d8d8;
    }
    .position-position-sub {
      padding: 0 20upx;
      color: #666;
      font-size: 28upx;
    }
    .position-header {
      padding: 40upx 20upx 0;
      margin-bottom: 20upx;
    }
    .position-top-wrap {
      height: 236upx;
    }
    .position-top {
      display: flex;
      height: 48upx;
      align-items: center;
    }
    .position-remuneration-wrap {
      padding: 38upx 0;
    }
    .position-name {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-right: 10upx;
      font-size: 36upx;
      color: #000;
    }
    .position-name-sp {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-name-icon {
      flex-shrink: 0;
      padding: 2upx 8upx;
      margin-left: 20upx;
      font-size: 24upx;
      background-color: #42b983;
      color: #fff;
    }
    .position-dateTime {
      font-size: 24upx;
      color: #999;
    }
    .position-remuneration {
      height: 48upx;
      font-size: 38upx;
      color: #fc703e;
    }
    .tips-min {
      font-size: 26upx;
      margin-left: 10upx;
    }
    .position-demand {
      display: flex;
      height: 64upx;
      padding-bottom: 30upx;
      font-size: 24upx;
      color: #666;
    }
    .position-demand-num,
    .position-demand-degree {
      margin-right: 30upx;
    }
    .position-demand-num,
    .position-demand-degree,
    .position-demand-experience {
      display: flex;
      align-items: center;
    }
    .position-welfare {
      min-height: 80upx;
      display: flex;
      flex-wrap: wrap;
      padding: 20upx 0 0;
      font-size: 24upx;
      color: #42b983;
    }
    .position-welfare-li {
      padding: 2upx 16upx;
      margin-bottom: 20upx;
      border: 1px solid #42b983;
      border-radius: 30upx;
      margin-right: 40upx;
    }
    .position-address {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      color: #666;
      font-size: 30upx;
    }
    .position-address-name {
      flex: 1;
      overflow: hidden;
    }
    .position-address-name {
      display: flex;
      height: 42upx;
      align-items: center;
    }
    .position-desc-subject {
      padding: 30upx 0;
      text-align: center;
      font-size: 32upx;
    }
    .position-desc-content {
      padding: 26upx 20upx;
      font-size: 28upx;
      display: block;
      /deep/ img {
        width: 100%;
      }
    }
    .position-des-tip-wrap {
      margin: 40upx 20upx 30upx;
      padding: 20upx;
      font-size: 24upx;
      color: #000;
      border: 1px dashed #42b983;
      border-radius: 6upx;
    }
    .complaint-wrap {
      text-align: right;
      font-size: 26upx;
      color: #999;
    }
    .complaint-btn {
      padding: 10upx 20upx;
      display: inline-block;
    }
    .position-des-tip-sp {
      line-height: 40upx;
    }
    .position-btn-bar {
      border-top: 1px solid #dfdfdf;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 32upx;
      color: #fff;
    }

    .position-btn-pending {
      display: flex;
      background-color: #f5f5f5;
      height: 98upx;
    }
    .position-btn-editor {
      flex: 1;
      align-items: center;
      text-align: center;
      padding-top: 10upx;
      color: #42b983;
      font-size: 28upx;
      border-right: 1upx solid rgb(216, 216, 216);
    }
    .icon-goutong {
      font-size: 40upx;
      margin-left: 8upx;
    }
    .position-btn-empty {
      flex: 1;
    }
    .position-btn-publish {
      flex: 2;
      position: relative;
      padding: 32upx 0;
      text-align: center;
    }
    .position-btn-publish-weixin {
      flex: 2;
      position: relative;
      text-align: center;
    }
    .position-btn-publish-inner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #42b983;
    }
    .position-btn-publish-inner-weixin {
      border-radius: 0;
      width: 300upx;
      border: 0;
      height: 100%;
      background-color: #42b983;
      color: #fff;
      position: absolute;
      right: 0;
      font-size: 32upx;
      line-height: 100upx;
    }
    .activated {
      background-color: #ccc;
    }
  }
</style>
