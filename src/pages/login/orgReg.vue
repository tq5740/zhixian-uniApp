<template>
    <div class="mine-org-reg" :class="contentSu == 1 || contentSu == 3 ? 'mine-org-reg-f2' : 'mine-org-reg-ff'">
        <div v-if="contentSu == 1">
            <div class="cell-group">
                <cell-list-item-input title="企业全称" @input="onOrgName" :valueProps="OrgName" phder="请填写"></cell-list-item-input>
                <cell-list-item-input title="企业简称" @input="onOrgOweName" :valueProps="OrgOweName" phder="请填写"></cell-list-item-input>

                <cell-list-item-input title="企业地址" @input="onOrgAdd" :valueProps="OrgAdd" phder="请填写"></cell-list-item-input>
                <picker mode="selector" @change="onOrgType" :range="typeList">
                    <cell-list-item-edit title="企业类型" :value="OrgType"></cell-list-item-edit>
                </picker>

                <cell-list-item-input title="统一信用码" :isNoNull="OrgType=='机关群团（政府机关）'||OrgType=='事业单位'||OrgType=='中、高职院校' ? false : true" @input="onOrgCode" :valueProps="OrgCode" phder="请填写"></cell-list-item-input>
            </div>
            <div class="cell-group">

                <picker mode="selector" @change="onOrgNature" :range="natureList">
                    <cell-list-item-edit title="企业性质" :value="OrgNature"></cell-list-item-edit>
                </picker>

                <picker mode="selector" @change="onOrgIndustry" :range="industryList">
                    <cell-list-item-edit title="所属行业" :value="OrgIndustry"></cell-list-item-edit>
                </picker>

                <picker mode="selector" @change="onOrgScale" :range="scaleList">
                    <cell-list-item-edit title="企业规模" :value="OrgScale"></cell-list-item-edit>
                </picker>

                <picker mode="date" @change="onRegDateClick" start="1950-01-01">
                    <cell-list-item-edit title="成立日期" :value="regDate"></cell-list-item-edit>
                </picker>

                <cell-list-item-input title="官方网址" :isNoNull="false" :valueProps="OrgNet" @input="onOrgNet" phder="请填写"></cell-list-item-input>
            </div>

            <div class="cell-group">
                <cell-list-item-input title="管理员姓名" @input="onAdminName" :valueProps="AdminName" phder="请填写"></cell-list-item-input>
                <!-- <cell-list-item-input title="管理员手机号码" @input="onAdminPhone" :type="'number'" :valueProps="AdminPhone" phder="请填写"></cell-list-item-input> -->
				<cell-list-item-edit title="管理员手机号码" :isNoIcon="false"   :value="AdminPhone"></cell-list-item-edit>
                <cell-list-item-input title="管理员电子邮箱" :isNoNull="false" :valueProps="AdminEmail" @input="onAdminEmail" phder="请填写"></cell-list-item-input>
            </div>
            <div class="cell-group">
               <cell-list-item-upimg title="营业执照" :isNoNull="OrgType=='机关群团（政府机关）'||OrgType=='事业单位'||OrgType=='中、高职院校' ? false : true" @getSrcImg="onLicense" :imgSrcProp="licenseSrc ? retImgDomain+licenseSrc : ''" imgPath="/user/org/license"></cell-list-item-upimg>
                <cell-list-item-upimg title="企业形象" :isNoNull="false" :imgSrcProp="imgSrc ? retImgDomain+imgSrc : ''" @getSrcImg="onImg" imgPath="/user/org/img"></cell-list-item-upimg>
                <cell-list-item-upimg title="企业logo" @getSrcImg="onLogo" :imgSrcProp="logoSrc ? retImgDomain+logoSrc : ''" imgPath="/user/org/logo"></cell-list-item-upimg>
            </div>

            <div class="personalityLabel-section">
                <div class="personalityLabel-header border-bottom">企业简介<span style="color: #fc703e">*</span></div>
                <!--  #ifdef H5 -->
                <textarea @blur="onInputBlur" class="personalityLabel-content" maxlength="200" v-model="intro" placeholder="输入企业简介(200字以内)"></textarea>
                <!--  #endif -->

                <!--  #ifdef MP-WEIXIN -->
                <textarea class="personalityLabel-content" cursor-spacing="20" maxlength="200" v-model="intro" placeholder="输入企业简介(200字以内)"></textarea>
                <!--  #endif -->
                <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
            </div>

            <!--  #ifdef H5 -->
            <div class="button" @click="onClick">提交</div>
            <!--  #endif -->

            <!--  #ifdef MP-WEIXIN -->
            <cover-view class="button">
                <cover-view class="button" @click="onClick">提交</cover-view>
            </cover-view>
            <!--  #endif -->

        </div>

        <div class="content-su" v-if="contentSu == 2">
            <span class="iconfont icon-yibaoming"></span>
            <div class="content-su-text">您的资料提交成功，请等待审核~</div>
            <div class="button-su" @click="subBtn">完成</div>
        </div>

        <div v-if="contentSu == 3">
            <div class="cell-group">
                <cell-list-item-edit title="企业全称" :isNoIcon="false" :isNoNull="false" :value="orgData.orgName"></cell-list-item-edit>
                <cell-list-item-edit title="企业简称" :isNoIcon="false" :isNoNull="false" :value="orgData.shortName"></cell-list-item-edit>

                <cell-list-item-edit title="企业地址" :isNoIcon="false" :isNoNull="false" :value="orgData.address"></cell-list-item-edit>
                <cell-list-item-edit title="企业类型" :isNoIcon="false" :isNoNull="false" :value="typeList[orgData.orgType-1]"></cell-list-item-edit>
                <cell-list-item-edit title="统一信用码" :isNoIcon="false" :isNoNull="false" :value="orgData.orgCode"></cell-list-item-edit>
                <cell-list-item-edit title="企业性质" :isNoIcon="false" :isNoNull="false" :value="orgData.natrue"></cell-list-item-edit>
                <cell-list-item-edit title="所属行业" :isNoIcon="false" :isNoNull="false" :value="orgData.industry"></cell-list-item-edit>
                <cell-list-item-edit title="企业规模" :isNoIcon="false" :isNoNull="false" :value="orgData.scale"></cell-list-item-edit>
                <cell-list-item-edit title="成立日期" :isNoIcon="false" :isNoNull="false" :value="orgData.regDateStr"></cell-list-item-edit>

                <cell-list-item-edit title="官方网址" :isNoIcon="false" :isNoNull="false" :value="orgData.website"></cell-list-item-edit>
            </div>

            <div class="cell-group">
                <cell-list-item-edit title="管理员姓名" :isNoIcon="false" :isNoNull="false" :value="orgData.contact"></cell-list-item-edit>
                <cell-list-item-edit title="管理员手机号码" :isNoIcon="false" :isNoNull="false" :value="orgData.phone"></cell-list-item-edit>
                <cell-list-item-edit title="管理员电子邮箱" :isNoIcon="false" :isNoNull="false" :value="orgData.email"></cell-list-item-edit>
            </div>
            <div class="cell-group">
                <cell-list-item-upimg title="营业执照" :isNoNull="false" :isNoImgSrc="false" :imgSrcProp="orgData.orgLicense ? retImgDomain+orgData.orgLicense : ''"></cell-list-item-upimg>
                <cell-list-item-upimg title="企业形象" :isNoNull="false" :isNoImgSrc="false" :imgSrcProp="orgData.orgImg ? retImgDomain+orgData.orgImg : ''"></cell-list-item-upimg>
                <cell-list-item-upimg title="企业logo" :isNoNull="false" :isNoImgSrc="false" :imgSrcProp="orgData.orgLogo ? retImgDomain+orgData.orgLogo : ''"></cell-list-item-upimg>
            </div>

            <div class="personalityLabel-section">
                <div class="personalityLabel-header border-bottom">企业简介</div>
                <div class="personalityLabel-content">
                    {{orgData.intro}}
                </div>
                <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
            </div>

            <div class="button">审核中</div>
        </div>

        <xy-dialog :title="dialogTitle" :message="reason" :showCancelButton="showCancelButton" v-if="isDialogShow" @confirmButton="confirmDialog" @cancelButton="cancelDialog">
        </xy-dialog>

    </div>
