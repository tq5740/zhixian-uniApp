<template>
    <div class="third">
        <!--  #ifdef MP-WEIXIN -->
        <cell-list-item :isBorder="false" title="微信小程序" :value="weixin" @onTapCellListItem="onTapCellListItem"></cell-list-item>
        <!--  #endif -->
        <!--  #ifdef H5 -->
        <cell-list-item :isBorder="false" title="微信公众号" :value="weixin" @onTapCellListItem="onTapCellListItem"></cell-list-item>
        <!--  #endif -->

        <!--  #ifdef MP-WEIXIN -->
        <div class="tips" v-if="isPhoneNumber">未绑定</div>
        <button v-if="isPhoneNumber" class="wx" open-type="getPhoneNumber" @getphonenumber="getPhoneNumberWeiXin">点击绑定</button>
        <!--  #endif -->
    </div>
</template>

<script>
import cellListItem from "../../../components/cellListItem"
import User from "../../../api/modules/user"
import { wxBound, isEmojiCharacter } from "../../../utils/utils";
export default {
    components: {
        cellListItem
    },
    computed: {

    },
    data() {
        return {
            // #ifdef MP-WEIXIN
            weixin: this.$store.state.userInfo.xcxOpenId ? "已绑定" : "未绑定",
            isPhoneNumber: this.$store.state.userInfo.xcxOpenId ? false : true,
            // #endif
            // #ifdef H5
            weixin: this.$store.state.userInfo.wxOpenId ? "已绑定" : "未绑定",
            isPhoneNumber: this.$store.state.userInfo.wxOpenId ? false : true,
            // #endif
            qq: "未绑定",
            weibo: "未绑定"
        }
    },
    methods: {
        onTapCellListItem() {
            if (this.weixin == "未绑定") {
                // #ifdef H5
                wxBound(this.$store.state.configData.wxAppId);
                // #endif
            }
        },
        getPhoneNumberWeiXin(numberRes) {
            let _this = this;
            let data = {
                code: _this.code,
                appId: "wx0ff213c824cfca1f",
                encryptedData: numberRes.detail.encryptedData,
                iv: numberRes.detail.iv
            }
            wx.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                    _this.infoRes = infoRes;
                    uni.showLoading({ title: '正在绑定...' });
                    User.userDecrypt(data).then(res => {
                        _this.phoneNum = JSON.parse(data).phoneNumber;
                        _this.onOAuth();
                    })
                }
            });
        },
        bindUserPhone() {
            User.bindUserPhone({
                openId: this.openId,
                unionId: this.unionId,
                userName: isEmojiCharacter(this.infoRes.userInfo.nickName) ? "新用户" + this.phoneNum[7] + this.phoneNum[8] + this.phoneNum[9] + this.phoneNum[10] : this.infoRes.userInfo.nickName,
                photo: this.$store.state.userInfo.photo,
                type: 2,
                siteHierarchy: this.$store.state.configData.hierarchy,
                appId: "wx0ff213c824cfca1f",
                phone: this.phoneNum
            }).then(res => {
                this.$toast('绑定成功，3秒后跳转！');
                setTimeout(() => {
                    uni.navigateBack({ delta: 1 });
                }, 3000);
            });
        },
        onOAuth() {
            let _this = this;
            wx.login({
                provider: 'weixin',
                success: function (codeAuth) {
                    User.oAuth({
                        code: codeAuth.code,
                        data: JSON.stringify(_this.infoRes),
                        type: 2,
                        lat: _this.$store.state.pos.lat,
                        lng: _this.$store.state.pos.lng,
                        appId: "wx0ff213c824cfca1f",
                        device: 1
                    }).then(res => {
                        if (res.isLogin === false) {
                            _this.openId = res.user.openId;
                            _this.unionId = res.user.unionId;
                            _this.bindUserPhone();
                        }
                    });
                }
            });
        }
    },
    onShow() {
        this.$updateNavbarTitle("第三方绑定");
        let _this = this;
        wx.login({
            provider: 'weixin',
            success: function (codeRes) {
                _this.code = codeRes.code;
            }
        });

        User.getUserByToken({ token: this.$store.state.userInfo.token }).then(res => {
            this.$store.commit("setUserInfo", res);
        })

    }
}
</script>
<style lang="scss" scoped>
    .third {
      position: relative;
      min-height: 100%;
      background-color: #f2f2f2;
    }
    .tips {
      position: absolute;
      top: 15upx;
      right: 190upx;
      display: inline-block;
      height: 58upx;
      color: #999;
      line-height: 58upx;
      font-size: 28upx;
    }
    .wx {
      position: absolute;
      top: 15upx;
      right: 30upx;
      display: inline-block;
      height: 58upx;
      width: 140upx;
      background-color: #42b983;
      color: #fff;
      line-height: 58upx;
      font-size: 28upx;
    }
</style>
