<template>
  <div class="login">
    <div class="pass_box1">

      <input cursor-spacing="20" v-model="phone" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入手机号码">
    </div>

    <div class="pass_box1">
      <input cursor-spacing="20" v-model="password" class="pass_box_inp" type="password" placeholder="请输入密码" maxlength="16">
    </div>

    <div class="pass_box">
      <input cursor-spacing="20" v-model="verifyCode" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
      <span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
    </div>

    <button class="btn" @tap="registerFunc" :loading="loading">注册</button>

    <div class="setlogin_box">
      <div class="setlogin_box_t2">
        已有账号？<span class="color" @click="loginManner">立即登录</span>
      </div>
    </div>

  </div>
</template>

<script>
import Publics from '../../api/modules/public'
import User from '../../api/modules/user'
import md5 from "@/utils/md5.min.js";
import { wxLogin } from "../../utils/utils";
export default {
  data() {
    return {
      verifyCodeTxt: "获取验证码",
      phone: "",
      verifyCode: "",
      password: "",
      Interval: "",
      loading: false
    }
  },
  computed: {
    
  },
  // #ifdef H5
  mounted() {
    document.getElementsByTagName("input")[0].setAttribute('pattern', '[0-9]*');
    document.getElementsByTagName("input")[2].setAttribute('pattern', '[0-9]*');
  },
  // #endif
  methods: {
    // 登录方式切换
    loginManner() {
      uni.redirectTo({ url: '/pages/login/phone' });
    },
    wxLoginAndH5() {
      wxLogin(this.$store.state.configData.wxAppId);
    },
    // 获取验证码
    getVerifyCode() {
      if (!this.$mobileReg(this.phone) || !this.phone) {
        uni.showToast({
					icon: "none",
					title: "请输入正确的手机号码"
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
            .replace(/0/g, "P"),
        siteHierarchy: this.$store.state.configData.hierarchy
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
    // 注册
    registerFunc() {
      if (this.phone === "" || this.phone.length != 11) {
        uni.showToast({
					icon: "none",
					title: "请输入手机号码"
				});
        return;
      }
      if (this.password === "") {
        uni.showToast({
					icon: "none",
					title: "请输入密码"
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
      if (this.verifyCode === "") {
        uni.showToast({
					icon: "none",
					title: "请输入验证码"
				});
        return;
      }
      let data = {
        phone: this.phone,
        password: md5(this.password).toUpperCase(),
        authCode: this.verifyCode,
        siteHierarchy: this.$store.state.configData.hierarchy
      };
      if (this.loading === true) return;
      this.loading = true;
      User.userReg(data).then(res => {
        uni.showToast({
					icon: "none",
					title: "注册成功"
				});
        uni.redirectTo({ url: '/pages/login/phone' });
      })
      this.loading = false;
    }
  },
  onLoad() {
    this.$updateNavbarTitle("注册");
  }
}
</script>
<style lang="scss" scoped>
  .margin_b_20 {
    margin-bottom: 20upx;
  }
  .login {
    min-height: 100%;
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      min-height: 100%;
      width: 100%;
      background: #f2f2f2;
      color: #666;
      z-index: 99999;
      .van-loading {
        margin: auto;
        margin-top: 60%;
      }
      p {
        text-align: center;
        margin-top: 10upx;
        font-size: 28upx;
      }
    }
    background: #fff;
    min-height: 100%;
    padding: 40upx 20upx 200upx 20upx;
    font-size: 24upx;
    .btn {
      width: 710upx;
      height: 88upx;
      border-radius: 10upx !important;
      font-size: 34upx;
      line-height: 88upx;
      margin-bottom: 50upx;
      border: none;
      color: #fff;
      background-color: #42b983;
    }
    .pass_box1 {
      height: 88upx;
      font-size: 32upx;
      margin-bottom: 20upx;
      display: flex;
      align-items: center;
      overflow: hidden;
      .pass_box_inp {
        height: 100%;
        width: 100%;
        background: #f2f2f2;
        border-radius: 10upx;
        padding: 20upx;
      }
      .pass_box_t {
        color: #42b983;
        width: 240upx;
        margin-left: 20upx;
        height: 84upx;
        border-radius: 10upx;
      }
    }
    .forget_pass {
      font-size: 26upx;
      color: #999;
      text-align: right;
      margin-bottom: 30upx;
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
      color: #999;
      margin-bottom: 218upx;
      display: flex;
      .setlogin_box_t1,
      .setlogin_box_t2 {
        flex: 1;
        margin-top: 30upx;
        font-size: 26upx;
      }
      .setlogin_box_t2 {
        text-align: right;
        color: #42b983;
      }
    }
    .login_way {
      text-align: center;
      color: #999;
      margin-bottom: 60upx;
      font-size: 26upx;
    }
    .icon_uni {
      text-align: center;
      .home_icon_N {
        font-size: 80upx;
        color: #1bcb44;
      }
    }
  }
  .pass_box {
    position: relative;
    height: 88upx;
    font-size: 32upx;
    margin-bottom: 20upx;
    border-radius: 10upx;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #f2f2f2;
    .pass_box_inp {
      // line-height: 88upx;
      width: 463upx;
      border-right: 1upx solid #ccc;
      padding-left: 20upx;
    }
    .pass_box_t {
      position: absolute;
      right: 10upx;
      top: 25upx;
      color: #42b983;
      display: inline-block;
      width: 214upx;
      text-align: center;
    }
  }
  .wx-div {
    margin: auto;
    width: 80upx;
    height: 80upx;
    position: relative;
  }
  .wx {
    opacity: 0;
    position: absolute;
    margin: auto;
    width: 80upx;
    height: 80upx;
    z-index: 99999;
  }
  .login-weixin {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
