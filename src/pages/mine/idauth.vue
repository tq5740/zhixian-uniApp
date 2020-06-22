<template>
  <div class="ID-authentication">
    <div class="id-step" v-if="!contentSu">
      <div class="stepNo no1"><span>1</span>
        <p>{{stepNo1}}</p>
      </div>
      <i :class="{'line': isShowTable || authenticationStatus === 2 || authenticationStatus === 3 || authenticationStatus === 4}"></i>
      <div class="stepNo no2" :class="[{'active':isShowTable || authenticationStatus === 2 || authenticationStatus === 3 || authenticationStatus === 4}]"><span>2</span>
        <p>{{stepNo2}}</p>
      </div>
      <i :class="{'line':authenticationStatus === 2 || authenticationStatus === 3 || authenticationStatus === 4}"></i>
      <div class="stepNo no3" :class="[{'active':authenticationStatus === 3 || authenticationStatus === 4},{'activeError':authenticationStatus === 2}]">
        <span>
          <i class="iconfont step-icon iconrenzhengshibai icon-renzhengshibai" v-if="authenticationStatus === 2"></i>
          <div v-else>3</div>
        </span>
        <p>{{stepNo3[authenticationStatus === 2 ? 1 : authenticationStatus === 3 ? 0 : 2]}}</p>
      </div>
    </div>

    <div class="content" v-if="!contentSu">
      <div v-show="authenticationStatus === 1 && !isShowTable">
        <span class="tips">拍照时请确保身份证边框完整、图像清晰、光线均匀</span>
        <div @click="onUpRengXiang">
          <img :src="rengXiangSrc ? retConfigData.imgDomain + rengXiangSrc : '/static/img/user/rengxiangmian.png'" alt="">
          <span class="rengxiang" v-if="!rengXiangSrc">身份证人像面</span>
        </div>

        <div @click="onUpGuoHui">
          <img :src="guoHioSrc ? retConfigData.imgDomain + guoHioSrc : '/static/img/user/guohuimian.png'" alt="">
          <span class="guohui" v-if="!guoHioSrc">身份证国徽面</span>
        </div>
      </div>

      <div v-if="isShowTable">
        <div class="li scale-1px-bottom">
          <span class="title">姓&emsp;&emsp;名</span>
          <span class="value">{{userName}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">身份证号</span>
          <span class="value">{{IDNumber}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">性&emsp;&emsp;别</span>
          <span class="value">{{sex}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">民&emsp;&emsp;族</span>
          <span class="value">{{nation}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">出生日期</span>
          <span class="value">{{birthday}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">户籍地址</span>
          <span class="value">{{address}}</span>
        </div>
        <div class="li scale-1px-bottom">
          <span class="title">签发机关</span>
          <span class="value">{{gear}}</span>
        </div>
        <div class="li scale-1px-bottom bottom">
          <span class="title">有效期限</span>
          <span class="value">{{date}}</span>
        </div>
      </div>

      <div class="button" v-if="authenticationStatus == 1 || authenticationStatus == 2 || authenticationStatus == null" @click="onClick">
        {{buttonName}}
      </div>
      <span class="state2" v-if="authenticationStatus == 2">认证失败原因：{{reason}}</span>
      <div v-if="isShowTable && authenticationStatus == null" class="button-border" @click="onClick2">信息有误，点击重新拍照</div>
    </div>

    <div class="content-su" v-if="contentSu">
      <span class="iconfont icon-yibaoming iconyibaoming"></span>
      <div class="content-su-text">您的身份信息上传成功~</div>
      <div class="button" @click="contentSu=false">完成</div>
    </div>
	<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
  </div>
</template> 

<script>
import User from '../../api/modules/user'
import Publics from '../../api/modules/public'
import msgModal from "@/components/msgModal.vue"

export default {
  data() {
    return {
      rengXiangSrc: "",
      guoHioSrc: "",
      userName: "",
      IDNumber: "",
      sex: "",
      nation: "",
      birthday: "",
      address: "",
      gear: "",
      date: "",
      isShowTable: false,
      contentSu: false,
      buttonName: "确认",
      authData: {},
      authenticationStatus: 1,
      stepNo1: "身份证拍照",
      stepNo2: "确认信息",
      stepNo3: [
        "审核中",
        "认证失败",
        "认证成功"
      ],
      reason: ""
    }
  },
  computed: {
    retConfigData() {
      return this.$store.state.configData;
    }
  },

  onLoad() {
    this.$updateNavbarTitle("身份认证");
    User.queryUserauth({ userId: this.$store.state.userInfo.userId }).then(res => {
      this.authData = res;
      this.authenticationStatus = res ? res.state : 1;
      if (this.authenticationStatus == 1) {
        this.buttonName = "确认";
        this.isShowTable = false;
      }

      if (this.authenticationStatus == 2) {
        this.buttonName = "重新认证";
      }

      if (this.authenticationStatus != 1) {
        this.isShowTable = true;
        this.userName = res.name;
        this.IDNumber = res.idNumber;
        this.sex = res.sex == 1 ? '男' : '女';
        this.nation = res.nation + '族';
        this.birthday = this.$formatDate(res.birthday, "YYYY年MM月DD日");
        this.address = res.address;
        this.gear = res.issued;
        let startStr = this.$formatDate(res.startDate, "YYYY.MM.DD");
        let endStr = res.endDate >0? this.$formatDate(res.endDate, "YYYY.MM.DD"):"长期";
        this.date = startStr + "-" + endStr;
        this.reason = res.reason;
      }
    })
  },
  methods: {
    onUpRengXiang() {
      this.$store.dispatch("setUploadImage", "/user/user/auth").then(res => {
        this.rengXiangSrc = res;
      });
    },
    onUpGuoHui() {
      this.$store.dispatch("setUploadImage", "/user/user/auth").then(res => {
        this.guoHioSrc = res;
      });
    },
    onClick() {
      if (this.buttonName == "确认") {
        if (!this.rengXiangSrc || !this.guoHioSrc) {
          this.$toast("请先上传身份证照片！");
          return;
        }
        User.getUserauth({
          token: this.$store.state.userInfo.token,
          idFace: this.retConfigData.imgDomain + this.rengXiangSrc,
          idBack: this.retConfigData.imgDomain + this.guoHioSrc
        }).then(res => {
          this.authenticationStatus = res.state;
          this.authData = res;
          this.isShowTable = true;
          this.buttonName = "提交信息";
          this.userName = res.name;
          this.IDNumber = res.idNumber;
          this.sex = res.sex == 1 ? '男' : '女';
          this.nation = res.nation + '族';
          this.birthday = this.$formatDate(res.birthday, "YYYY年MM月DD日");
          this.address = res.address;
          this.gear = res.issued;
          let startStr = this.$formatDate(res.startDate, "YYYY.MM.DD");
          let endStr = res.endDate == "长期" ? '长期' : this.$formatDate(res.endDate, "YYYY.MM.DD");
          this.date = startStr + "-" + endStr;
        })
      } else if (this.buttonName == "提交信息") {
        this.$refs.msg.show("请确认个人信息是否正确");
      } else if (this.buttonName == "重新认证") {
        this.authenticationStatus = 1;
        this.isShowTable = false;
        this.buttonName = "确认";
      }
    },
	onMsgConfirm(){
		if (!this.userName || !this.IDNumber) {
		  this.$toast("身份证信息读取有误");
		  return;
		}
		let data = {
		  ...this.authData,
		  userId: this.$store.state.userInfo.userId,
		  startDate: this.$formatDate(this.authData.startDate, "YYYY-MM-DD"),
		  endDate: this.authData.endDate == "长期" ? "长期" : this.$formatDate(this.authData.endDate, "YYYY-MM-DD"),
		  birthday: this.$formatDate(this.authData.birthday, "YYYY-MM-DD")
		}
		User.orcUserauth(data).then(res => {
		  this.authenticationStatus = res.state;
		  this.contentSu = true;
		})
	},
    onClick2() {
      this.authenticationStatus = 1;
      this.isShowTable = false;
      this.buttonName = "确认";
    }
  }
}
</script>
<style lang="scss" scoped>
  .content-su {
    text-align: center;
    padding: 30upx;
  }
  .icon-yibaoming {
    color: #42b983;
    font-size: 200upx;
  }
  .content-su-text {
    font-size: 40upx;
    color: rgb(0, 0, 0);
    margin-bottom: 60upx;
    margin-top: 60upx;
  }

  .state2 {
    font-size: 26upx;
    color: rgb(252, 112, 62);
    display: inline-block;
    margin-top: 30upx;
  }
  .content {
    padding: 30upx;
    text-align: left;
    .tips {
      display: inline-block;
      font-size: 26upx;
      color: rgba(252, 112, 62, 1);
      margin-bottom: 20upx;
    }
    div {
      width: 100%;
      position: relative;
    }
    img {
      width: 100%;
      margin-bottom: 20upx;
    }
    .rengxiang {
      position: absolute;
      top: 182upx;
      left: 262upx;
      font-size: 28upx;
    }
    .guohui {
      position: absolute;
      top: 182upx;
      left: 262upx;
      font-size: 28upx;
    }
  }
  .li {
    height: 88upx;
    line-height: 88upx;
    .title {
      font-size: 32upx;
      color: rgb(153, 153, 153);
    }
    .value {
      float: right;
      display: block;
      font-size: 32upx;
      color: rgb(0, 0, 0);
      margin-left: 46upx;
      width: 500upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .bottom {
    margin-bottom: 30upx;
  }
  .button {
    height: 98upx;
    line-height: 98upx;
    color: #fff;
    background: #42b983;
    font-size: 34upx;
    text-align: center;
    border-radius: 10upx;
  }
  .button-border {
    height: 98upx;
    line-height: 98upx;
    color: #42b983;
    border: 1upx solid #42b983;
    font-size: 34upx;
    text-align: center;
    border-radius: 10upx;
    margin-top: 30upx;
  }
  .ID-authentication {
    text-align: center;
    height: 100%;
    color: #000;
    background-color: #fff;
    position: relative;
    .id-step {
      padding: 64upx 0upx 104upx 0upx;
      font-size: 26upx;
      border-bottom: 20upx solid #f2f2f2;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .stepNo {
        position: relative;
        flex: 0.1;
        span {
          width: 48upx;
          height: 48upx;
          line-height: 48upx;
          display: block;
          margin: 0 auto;
          color: #fff;
          background: #ccc;
          border-radius: 48upx;
        }
        p {
          position: absolute;
          width: 170upx;
          left: -50upx;
          bottom: -50upx;
          color: #999;
        }
      }
      i {
        display: flex;
        flex: 0.25;
        height: 6upx;
        background: #ccc;
      }
      .line {
        background: #42b983;
      }
      .no1,
      .active {
        span {
          background: #42b983;
        }
        p {
          color: #42b983;
        }
      }
      .activeError {
        span {
          background: #fd9f29;
        }
        p {
          color: #fd9f29;
        }
      }
      .step-icon {
        font-size: 20upx;
        background: rgba(0, 0, 0, 0);
        margin-left: 12upx;
      }
    }
  }
  .rengxiang-div {
    position: relative;
  }
  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 93%;
    z-index: 80000;
    border: 1px solid red;
  }
</style>
