<template>
    <div class="basic-info">
        <div class="header-cell-group" @click="onUserAvatarClick">
            <div is-link center>
                <span class="iconfont jiantou icon-gengduo icongengduo"></span>
                <img class="user-avatar" :src="imgSrcDomain + touxiang+'/100x100'" v-if="touxiang">
                <div v-else>
                    <img class="user-avatar" src="/static/img/user/photo.png">
                </div>
                <div class="div-text text1">头&nbsp;&nbsp;&nbsp;&nbsp;像</div>
            </div>
        </div>
        <div class="cell-group">
            <cell-list-item :isNoNull="false" title="身份认证" @onTapCellListItem="onItemCellTap('/pages/mine/selectidauth')" :value="authenticationStatusArr[isAuth]"></cell-list-item>
        </div>

        <div class="cell-group">
            <div :style="isAuth != 4 ? 'display: none;' : ''">
                <cell-list-item title="姓 名" :value="name" :isNoNull="false" :isNoIcon="false"></cell-list-item>
            </div>

            <div :style="isAuth == 4 ? 'display: none;' : ''">
                <cell-list-item-input title="姓 名" @input="nameInput" :isNoNull="false" :valueProps="name ? name : ''" phder="请填写姓名"></cell-list-item-input>
            </div>

            <div :style="isAuth != 4 ? 'display: none;' : ''">
                <cell-list-item title="性 别" :isNoIcon="false" :isNoNull="false" :value="pickerColumnsValue0"></cell-list-item>
            </div>

            <div :style="isAuth == 4 ? 'display: none;' : ''">
                <picker mode="selector" :value="defineSelectSex" @change="onPickerConfirm($event, 0)" :range="pickerColumnsArr[0]">
                    <cell-list-item title="性 别" :isNoNull="false" :value="pickerColumnsValue0"></cell-list-item>
                </picker>
            </div>

            <!-- <div :style="isAuth != 4 ? 'display: none;' : ''">
                <cell-list-item title="出生日期" :isNoIcon="false" :value="dateOfBirth"></cell-list-item>
            </div>

            <div :style="isAuth == 4 ? 'display: none;' : ''">
                <picker mode="date" :value="defineSelectBirth" @change="onBirthPickerClick">
                    <cell-list-item title="出生日期" :value="dateOfBirth"></cell-list-item>
                </picker>
            </div> -->

            <!-- <cell-list-item-input :isNoNull="false" title="电子邮箱" @input="mailInput" :valueProps="mail ? mail : ''" phder="请输入电子邮箱"></cell-list-item-input> -->

            <cell-list-item title="手机号码" :isNoIcon="false" :isNoNull="false" :value="telephone"></cell-list-item>

            <!-- <picker mode="selector" :value="defineSelectEducational" @change="onPickerConfirm($event, 1)" :range="pickerColumnsArr[1]">
                <cell-list-item title="最高学历" :value="pickerColumnsValue1"></cell-list-item>
            </picker>

            <picker mode="selector" :value="defineSelectYear" @change="setEntranceYear" :range="entranceYearColumns">
                <cell-list-item title="开始工作年份" :value="startWorkingYear + ''"></cell-list-item>
            </picker> -->

            <!--  #ifdef H5 -->
            <!-- <w-picker :value="defineSelectAddress" mode="region" @confirm="onAddressPickerClick" ref="picker">
            </w-picker>
            <cell-list-item @onTapCellListItem="onShowPicker" :isNoNull="false" title="所在地区" :value="locationAddress"></cell-list-item> -->
            <!--  #endif -->

            <!--  #ifdef MP-WEIXIN -->
           <!-- <picker :value="defineSelectAddress" mode="region" @change="onAddressPickerClick">
                <cell-list-item title="所在地区" :isNoNull="false" :value="locationAddress"></cell-list-item>
            </picker> -->
            <!--  #endif -->
        </div>

        <div class="personalityLabel-section">
            <cell-list-item title="公司名称" :isNoIcon="false" :isNoNull="false" :value="orgUser.orgName"></cell-list-item>
            <cell-list-item title="岗位名称" :isNoIcon="false" :isNoNull="false" :value="orgUser.postName"></cell-list-item>
            <cell-list-item title="管理员权限" :isNoIcon="false" :isNoNull="false" :value="orgUser.roleName"></cell-list-item>
        </div>
		
		<view class="confirm-btn" @tap="update_user">
			<text>保存</text>
		</view>

