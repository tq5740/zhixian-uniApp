<template>
  <div class="userDetails">
    <div class="user_info scale-1px-bottom">
      <div class="padding_b_20 user_info_title">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-jibenxinxi iconjibenxinxi"></i>
          </span>
          <span class="title">基本信息</span>
        </div>
      </div>
    </div>
    <div class="user_info">
      <div class="user_info card">
        <div class="list">
          <div class="list_box">
            <div class="con_img">
              <img class="con_img" :src="imgSrcDomain+userData.photo" v-if="userData.photo">
              <img class="con_img" src="/static/img/user/photo.png" v-else>
            </div>
            <div class="con_info">
              <div class="con_text1">
                <div class="con_text1_name">{{userData.userName||"-"}}</div>
                <div class="con_text1_sex">
                  <i class="iconfont zx-svg con_text1_sex icon-nan- iconnan-" v-if="userData.sex == 1"></i>
                  <i class="iconfont zx-svg con_text1_sex icon-nv- iconnv-" v-if="userData.sex == 2"></i>
                </div>
              </div>
              <div class="con_text1 con_text2">
                <div class="con_text2_tag" style="color: #000">{{isBirthDate||"-"}}岁 | {{userData.education||"-"}} | {{isStartWorkYear||"-"}}年经验</div>
              </div>
            </div>
          </div>
        </div>

        <div class="user_info_span" :class="userData.tag ? 'scale-1px-bottom' : ''">
          <div class="div">
            <span class="tips1">联系电话</span>
            <span class="spanborder" @click="toPhone(userData.phone)">{{userData.phone||"-"}}</span>
          </div>

          <div class="div">
            <span class="tips1">所在地区</span>
            <span class="tips2" v-if="userData.city == '市辖区'">{{userData.province||""}} - {{userData.district||""}}</span>
            <span class="tips2" v-else>{{userData.city||""}} - {{userData.district||""}}</span>
          </div>

        </div>
      </div>
      <div class="user_tag">
        {{userData.tag||""}}
      </div>
    </div>

    <div class="user_info margin_t_20" v-if="userData.userEduList && userData.userEduList.length">
      <div class="padding_b_20 user_info_title" :class="{'scale-1px-bottom': (userData.userEduList && userData.userEduList.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-jiaoyujingli iconjiaoyujingli"></i>
          </span>
          <span class="title">教育经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.userEduList && userData.userEduList.length">
        <div class="workUndergo_box" :class="userData.userEduList.length > 1 ? 'scale-1px-bottom' : ''" v-for="item in userData.userEduList" :key="item.eduUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startDate}} - {{item.endDate}}</div>
            <div class="workUndergo_box_name">{{item.schoolName}}</div>
            <div class="text_t1">{{item.majorName}}{{item.majorName && item.education ? "-" : ""}}{{pickerColumnsArr[3][item.education]}}</div>
            <img class="edu-img" v-if="item.certificate" :src="imgSrcDomain+item.certificate" alt="">
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="user_info margin_t_20" v-if="userData.userWorkList && userData.userWorkList.length">
      <div class="padding_b_20 user_info_title" :class="{'scale-1px-bottom': (userData.userWorkList && userData.userWorkList.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-gongzuojingli icongongzuojingli"></i>
          </span>
          <span class="title">工作经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.userWorkList && userData.userWorkList.length">
        <div class="workUndergo_box" :class="userData.userWorkList.length > 1 ? 'scale-1px-bottom' : ''" v-for="item in userData.userWorkList" :key="item.workUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startDate}} - {{item.endDate}}</div>
            <div class="workUndergo_box_name">{{item.orgName}}</div>
            <div class="text_t2">{{item.workCastegoryTitle}}</div>
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="user_info margin_t_20" v-if="userData.userTrainList && userData.userTrainList.length">
      <div class="padding_b_20 user_info_title" :class="{'scale-1px-bottom': (userData.userTrainList && userData.userTrainList.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-peixunjingli iconpeixunjingli"></i>
          </span>
          <span class="title">培训经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.userTrainList && userData.userTrainList.length">
        <div class="workUndergo_box" :class="userData.userTrainList.length > 1 ? 'scale-1px-bottom' : ''" v-for="item in userData.userTrainList" :key="item.trainUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startMonth}} - {{item.endMonth}}</div>
            <div class="workUndergo_box_name">{{item.project}}</div>
            <div class="text_t1">{{item.institutionName}}</div>
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="user_info margin_t_20" v-if="intention">
      <div class="padding_b_20 user_info_title scale-1px-bottom">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-qiuzhiyixiang iconqiuzhiyixiang"></i>
          </span>
          <span class="title">求职意向</span>
        </div>
      </div>
      <div class="user_info_span li-sp">
        <div class="div" v-if="intention.workTitleArr.length">
          <span class="tips1">工作职位</span>
          <span class="tips2" v-for="(item, index) in intention.workTitleArr" :key="index">{{item}}；</span>
        </div>

        <div class="div" v-if="intention.salary">
          <span class="tips1">期望薪资</span>
          <span class="tips2">{{intention.salary}}元</span>
        </div>

        <div class="div" v-if="intention.availableTime && intention.availableTime > -1">
          <span class="tips1">到岗时间</span>
          <span class="tips2">{{pickerColumnsArr[2][intention.availableTime-1]}}</span>
        </div>

        <div class="div" v-if="intention.workNature && intention.workNature > -1">
          <span class="tips1">工作性质</span>
          <span class="tips2">{{pickerColumnsArr[4][intention.workNature]}}</span>
        </div>
      </div>
    </div>

    <div class="notes-btn" v-if="false">
      下载简历
    </div>

    <div class="position-btn-bar scale-1px-top">

      <div class="position-btn-editor" style="color: #999;">
        <span class="iconfont customer-service-icon icon-goutong icongoutong"></span>
        <div>沟通</div>
      </div>

      <div class="position-btn-150">
        简历状态：<span style="color: #000;">{{notesArrState[notesStateNumber]}}</span>
      </div>

      <div class="position-btn-150baac" :style="notesStateNumber == 1 || notesStateNumber == 3 || notesStateNumber == 6 ? 'background-color: #42b983; color: #fff;' : 'background-color: #cccccc; color: #fff;'" @click="onClickPorpi">
        处理简历
      </div>
    </div>

    <div class="popr" v-if="isPopr">
		<view class="mark"  @click="isPopr=false"></view>
      <div class="list">
        <span class="item scale-1px-bottom" @click="onNotesToItem(i)" v-for="i in notesState" :key="i">{{i}}</span>
        <span class="item cancel" @click="isPopr=false">取消</span>
      </div>
    </div>

  </div>
