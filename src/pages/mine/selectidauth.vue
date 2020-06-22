<template>
    <div style="height: 100%">
        <div class="select-idauth" v-if="isAuthState == 0">
            <div class="tips">请点击下方进行认证</div>
            <div class="tips2">*认证完成后，将开放更多功能！</div>

            <div class="img-box-sfz">
                <sfz-item @click="onClickSFZ"></sfz-item>
            </div>
        </div>

        <div class="auth-bac" v-if="isAuthState == 1">
            <div class="dzsbk-item">
                <dzsbk-item :dataItem="dzsbkImgData"></dzsbk-item>
            </div>
            <div class="div-ul">
                <div class="scale-1px-bottom">
                    <span class="left">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
                    <span class="right">{{authData.name}}</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
                    <span class="right">{{authData.sex}}</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">身份证号</span>
                    <span class="right">{{authData.idNumber}}</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">出生日期</span>
                    <span class="right">{{authData.birthday}}</span>
                </div>
            </div>
        </div>

        <div class="auth-bac" v-if="isAuthState == 2">
            <div class="dzsbk-item">
                <sfz-item :dataItem="sfzImgData"></sfz-item>
            </div>
            <div class="div-ul">
                <div class="scale-1px-bottom">
                    <span class="left">民&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族</span>
                    <span class="right">{{authData.nation}}族</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">户籍地址</span>
                    <span class="right address">{{authData.address}}</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">签发机关</span>
                    <span class="right">{{authData.issued}}</span>
                </div>
                <div class="scale-1px-bottom">
                    <span class="left">有效期限</span>
                    <span class="right">{{authData.startDateStr}}-{{authData.endDateStr}}</span>
                </div>
            </div>
        </div>

    </div>
</template> 

<script>
import dzsbkItem from '../../components/dzsbkItem'
import sfzItem from '../../components/sfzItem'
import User from '../../api/modules/user'
export default {
    components: {
        dzsbkItem, sfzItem
    },
    data() {
        return {
            isAuthState: 0, // 0未认证，1社保卡认证，2身份证认证
            authData: {},
            sfzImgData: {},
            dzsbkImgData: {}
        }
    },
    computed: {
        retConfigData() {
            return this.$store.state.configData;
        }
    },

    onLoad() {
        this.$updateNavbarTitle("身份认证");
        uni.setStorage({ key: "setAuthState", data: "" });
    },
    methods: {
        onClickSFZ() {
            uni.navigateTo({ url: '/pages/mine/idauth' });
        }
    },

    onShow() {
        User.queryUserinfoProgress({ userId: this.$store.state.userInfo.userId }).then(resState => {
            if (resState.authState == 4) {
                User.queryUserauth({ userId: this.$store.state.userInfo.userId }).then(res => {
                    if (res.address && res.nation) {
                        this.isAuthState = 2;
                        res.startDateStr = this.$formatDate(res.startDate, "YYYY.MM.DD");
                        res.endDateStr = res.endDate == "长期" ? "长期" : this.$formatDate(res.endDate, "YYYY.MM.DD");

                        this.sfzImgData.name = res.name;
                        this.sfzImgData.sex = res.sex == 1 ? '男' : '女';

                        this.sfzImgData.nation = res.nation;
                        this.sfzImgData.year = this.$formatDate(res.birthday, "YYYY");
                        this.sfzImgData.month = this.$formatDate(res.birthday, "MM");
                        this.sfzImgData.day = this.$formatDate(res.birthday, "DD");

                        this.sfzImgData.addr = res.address;
                        this.sfzImgData.idNumber = res.idNumber;
                    } else {
                        this.isAuthState = 1;
                        res.sex = res.sex == 1 ? '男' : '女';
                        res.birthday = this.$formatDate(res.birthday, "YYYY年MM月DD日");
                        this.dzsbkImgData.name = res.name;
                        this.dzsbkImgData.idNumber = res.idNumber;
                        this.dzsbkImgData.cardNumber = res.bankCardNumber;
                        this.dzsbkImgData.id = "888888 8888888888888";
                    }
                    this.authData = res;
                })
                return;
            }
        });
    }
}
</script>
<style lang="scss" scoped>
    .select-idauth {
      min-height: 100%;
      background-color: #fff;
      padding: 0 30upx;
      overflow: hidden;
      .tips {
        font-size: 34upx;
        font-weight: bold;
        color: #666666;
        margin-top: 40upx;
        margin-bottom: 20upx;
      }
      .tips2 {
        width: 100%;
        height: 66upx;
        line-height: 66upx;
        font-size: 26upx;
        color: rgb(252, 112, 62);
        border-radius: 6upx;
        border: 1px dashed #999999;
        padding-left: 20upx;
        margin-bottom: 30upx;
      }
      .img-box-sfz {
        margin-top: 30upx;
      }
    }
    .auth-bac {
      background-color: #f2f2f2;
    }
    .dzsbk-item {
      padding: 30upx;
    }
    .div-ul {
      width: 100%;
      padding-left: 30upx;
      background-color: #fff;
      div {
        height: 88upx;
        line-height: 88upx;
        font-size: 32upx;
        padding-right: 30upx;
      }
      .left {
        float: left;
        color: #000;
      }
      .right {
        float: right;
        color: #999999;
      }
    }
    .address {
      text-align: right;
      width: 500upx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
</style>