</template>

<script>
import cellListItemEdit from '@/components/cellListItemEdit'
import cellListItemInput from '@/components/cellListItemInput'
import cellListItemUpimg from "@/components/cellListItemUpimg.vue";
import xyDialog from '@/components/xyDialog'
import User from '@/api/modules/user'
export default {
    components: {
        xyDialog, cellListItemEdit, cellListItemInput,cellListItemUpimg
    },
    data() {
        return {
			showCancelButton:false,
			dialogTitle:"审核未通过",
            orgRegId: "",
            state: 0,
            isDialogShow: false,
            contentSu: 1,
            industryList: [
                "计算机/互联网/通信/电子",
                "会计/金融/银行/保险",
                "专业服务/教育/培训",
                "贸易/消费/制造/营运",
                "房地产/建筑",
                "能源/原材料",
                "广告/媒体",
                "制药/医疗",
                "物流/运输",
                "服务业",
                "政府",
                "非盈利机构",
                "其他行业"],
            scaleList: [
                "50人以内",
                "51-100人",
                "101-200人",
                "201-500人",
                "501-1000人",
                "1001-2000人",
                "2000人以上"],
            natureList: [
                "私营企业",
                "外资企业",
                "国有企业",
                "民办非企业",
                "政府机关",
                "事业单位",
                "其它"],
            typeList: ['市场主体（工商注册）', '机关群团（政府机关）', '事业单位', '社会企业（民政注册）', "中、高职院校"],
            OrgName: "",
            OrgOweName: "",
            OrgAdd: "",
            OrgCode: "",
            OrgType: "请选择",
            OrgNature: "请选择",
            OrgIndustry: "请选择",
            OrgScale: "请选择",
            AdminName: "",
            AdminPhone: "",
            AdminEmail: "",
            licenseSrc: "",
            OrgNet: "",
            imgSrc: "",
            logoSrc: "",
            intro: "",
            regDate: "请选择",
            reason: "",

            orgData: {}
        }
    },
    computed: {
        retImgDomain() {
            return this.$store.state.configData.imgDomain;
        },
    },
    onLoad({phone}) {
		this.$updateNavbarTitle("企业注册");
		this.AdminPhone=phone||"";
		this._userPhone=phone||"";//用户微信手机号
        let data=uni.getStorageSync("regOrg");
		if (!data||data.state == 1) {
			this.contentSu = 1; return;
		}
		if (data.state == 2) {
			this.orgRegId = data.orgRegId;
			this.state = 2;
			this.reason = data.reason;
			this.OrgType = this.typeList[data.orgType - 1];
			this.OrgName = data.orgName;
			this.OrgOweName = data.shortName;
			this.OrgAdd = data.address;
			this.OrgCode = data.orgCode;
			this.licenseSrc = data.orgLicense;
			this.logoSrc = data.orgLogo;
			this.imgSrc = data.orgImg;
			this.OrgNature = data.natrue;
			this.OrgIndustry = data.industry;
			this.OrgScale = data.scale;
			this.OrgNet = data.website;
			this.intro = data.intro || "";
			this.regDate = data.regDate.replace(" 00:00:00", "");
			this.AdminName = data.contact;
			this.AdminPhone = data.phone;
			this.AdminEmail = data.email;
			this.isDialogShow = true;
			this.contentSu = 1; return;
		}
		if (data.state == 3) {
			this.orgData = data;
			this.orgData.regDateStr = data.regDate.replace(" 00:00:00", "")
			this.contentSu = 3; return;
		}
		
		uni.removeStorage({
			key:"regOrg"
		});
    },
    methods: {
        onInputBlur() {
            // 兼容IOS输入法
            this.$iosScrollAuto();
        },
        onOrgName(e) {
            this.OrgName = e;
        },
        onOrgOweName(e) {
            this.OrgOweName = e;
        },
        onOrgType(e) {
            this.OrgType = this.typeList[e.mp.detail.value];
        },
        onOrgNature(e) {
            this.OrgNature = this.natureList[e.mp.detail.value];
        },
        onOrgIndustry(e) {
            this.OrgIndustry = this.industryList[e.mp.detail.value];
        },
        onOrgScale(e) {
            this.OrgScale = this.scaleList[e.mp.detail.value];
        },
        onRegDateClick(date) {
            this.regDate = date.mp.detail.value;
        },
        onOrgAdd(e) {
            this.OrgAdd = e;
        },
        onOrgCode(e) {
            this.OrgCode = e;
        },
        onOrgNet(e) {
            this.OrgNet = e;
        },
        onAdminName(e) {
            this.AdminName = e;
        },
        onAdminPhone(e) {
            this.AdminPhone = e
        },
		onAdminPhoneFocus(){
			console.log("onAdminPhoneFocus");
		},
        onAdminEmail(e) {
            this.AdminEmail = e;
        },
        onLicense(e) {
            this.licenseSrc = e;
        },
        onImg(e) {
            this.imgSrc = e;
        },
        onLogo(e) {
            this.logoSrc = e;
        },
		confirmDialog(){
			this.isDialogShow=false;
			this.reason="";
			this.dialogTitle="审核未通过";
			if(this.contentSu==1){
				this.surePhone=true;
				this.onClick();
			}else{
				this.showCancelButton=false;
			}
		},
		cancelDialog(){
			this.showCancelButton=false;
			this.isDialogShow=false;
			this.reason="";
			this.dialogTitle="审核未通过";
		},
        subBtn() {
			uni.redirectTo({
				url:`/pages/login/index`
			});
        },
        onClick() {
			if(this._userPhone&&this.AdminPhone){
				if(this._userPhone!=this.AdminPhone&&!this.surePhone){
					this.showCancelButton=true;
					this.isDialogShow=true;
					this.dialogTitle="提示";
					this.reason="管理员手机号不是您微信绑定号码，会影响审核进度查询，确认继续？"
					return ;
				}
			}
            if (!this.OrgName) {
                this.$toast("企业名称不能为空！"); return;
            }
            if (!this.OrgOweName) {
                this.$toast("企业简称不能为空！"); return;
            }
            if (this.OrgType == "请选择") {
                this.$toast("企业类型不能为空！"); return;
            }
            if (this.OrgNature == "请选择") {
                this.$toast("企业性质不能为空！"); return;
            }
            if (this.OrgIndustry == "请选择") {
                this.$toast("企业行业不能为空！"); return;
            }
            if (this.OrgScale == "请选择") {
                this.$toast("企业规模不能为空！"); return;
            }
            if (!this.AdminName) {
                this.$toast("管理员名称不能为空！"); return;
            }
            if (this.AdminPhone.length != 11) {
                this.$toast("管理员手机号码不合法"); return;
            }
            if (!this.licenseSrc && this.OrgType != "机关群团（政府机关）" && this.OrgType != "事业单位" && this.OrgType != "中、高职院校") {
                this.$toast("营业执照不能为空！"); return;
            }
            if (!this.logoSrc) {
                this.$toast("企业logo不能为空！"); return;
            }
            if (!this.OrgAdd) {
                this.$toast("企业地址不能为空！"); return;
            }
            if (!this.OrgCode && this.OrgType != "机关群团（政府机关）" && this.OrgType != "事业单位" && this.OrgType != "中、高职院校") {
                this.$toast("统一信用码不能为空！"); return;
            }
            if (!this.intro) {
                this.$toast("企业简介不能为空！"); return;
            }
            let data = {
                orgName: this.OrgName,
                siteHierarchy: this.$store.state.configData.hierarchy,
                shortName: this.OrgOweName,
                address: this.OrgAdd,
                orgCode: this.OrgCode,
                orgLicense: this.licenseSrc,
                orgLogo: this.logoSrc,
                orgImg: this.imgSrc,
                natrue: this.OrgNature,
                industry: this.OrgIndustry,
                scale: this.OrgScale,
                website: this.OrgNet,
                intro: this.intro,
                regDate: this.regDate == "请选择" ? "" : this.regDate + " 00:00:00",
                contact: this.AdminName,
                phone: this.AdminPhone,
                email: this.AdminEmail,
                orgType: this.typeList.indexOf(this.OrgType) + 1
            }
            if (this.state == 2) {
                data.orgRegId = this.orgRegId;
                User.updateOrgReg(data).then(res => {
                    this.contentSu = 2;
                });
            } else {
                User.createOrgReg(data).then(res => {
                   this.contentSu = 2;
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .mine-org-reg {
      min-height: 100%;
    }
    .mine-org-reg-f2 {
      background-color: #f2f2f2;
      padding-bottom: 100upx;
    }
    .mine-org-reg-ff {
      background-color: #ffffff;
      padding-bottom: 0;
    }
    .cell-group {
      margin-bottom: 20upx;
      background-color: #fff;
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
      height: 320upx;
      color: #999;
    }
    .textarea-input-icon {
      position: absolute;
      bottom: 30upx;
      right: 20upx;
      color: #ccc;
    }
    .button {
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 80;
      height: 98upx;
      line-height: 98upx;
      color: #fff;
      background: $color-main;
      font-size: 34upx;
      text-align: center;
      margin-top: 20upx;
    }
    .content-su {
      text-align: center;
      padding: 30upx;
    }
    .icon-yibaoming {
      color: $color-main;
      font-size: 200upx;
    }
    .content-su-text {
      font-size: 40upx;
      color: rgb(0, 0, 0);
      margin-bottom: 60upx;
      margin-top: 60upx;
    }
    .button-su {
      border-radius: 10upx;
      height: 98upx;
      line-height: 98upx;
      color: #fff;
      background: $color-main;
      font-size: 34upx;
      text-align: center;
      margin-top: 20upx;
    }
</style>