</template>

<script>
import Work from "../../../../api/modules/work";
import User from "../../../../api/modules/user";
export default {
  data() {
    return {
      pickerColumnsArr: [
        ["男", "女"],
        ["在职", "离职", "在校大学生"],
        ["随时", "一周内", "一个月内", "待定"],
        ["初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
        ["全部", "全职", "兼职", "实习"],
        ["月薪", "年薪", "日薪"]
      ],
      // 1.待查阅	2.不合适 3.待面试 4.拒绝面试 5.未通过 6.待入职 7.拒绝入职
      notesArrState: ["", "待查阅", "不合适", "待面试", "拒绝面试", "未通过", "待入职", "拒绝入职"],
      notesState: [],
      userData: {},
      loading: false,
      intention: null,
      isPopr: false,

      notesStateNumber: 0,
      userId: "",
      workId: "",
      bookingId: ""
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    isBirthDate() {
      return this.$getParseAge(this.userData.birthDate);
    },
    isStartWorkYear() {
      return this.$getParseExperience(this.userData.startWorkYear);
    },
    presentDate() {
      return this.$formatDate(new Date().getTime(), "YYYY-MM-DD");
    }
  },
  methods: {
    onNotesToItem(item) {
      let state = 0;
      if (item == "不合适") {
        state = 2;
      } else if (item == "入职") {
        state = 8;
      } else if (item == "未入职") {
        state = 7;
      } else if (item == "邀请面试") {
		   this.isPopr = false;
        uni.navigateTo({          url:
            "/pages/manage/recruit/booking/detail?userId=" + this.userId +
            "&workId=" + this.workId + "" +
            "&bookingId=" + this.bookingId +
            "&phone=" + this.userData.phone +
            "&type=1"
        });
        return;
      } else if (item == "邀请入职") {
		   this.isPopr = false;
        uni.navigateTo({          url:
            "/pages/manage/recruit/booking/detail?userId=" + this.userId +
            "&workId=" + this.workId + "" +
            "&bookingId=" + this.bookingId +
            "&phone=" + this.userData.phone +
            "&type=2"
        });
        return;
      }
      Work.updateBooking({ phone: this.userData.phone, bookingId: this.bookingId, workId: this.workId, userId: this.userId, state }).then(res => {
        this.$toast("简历已修改！");
        this.isPopr = false;
        this.notesStateNumber = state;
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 2000);
      })

    },
    toPhone(tel) {
      uni.makePhoneCall({
        phoneNumber: tel
      });
    },
    onClickPorpi() {
      if (this.notesStateNumber == 1 || this.notesStateNumber == 3 || this.notesStateNumber == 6) {
        this.isPopr = true;
      }
    }
  },
  onLoad(options) {
    this.userId = options.userId;
    this.workId = options.workId;
    this.bookingId = options.bookingId;
    this.notesStateNumber = options.state;
    if (this.notesStateNumber == 1) {
      this.notesState = ["不合适", "邀请面试"];
    } else if (this.notesStateNumber == 3) {
      this.notesState = ["未通过", "邀请入职"];
    } else if (this.notesStateNumber == 6) {
      this.notesState = ["入职", "未入职"];
    }
    this.$updateNavbarTitle("个人简历");
    let data = {
      userId: options.userId
    };
    // 求职意向
    Work.getQueryIntention(data).then(res => {
      this.intention = res ? res : {};
      this.intention.workTitleArr = res ? JSON.parse(res.workTitle) : [];
    })
    // 用户档案
    User.getUserArchives(data).then(res => {
      this.userData = res;
      this.userData.photo === null ? 0 : this.userData.photo;
      if (this.userData.userWorkList && this.userData.userWorkList.length) {
        let len = this.userData.userWorkList.length;
        for (let i = 0; i < len; i++) {
          this.userData.userWorkList[i].startDate = this.userData.userWorkList[i].startDate.replace("-", ".");
          this.userData.userWorkList[i].endDate = this.userData.userWorkList[i].endDate.replace("-", ".");
        }
      }
      if (this.userData.userEduList && this.userData.userEduList.length) {
        let len = this.userData.userEduList.length;
        for (let i = 0; i < len; i++) {
          this.userData.userEduList[i].startDate = this.userData.userEduList[i].startDate.replace("-", ".");
          this.userData.userEduList[i].endDate = this.userData.userEduList[i].endDate.replace("-", ".");
        }
      }
      if (this.userData.userTrainList && this.userData.userTrainList.length) {
        let len = this.userData.userTrainList.length;
        for (let i = 0; i < len; i++) {
          this.userData.userTrainList[i].startMonth = this.userData.userTrainList[i].startMonth.replace("-", ".");
          this.userData.userTrainList[i].endMonth = this.userData.userTrainList[i].endMonth.replace("-", ".");
        }
      }
      this.userData.education = this.pickerColumnsArr[3][this.userData.education - 1];
      this.userData.workState = this.pickerColumnsArr[1][this.userData.workState - 1];
      this.userData.availableTime = this.pickerColumnsArr[2][this.userData.availableTime - 1];
    })
  }
}
</script>
<style lang="scss" scoped>
  .popr {
	.mark{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.6);
	}
    .list {
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: #f2f2f2 !important;
    }
    .item {
      display: inline-block;
      height: 87upx;
      line-height: 87upx;
      text-align: center;
      font-size: 32upx;
      width: 100%;
      background-color: #fff;
    }
    .cancel {
      margin-top: 20upx;
    }
  }
  .position-btn-bar {
    width: 100%;
    height: 98upx;
    position: fixed;
    bottom: 0;
    background-color: #fff;
    .icongoutong {
      font-size: 48upx;
    }
    .position-btn-editor {
      padding-top: 8upx;
      float: left;
      text-align: center;
      width: 150upx;
      height: 100%;
      font-size: 24upx;
      color: #42b983;
    }
    .position-btn-150 {
      float: left;
      text-align: center;
      width: 300upx;
      height: 100%;
      line-height: 98upx;
      font-size: 30upx;
      color: #999999;
      border-left: 1px solid #d8d8d8;
    }
    .position-btn-150baac {
      float: left;
      text-align: center;
      width: 300upx;
      height: 100%;
      line-height: 98upx;
      font-size: 30upx;
      color: #999;
      background-color: #f2f2f2;
    }
  }
  .userDetails {
    background-color: #f2f2f2;
    min-height: 100%;
    padding-bottom: 98upx;
    .txtBr {
      white-space: normal;
      word-break: break-all;
    }
    .ellipsis {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/ .van-switch--on {
      background-color: #42b983;
    }
    font-size: 24upx;
    .H30 {
      height: 30upx;
    }
    .inline_block {
      display: inline-block;
    }
    .black666 {
      color: #666;
    }
    .flexNone {
      display: none;
    }
    .bg {
      background: #ccc !important;
    }
    .padding_b_20 {
      padding-bottom: 20upx;
    }
    .padding_l_20 {
      padding-left: 20upx;
    }
    .margin_t_20 {
      margin-top: 20upx;
    }
    .margin_b_20 {
      margin-bottom: 20upx;
    }
    .margin_l_20 {
      margin-left: 20upx;
    }
    .margin_r_20 {
      margin-right: 20upx;
    }
    .phone {
      color: #000;
    }
    .con_text1_sex {
      font-size: 24upx;
      margin-left: 6upx;
      img {
        width: 100%;
      }
    }
    .edit_icon {
      font-size: 26upx;
      position: relative;
      display: inline-block;
      margin-left: 6upx;
    }
    .user_tag {
      background: #fff;
      margin: 30upx;
      color: #666;
      font-size: 28upx;
      padding-bottom: 30upx;
    }
    .user_info {
      font-size: 28upx;
      background: #fff;
      height: 100%;
      .card {
        margin-bottom: 10upx;
      }
      .user_info_title {
        position: relative;
        padding: 30upx;
        .text_title {
          font-size: 32upx;
          margin-left: 0upx;
          position: relative;
          .title {
            margin-left: 46upx;
          }
          .icon {
            position: absolute;
            top: -2upx;
          }
          .edit {
            color: #666;
            font-size: 28upx;
            margin-left: auto;
            float: right;
          }
        }
      }
      .user_info_box.bgclr1 {
        background-color: #f8eedf;
      }
      .user_info_box {
        background-color: #dcf2e8;
        margin: 6upx;
        padding: 6upx;
        flex: 1;
        text-align: center;
      }
      .user_info_cont1 {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0upx 24upx;
      }
      .user_info_cont2 {
        padding-bottom: 36upx;
        .workUndergo_box {
          padding-left: 30upx;
          padding-right: 30upx;
          padding-bottom: 30upx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .edit_icon {
            margin-top: 50upx;
          }
          .workUndergo_box_name {
            width: 650upx;
            margin-top: 8upx;
            margin-bottom: 14upx;
            font-size: 34upx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .workUndergo_box_time {
            color: #666;
            width: 650upx;
            margin-top: 36upx;
            margin-bottom: 8upx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text_t1 {
            color: #666;
          }
          .text_t2 {
            color: #666;
            font-size: 24upx;
            margin-top: 8upx;
          }
        }
        .user_info_cont2_box {
          padding-bottom: 20upx;
          position: relative;
        }
        .round {
          width: 22upx;
          height: 22upx;
          border-radius: 50%;
          background: #42b983;
          display: inline-block;
          position: absolute;
          top: 0;
          bottom: 0;
          left: -50upx;
          margin: auto;
        }
        .user_info_cont_text1 {
          font-size: 30upx;
        }
        .user_info_cont2_intro {
          margin-left: 60upx;
          font-size: 30upx;
          .user_info_cont2_intro_t1 {
            position: relative;
          }
          .user_info_cont2_intro_t3 {
            margin-bottom: 30upx;
            font-size: 28upx;
          }
          .user_info_cont2_intro_t4 {
            font-size: 28upx;
          }
        }
      }
    }
    .list {
      font-size: 24upx;
      background: #fff;
      .list_box {
        display: flex;
        padding: 30upx 0upx;
        padding-left: 30upx;
        padding-bottom: 24upx;
        .con_img {
          width: 100upx;
          height: 100upx;
          border-radius: 100%;
          margin-right: 20upx;
          img {
            width: 100%;
            width: 100%;
          }
        }
        .con_info {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: space-between;
          .con_text1 {
            width: 100%;
            display: flex;
            align-items: center;
            .con_text1_name {
              font-size: 40upx;
              max-width: 150upx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .con_text2 {
            .con_text2_tag {
              color: #666;
              font-size: 26upx;
              padding-right: 20upx;
            }
          }
        }
      }
    }
    .isOpen {
      background-color: #f2f2f2;
      padding: 20upx;
      height: 90upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .isOpen_left {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .isOpen_left_1 {
          font-size: 32upx;
        }
        .isOpen_left_2 {
          font-size: 24upx;
          color: #999;
        }
      }
    }
  }
  .user_info_span {
    padding-bottom: 20upx;
    font-size: 28upx;
    color: rgb(102, 102, 102);
    .div {
      margin-left: 30upx;
    }
    .tips1 {
      display: inline-block;
      margin-right: 50upx;
      margin-top: 10upx;
      margin-bottom: 10upx;
    }
    .tips2 {
      color: #000;
    }
  }
  .spanborder {
    color: #42b983;
  }
  .li-sp {
    padding-top: 20upx;
    padding-bottom: 20upx;
  }
  .icon-nan- {
    color: #1296db;
  }
  .icon-nv- {
    color: #ff75a9;
  }
  .edu-img {
    width: 355upx;
    height: 200upx;
    margin-top: 20upx;
    margin-bottom: 10upx;
  }
  .notes-btn {
    width: 100%;
    height: 98upx;
    line-height: 98upx;
    text-align: center;
    font-size: 32upx;
    color: #fff;
    background-color: #42b983;
    position: fixed;
    bottom: 0;
  }
</style>
