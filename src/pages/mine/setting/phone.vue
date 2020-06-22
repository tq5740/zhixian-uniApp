<template>
  <div class="phone">
    <div class="pass_box margin_b_10">
      <input cursor-spacing="20" v-model="phone" class="pass_box_inp1" type="number" pattern="[0-9]*" placeholder="请输入手机号">
    </div>

    <div class="pass_box">
      <input cursor-spacing="20" v-model="verifyCode" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
      <span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
    </div>

    <button size="large" class="btn" :loading="loading" @click="updateUserPhone">保存</button>
  </div>
</template>

<script>
import Publics from "../../../api/modules/public";
import User from "../../../api/modules/user";
export default {
  data() {
    return {
      phone: "",
      verifyCode: "",
      verifyCodeTxt: "获取验证码",
      Interval: null,
      loading: false
    }
  },
  computed: {
  },
  methods: {
    // 获取验证码
    getVerifyCode() {
      if (this.phone === "") {
        this.$toast("请输入手机号码");
        return;
      }
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
      }).then(res => {
        this.$toast("验证码已发送请查收");
      });
      if (this.verifyCodeTxt.length < 4) return;
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
        console.log(123);
      }, 1000);
    },
    updateUserPhone() {
      if (this.phone === "") {
        this.$toast("请输入手机号码");
        return;
      }
      if (this.verifyCode) {
        if (this.loading === true) return;
        this.loading = true;
        User.updateUserPhone({
          authCode: this.verifyCode,
          phone: this.phone
        }).then(res => {
          this.$toast("修改成功");
        })
        this.loading = false;
      } else {
        this.$toast("请输入验证码");
      }
    }
  },
  onLoad() {
    this.phone = this.$store.state.userInfo.phone || "";
  },
  onShow() {
    this.$updateNavbarTitle("手机号码");
  }
}
</script>
<style lang="scss" scoped>
  .margin_b_10 {
    margin-bottom: 10upx;
  }
  .color {
    color: #42b983;
  }
  .phone {
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
      margin-top: 50upx;
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
</style>