<template>
    <div class="email">
        <div class="van-cell">
            <div class="van-cell-text">电子邮箱</div>
            <input cursor-spacing="20" class="new-email-input" placeholder="请输入新邮箱地址" v-model="sendUserEmail">
        </div>

        <div class="btn-wrapper">
            <button class="save-btn" @click="sendEmail" :loading="loading">保存</button>
        </div>
    </div>
</template>

<script>
import User from "../../../api/modules/user";
export default {
    data() {
        return {
            loading: false,
            sendUserEmail: this.$store.state.userInfo.email
        }
    },
    computed: {
        
    },
    methods: {
        sendEmail() {
            if (this.sendUserEmail === "") {
                this.$toast("请输入邮箱");
                return;
            }
            if (this.loading === true) return;
            this.loading = true;
            User.sendEmail({
                type: 1,
                sendUserEmail: this.sendUserEmail,
                sendMessage: this.$store.state.userInfo.token,
                theme: "邮箱"
            }).then(res => {
                let msg = this.$store.state.userInfo;
                msg.email = this.sendUserEmail;
                this.$store.commit("setUserInfo", msg);
                this.$toast("保存输入邮箱后,请注意邮件,点击链接激活生效");
            })
            this.loading = false;
        }
    },
    onLoad() {
        this.sendUserEmail = this.$store.state.userInfo.email || "";
    },
    onShow() {
        this.$updateNavbarTitle("绑定邮箱");
    }
}
</script>
<style lang="scss" scoped>
    .email {
      min-height: 100%;
      background-color: #f2f2f2;
      overflow: hidden;
      .new-email-input {
        text-align: left !important;
        float: left;
        margin-top: 18upx;
        margin-left: 35upx;
      }
      .tip-icon {
        display: flex;
        align-items: center;
        padding: 10upx 0 0 30upx;
        margin-bottom: 40upx;
        font-size: 24upx;
        color: #999;
      }
      .input-icon {
        margin-right: 10upx;
      }
      .btn-wrapper {
        padding: 0 20upx;
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
      }
      .save-btn {
        width: 710upx;
        height: 88upx;
        border-radius: 10upx !important;
        font-size: 34upx;
        line-height: 88upx;
        margin-top: 50upx;
        background-color: #42b983;
        color: #fff;
      }
    }
</style>
