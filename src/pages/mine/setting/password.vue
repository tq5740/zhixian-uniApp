<template>
    <div class="password">
        <div class="van-cell scale-1px-bottom">

            <div class="van-cell-text">旧密码</div>
            <input cursor-spacing="20" class="password-input" placeholder="请输入旧密码" type="password" v-model="oldPassword" maxlength="16">

        </div>
        <div class="van-cell scale-1px-bottom">

            <div class="van-cell-text">新密码</div>
            <input cursor-spacing="20" class="password-input" placeholder="请输入新密码" type="password" v-model="newPassword" maxlength="16">

        </div>
        <div class="van-cell">

            <div class="van-cell-text">确认密码</div>
            <input cursor-spacing="20" class="password-input" placeholder="请输入确认密码" type="password" v-model="newPasswords" maxlength="16">

        </div>

        <div class="btn-wrapper">
            <button class="save-btn" @click="update_userPassword" :loading="loading">保存</button>
        </div>
    </div>
</template>

<script>
import User from "../../../api/modules/user";
import md5 from "../../../utils/md5.min";
export default {
    data() {
        return {
            oldPassword: "",
            newPassword: "",
            newPasswords: "",
            loading: false
        }
    },
    computed: {
    },
    methods: {
        update_userPassword() {
            if (this.oldPassword === "") {
                this.$toast("请输入旧密码");
                return;
            }
            if (this.newPassword === "" || this.newPasswords === "") {
                this.$toast("请输入新密码");
                return;
            }
            if (this.newPassword.length < 8 || this.newPasswords.length < 8) {
                this.$toast("请输入8~16位新密码");
                return;
            }
            if (this.newPassword == this.newPasswords) {
                if (this.loading === true) return;
                this.loading = true;
                User.updatePassword({
                    newPassword: md5(this.newPassword).toUpperCase(),
                    oldPassword: md5(this.oldPassword).toUpperCase()
                }).then(res => {
                    this.$toast("修改成功");
                    uni.removeStorageSync("user_token");
                    this.$store.commit("setUserInfo", null);
                    uni.navigateTo({ url: "/pages/login/index" });
                })
                this.loading = false;
            } else {
                this.$toast("新密码不一致");
            }
        }
    },
    onShow() {
        this.$updateNavbarTitle("修改密码");
    }
}
</script>
<style lang="scss" scoped>
    .password {
      min-height: 100%;
      background-color: #f2f2f2;
      .password-input {
        text-align: left !important;
        float: left;
        margin-top: 18upx;
        margin-left: 35upx;
      }
      .van-cell {
        margin: auto;
        height: 88upx;
        background-color: #fff;
        font-size: 32upx;
      }
      .van-cell-text {
        float: left;
        margin-top: 20upx;
        margin-left: 20upx;
        width: 140upx;
      }
      .save-btn {
        width: 710upx;
        height: 88upx;
        border-radius: 10upx !important;
        font-size: 34upx;
        line-height: 88upx;
        margin: auto;
        margin-top: 50upx;
        background-color: #42b983;
        color: #fff;
      }
    }
</style>