<!--        <div class="position-btn-bar van-hairline--top">
            <div class="position-btn-pending">

                <div class="position-btn-editor" @click="onConsultBtnClick">
                    <span class="iconfont customer-service-icon icon-kefuzixun iconzaixiankefu1"></span><br>客服</div>
                <div class="position-btn-empty"></div>
                <button class="bottom_btn_yes position-btn-empty" type="primary" :loading="loading" @click="update_user">保存</button>
            </div>
        </div> -->

    </div>
</template>

<script>
import User from "../../api/modules/user"
import cellListItem from '../../components/cellListItemEdit'
import cellListItemInput from '../../components/cellListItemInput'
// #ifdef H5
import wPicker from '../../components/w-picker'
// #endif
import { checkEmail } from '../../utils/utils'

export default {
    components: {
        cellListItem, cellListItemInput
        // #ifdef H5
        , wPicker
        // #endif
    },
    data() {
        return {
            showDateTimePicker: false,
            loading: false,
            currentDate: new Date(),
            minDate: new Date("1950/01/01"), //最小
            maxDate: new Date(), //最大
            //   姓名
            name: "",
            // 邮箱
            // mail: "",
            telephone: "",
            // locationAddress: "",
            //   个性标签
            // personalityLabelContent: "",
            //   工作年份
            currentPickerType: -1,

            //   出生年月
            // dateOfBirth: "请选择",
            showPicker: false,

            // 开始工作年份
            entranceYearColumns: [],
            isShowEntranceYear: false,
            startWorkingYear: "请选择",

            province: "",
            city: "",
            district: "",
            //   头像
            photo: "",
            touxiang: "",
            // 认证
            isAuth: 0,
            authenticationStatusArr: [
                "未认证",
                "未认证",
                "认证失败",
                "审核中",
                "认证成功",
                ""
            ],

            pickerColumnsArr: [
                ["男", "女"],
                ["初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"]
            ],
            pickerColumnsValue0: "请选择",//性别
            pickerColumnsValue1: "请选择",//学历

            defineSelectSex: 0,
            defineSelectBirth: this.presentDate,
            defineSelectEducational: 0,
            defineSelectYear: 0,
            defineSelectAddress: [],
			orgUser:{
				orgName:"",
				postName:"",
				roleName:""
			}
        }
    },

    // 计算属性
    computed: {
        imgSrcDomain() {
            return this.$store.state.configData.imgDomain;
        },
        presentDate() {
            return this.$formatDate(new Date("1995/01/01").getTime(), "YYYY-MM-DD");
        }
    },

    methods: {
        onItemCellTap(e) {
            uni.navigateTo({ url: e });
        },
        onShowPicker() {
            this.$refs.picker.show();
        },
        onInputBlur() {
            // 兼容IOS输入法
            this.$iosScrollAuto();
        },
        setEntranceYear(date) {
            this.isShowEntranceYear = true;
            this.startWorkingYear = this.entranceYearColumns[date.mp.detail.value];
        },
        onConsultBtnClick() {
            uni.makePhoneCall({
                phoneNumber: this.$store.state.configData.serviceTel
            });
        },
        nameInput(e) {
            this.name = e;
        },
        mailInput(e) {
            this.mail = e;
        },

        onUserAvatarClick() {
            this.$store.dispatch("setUploadImage", "/user/user/photo").then(res => {
                this.photo = res;
                this.touxiang = res;
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                let url = currentPage.route
                if (url === "pages/mine/main") {
                    this.update_user(res.data.url);
                }
            });
        },
        onPickerCancel() {
            this.showPicker = false;
        },
        onPickerConfirm(e, item) {
            this.showPicker = true;
            this.currentPickerType = e.mp.detail.value;
            if (item == 0) {
                this.pickerColumnsValue0 = this.pickerColumnsArr[item][e.mp.detail.value];
                return;
            }
            if (item == 1) {
                this.pickerColumnsValue1 = this.pickerColumnsArr[item][e.mp.detail.value];
                return;
            }
        },
        onAddressPickerClick(e) {
            let arr = [];
            // #ifdef MP-WEIXIN
            arr = e.detail.value;
            // #endif
            // #ifdef H5
            arr = e;
            // #endif
            this.province = arr[0];
            this.city = arr[1];
            this.district = arr[2];
            this.locationAddress = arr[0] + "-" + arr[1] + "-" + arr[2];
        },
        onBirthPickerClick(date) {
            // this.dateOfBirth = date.mp.detail.value;
            this.showDateTimePicker = true;
        },
        onDatePickercancel(res) {
            this.showDateTimePicker = false;
        },
        update_user(url) {
            if (
                this.name === "" ||
                this.pickerColumnsValue0 === "请选择" 
                // || this.dateOfBirth === "请选择"
				 // || this.pickerColumnsValue1 === "请选择"
				 // || this.startWorkingYear === "请选择"
            ) {
                this.$toast("请输入完整的信息");
                return;
            }
			if(this.pickerColumnsValue1 === "请选择"){
				this.pickerColumnsValue1 = "大专"
			}
			if(this.startWorkingYear === "请选择"){
				this.startWorkingYear=this.$formatDate(Date.now(),"YYYY");
			}
            // if (!checkEmail(this.mail) && this.mail) {
            //     this.$toast("邮箱格式不正确");
            //     return;
            // }
            if (this.loading === true) return;
            this.loading = true;
            let data = {
                name: this.name,
                // email: this.mail,
                sex: this.pickerColumnsArr[0].indexOf(this.pickerColumnsValue0) + 1,
                // birthDate: this.dateOfBirth,
                highestEducation: this.pickerColumnsArr[1].indexOf(this.pickerColumnsValue1) + 1,
                startWorkYear: this.startWorkingYear,
                // province: this.province,
                // city: this.city,
                // district: this.district,
                // tag: this.personalityLabelContent,
                photo: this.photo||"",
                userId: this.$store.state.userInfo.userId,
                isHr: false
            }
            User.updateUser(data).then(res => {
                this.$toast("修改成功");
                let userInfo = this.$store.state.userInfo;
                userInfo.photo = res.photo;
                // userInfo.email = res.email;
                userInfo.name = res.name;
                userInfo.sex = res.sex;
                userInfo.birthDate = res.birthDate;
                userInfo.workState = res.workState;
                userInfo.availableTime = res.availableTime;
                userInfo.highestEducation = res.highestEducation;
                userInfo.startWorkYear = res.startWorkYear;
                userInfo.province = res.province;
                userInfo.city = res.city;
                userInfo.district = res.district;
                userInfo.tag = res.tag;
                this.$store.commit("setUserInfo", userInfo);
                setTimeout(() => {
                    uni.navigateBack({ delta: 1 });
                }, 1500);
            })
            this.loading = false;
        }
    },

    onShow() {
        this.$updateNavbarTitle("基本资料");
        uni.setStorage({ key: "setAuthState", data: "" });

        User.getQueryUser({
            userId: this.$store.state.userInfo.userId,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        }).then(res => {
            // 头像
            this.photo = res.photo ? res.photo : null;
            this.touxiang = res.photo ? res.photo : null;
            // 姓名
            this.name = res.name;
            // this.mail = res.email;
            // 男女
            this.pickerColumnsValue0 = res.sex ? this.pickerColumnsArr[0][res.sex - 1] : "请选择";
            this.defineSelectSex = res.sex ? res.sex - 1 : 0;
            // 出生日期
            // this.dateOfBirth = res.birthDate ? this.$formatDate(res.birthDate, "YYYY-MM-DD") : "请选择";
            this.defineSelectBirth = res.birthDate ? this.$formatDate(res.birthDate, "YYYY-MM-DD") : this.$formatDate(new Date().getTime(), "YYYY-MM-DD");
            // 手机号码
            this.telephone = res.phone;
            // 最高学历
            this.pickerColumnsValue1 = res.highestEducation ? this.pickerColumnsArr[1][res.highestEducation - 1] : "请选择";
            this.defineSelectEducational = res.highestEducation ? res.highestEducation - 1 : 0;
            // 工作年份
            this.startWorkingYear = res.startWorkYear ? res.startWorkYear : "请选择";
            this.defineSelectYear = res.startWorkYear ? this.entranceYearColumns.indexOf(res.startWorkYear) : 0;
            // 认证
            this.isAuth = res.isAuth;

            // 地区
            // this.locationAddress = (res.province ? res.province + "-" : "请") + (res.city ? res.city + "-" : "选") + (res.district ? res.district : "择");
            this.defineSelectAddress = [res.province, res.city, res.district];
            // 个性标签
            this.province = res.province || "";
            this.city = res.city || "";
            this.district = res.district || "";
            // this.personalityLabelContent = res.tag || "";
        });
		let userInfo = this.$store.state.userInfo;
		
		this.orgUser.orgName=userInfo.orgUser.orgName;
		this.orgUser.postName=userInfo.orgUser.postName;
		this.orgUser.roleName=userInfo.userAdministrator.roleName;
		

        var indexDate = new Date().getFullYear();
        for (let i = 0; i < 80; i++) {
            this.entranceYearColumns.push(indexDate);
            indexDate--;
        }
    }
}
</script>
<style lang="scss" scoped>
    .center {
      height: 100upx;
      line-height: 100upx;
    }
    .cell-group {
      margin-bottom: 20upx;
      margin-top: 20upx;
      background-color: #fff;
    }
    .bottom_btn_yes {
      width: 300upx;
      background: #42b983;
      line-height: 98upx;
      text-align: center;
      font-size: 32upx;
      color: #fff;
    }
    .icon-kefuzixun {
      font-size: 40upx;
      margin-left: 8upx;
    }
    .basic-info {
      min-height: 100%;
      padding-bottom: 106upx;
      background-color: #f2f2f2;
      .header-cell-group {
        height: 130upx;
        padding: 30upx;
        background-color: #fff;
      }
      .user-avatar {
        width: 80upx;
        height: 80upx;
        border-radius: 100%;
        float: right;
        overflow: hidden;
      }
      .text1 {
        line-height: 80upx;
        float: left;
        font-size: 32upx;
      }
      .jiantou {
        float: right;
        font-size: 26upx;
        margin-top: 25upx;
        color: #999999;
        margin-left: 8upx;
      }
      .personalityLabel-section {
        position: relative;
        font-size: 32upx;
        background-color: #fff;
      }
      .personalityLabel-header,
      .personalityLabel-content {
        padding: 30upx;
      }
      .personalityLabel-content {
        width: 100%;
        height: 180upx;
        color: #999;
      }
      .textarea-input-icon {
        position: absolute;
        bottom: 30upx;
        right: 20upx;
        color: #ccc;
      }
      .position-btn-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 32upx;
        color: #fff;
        z-index: 2;
      }
      .position-btn-close,
      .position-btn-publish {
        padding: 32upx 0;
        text-align: center;
      }
      .position-btn-close,
      .position-btn-publish {
        background-color: #42b983;
      }
      .position-btn-pending {
        display: flex;
        background-color: #f5f5f5;
        height: 98upx;
      }
      .position-btn-editor {
        align-items: center;
        padding: 10upx 50upx;
        color: #42b983;
        font-size: 28upx;
        border-right: 1upx solid rgb(216, 216, 216);
      }
      .position-btn-empty {
        flex: 0.714285714;
        border-radius: 0;
      }
      .position-btn-publish {
        flex: 1;
      }
      .position-btn-publish.unpassed {
        background-color: #ccc;
      }
      .footer-cell-group {
        position: relative;
        height: 100upx;
        background-color: #fff;
        .input-icon {
          position: absolute;
          font-size: 32upx;
          right: 30upx;
          top: 28upx;
          color: #ccc;
        }
      }
      .text {
        font-size: 32upx;
        line-height: 100upx;
        margin-left: 30upx;
      }
      .name-rg {
        text-align: right;
        height: 30upx;
        margin-top: 22upx;
        float: right;
        font-size: 32upx;
        margin-right: 80upx;
        color: #999999;
      }
    }
	
	.confirm-btn{
		$height:88upx;
		width:690upx;
		height:$height;
		line-height: $height;
		text-align: center;
		background:$color-main;
		border-radius:10upx;
		color: #fff;
		font-size: $font-size-32;
		margin: 40upx auto;
	}
</style>
