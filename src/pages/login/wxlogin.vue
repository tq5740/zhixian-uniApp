<template>
  <div class="login">
    <div class="loading" v-if="changeLoading">
      <p>正在自动登录...</p>
    </div>

    <div v-else>
      <div class="pass_box margin_b_10">
        <input v-model="phone" class="pass_box_inp1" type="number" pattern="[0-9]*" placeholder="请输入手机号">
      </div>

      <div class="pass_box">
        <input v-model="outh" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
        <span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
      </div>

      <div class="pass_box margin_b_10">
        <input v-model="password" class="pass_box_inp1" type="password" placeholder="请设置您的登录密码">
        <span class="tips">温馨提示：您设置的该密码将会覆盖之前的登录密码！</span>
      </div>

      <button size="large" class="btn" :class="isBtnLogin ? '' : 'disabled'" @click="login">登录</button>
    </div>
  </div>

</template>

<script>
import Publics from "../../api/modules/public";
import User from "../../api/modules/user";
import md5 from "@/utils/md5.min.js";
export default {
  data() {
    return {
      isBtnLogin: true,
      userName: "",
      userPhoto: "",
      weixinPhoto: "",
      openid: "",
      unionId: "",
      phone: "",
      password: "",
      outh: "",
      Interval: "",
      verifyCodeTxt: "获取验证码",
      changeLoading: true
    }
  },
  computed: {
    
  },
  methods: {
    // 获取验证码
    getVerifyCode() {
      if (this.phone === "") {
        uni.showToast({
          icon: "none",
          title: "请输入手机号码"
        });
        return;
      }
      if (this.verifyCodeTxt.length < 4) return;
      Publics.sendAuthCodeUser({
        phone:
          "HFDQBCWQAEQ" +
          this.phone
            .replace(/1/g, "Q")
            .replace(/2/g, "W")
            .replace(/3/g, "E")
            .replace(/4/g, "R")
            .replace(/5/g, "T")
            .replace(/6/g, "Y")
            .replace(/7/g, "U")
            .replace(/8/g, "I")
            .replace(/9/g, "O")
            .replace(/0/g, "P")
      });

      let num = 60;
      this.verifyCodeTxt = "60s";
      this.Interval = setInterval(() => {
        if (num == 1) {
          clearInterval(this.Interval);
          this.verifyCodeTxt = "重新获取";
        } else {
          num = num - 1;
          this.verifyCodeTxt = num + "s";
        }
      }, 1000);
    },
    // 登录验证
    login() {
      if (this.phone === "") {
        uni.showToast({
          icon: "none",
          title: "请输入手机号码"
        });
        return;
      }
      if (this.outh === "") {
        uni.showToast({
          icon: "none",
          title: "请输入验证码"
        });
        return;
      }
      if (this.password.length < 8) {
        uni.showToast({
          icon: "none",
          title: "请输入8~16位密码"
        });
        return;
      }
      if (this.isBtnLogin) {
        this.isBtnLogin = false;
        this.photoToFile();
      }
    },
    //   绑定手机号
    thirdCb() {
      uni.showLoading({
        title: '登录中...'
      });
      User.bindUserPhone({
        userName: this.userName,
        openId: this.openid,
        unionId: this.unionId,
        authCode: this.outh,
        photo: this.userPhoto,
        siteHierarchy: this.$store.state.configData.hierarchy,
        type: 1,
        password: md5(this.password).toUpperCase(),
        phone: this.phone
      }).then(res => {
        this.longUserInfo();
      });
    },

    // 获取用户信息
    longUserInfo() {
      if (!location.search.includes("?code=")) {
        uni.redirectTo({ url: "/pages/login/phone" })
        return;
      }
      let search = location.search;
      let wixinMath = search.match(/code=([a-z0-9]+)/i);
      let codeWX = wixinMath ? wixinMath[1] : false;
      User.oAuth({
        code: codeWX,
        type: 1,
        appId: this.$store.state.configData.wxAppId,
        lat: this.$store.state.pos.lat,
        lng: this.$store.state.pos.lng,
        device: 1
      }).then(res => {
        this.changeLoading = false;

        setTimeout(() => {
          document.getElementsByTagName("input")[0].setAttribute('pattern', '[0-9]*');
          document.getElementsByTagName("input")[1].setAttribute('pattern', '[0-9]*');
        }, 1500);

        if (res.isLogin === false) {
          this.openid = res.user.openid;
          this.unionId = res.user.unionid;
          this.userName = res.user.nickname;
          this.weixinPhoto = res.user.headimgurl;
        } else {
          if (!res.userAdministrator) {
            this.$toast("你没有管理员权限！");
            return;
          }
          uni.setStorage({ key: "user_token", data: res.token });
          this.$store.dispatch("setUserInfo", res);
          // tabBar跳转
          uni.switchTab({ url: "/pages/statistics/statistics" });
        }
        uni.hideLoading();
      })
    },
    // 用户头像转换File
    photoToFile() {
      let _this = this;
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = _this.weixinPhoto;
      img.onload = function () {
        canvas.width = 135;
        canvas.height = 135;
        ctx.drawImage(img, 0, 0, 135, 135);
        canvas.toBlob((blob) => {
          let files = new File([blob], "FileName.png", { type: "image/png" });
          var xhr = new XMLHttpRequest();
          var formData = new FormData();
          formData.append("file", files);
          formData.append("uploadType", "1");
          formData.append("token", _this.$store.state.userInfo ? _this.$store.state.userInfo.token : "");
          formData.append("path", "/user/user/photo");
		  xhr.open('POST', Publics.upload());
          xhr.send(formData);
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              _this.userPhoto = JSON.parse(xhr.response).data.url
              _this.thirdCb();
            }
          }
        })
      }
    }
  },
  onShow() {
    this.$updateNavbarTitle("微信登录");
  },
  created() {
    setTimeout(() => {
      this.longUserInfo();
    }, 1500);
  }
}
</script>
<style lang="scss" scoped>
  .disabled {
    background-color: #ccc !important;
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #f2f2f2;
    color: #666666;
    z-index: 99999;
    p {
      text-align: center;
      margin-top: 300upx;
      font-size: 28upx;
    }
  }
  .margin_b_10 {
    margin-bottom: 10upx;
  }
  .color {
    color: #42b983;
  }
  .login {
    background: #ffffff;
    min-height: 100%;
    padding: 40upx 20upx;
    font-size: 24upx;
    .btn {
      width: 710upx;
      height: 88upx;
      border-radius: 10upx !important;
      font-size: 34upx;
      line-height: 88upx;
      margin-top: 70upx;
      background-color: #42b983;
      color: #fff;
    }
    .pass_box {
      height: 88upx;
      background: #f2f2f2;
      border-radius: 10upx;
      font-size: 32upx;
      padding: 20upx 0upx 20upx 30upx;
      margin-bottom: 20upx;
      .pass_box_inp {
        height: 100%;
        width: 463upx;
        background: #f2f2f2;
        border-right: 1px solid #ccc;
        float: left;
      }
      .pass_box_inp1 {
        margin-bottom: 30upx;
        height: 100%;
        width: 100%;
        background: #f2f2f2;
      }
      .pass_box_t {
        color: #42b983;
        display: inline-block;
        width: 214upx;
        height: 100%;
        text-align: center;
      }
    }
    .forget_pass {
      font-size: 26upx;
      color: #999999;
      text-align: right;
      margin-bottom: 40upx;
      margin-top: 50upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        display: inline-block;
        height: 40upx;
      }
    }
    .setlogin_box {
      color: #999999;
      margin-bottom: 180upx;
      display: flex;
      .setlogin_box_t1,
      .setlogin_box_t2 {
        flex: 1;
      }
      .setlogin_box_t1 {
        text-align: right;
      }
      .setlogin_box_t2 {
        padding-left: 30upx;
      }
    }
    .login_way {
      text-align: center;
      color: #999999;
      margin-bottom: 60upx;
    }
    .icon_wx {
      text-align: center;
      .home_icon_N {
        width: 80upx;
        height: 80upx;
      }
    }
  }
  .tips {
    margin-left: -30upx;
    font-size: 24upx;
    color: rgb(252, 112, 62);
  }
</style>