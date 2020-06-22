<template>
	<view class="organization-edit page-full">
		<view class="block">
			<info-text title="企业名称" :value="orgName"></info-text>
			<info-text title="统一信用代码" :value="orgCode"></info-text>
		</view>
		<view class="block">
			<info-input title="企业简称"  :value="shortName" @onInputConfirm="onInputConfirm($event,'shortName')" placeholder="请填写企业简称"  required></info-input>
			<info-picker title="所属行业" :value="industry" @onPickerChoose="onPickerChoose($event,'industry')" placeholder="请选择" :dataList="industryList" required></info-picker>
			<info-picker title="企业性质" :value="natrue" @onPickerChoose="onPickerChoose($event,'natrue')" placeholder="请选择" :dataList="natureList" required></info-picker>
			<info-picker title="企业规模" :value="scale" @onPickerChoose="onPickerChoose($event,'scale')" placeholder="请选择" :dataList="scaleList" required></info-picker>
			<info-input title="官方网址" :value="website" @onInputConfirm="onInputConfirm($event,'website')" placeholder="例：http://www.baidu.com/"></info-input>
		</view>
		<view class="block">
			<info-text title="成立日期" :value="createTime" placeholder="请选择"></info-text>
			<info-text title="注册地址" :value="address" placeholder="请选择"></info-text>
		</view>
		<view class="block">
			<info-image title="营业执照" :value="orgLicense" @imageChoose="onInputConfirm($event,'orgLicense')" placeholder="手机拍照或上传" path="/user/org/license" :width="210" :height="297" :required="orgType!=2&&orgType!=3&&orgType!=5" canUpload></info-image>
		</view>
		<view class="block">
			<info-image title="企业形象" :value="orgImg" @imageChoose="onInputConfirm($event,'orgImg')" placeholder="手机拍照或上传" path="/user/org/img" :width="214" :height="120" canUpload></info-image>
		</view>
		<view class="block">
			<info-image title="企业LOGO" :value="orgLogo" @imageChoose="onInputConfirm($event,'orgLogo')" placeholder="请上传企业LOGO" path="/user/org/logo" :width="120" required canUpload></info-image>
		</view>
		<view class="block">
			<info-richtext  title="企业简介（请在pc端排版编辑）" :value="$escape2Html(intro)"></info-richtext>
		</view>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoText from "@/components/infoText.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import infoImage from "@/components/infoImage.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoRichtext from "@/components/infoRichtext.vue"
	import userApi from "@/api/modules/user.js"
	import { getOrgType } from "@/utils/utils"
	let OrgTypeList=getOrgType();
	export default {
		components: {
			infoText, infoPicker, infoImage,infoInput,infoRichtext
		},
		data() {
			return {
				orgId:"",
				orgName:"",
				orgCode:"",
				shortName:"",
				industry:"",
				natrue:"",
				scale:"",
				website:"",
				phone:"",
				createTime:"",
				address:"",
				orgLicense:"",
				orgImg:"",
				orgLogo:"",
				intro:"", 
				orgType:"",
				industryList: [
                {name:"计算机/互联网/通信/电子",value:"计算机/互联网/通信/电子"},
                {name:"会计/金融/银行/保险",value:"会计/金融/银行/保险"},
                {name:"专业服务/教育/培训",value:"专业服务/教育/培训"},
                {name:"贸易/消费/制造/营运",value:"贸易/消费/制造/营运"},
                {name:"房地产/建筑",value:"房地产/建筑"},
                {name:"能源/原材料",value:"能源/原材料"},
                {name:"广告/媒体",value:"广告/媒体"},
                {name:"制药/医疗",value:"制药/医疗"},
                {name:"物流/运输",value:"物流/运输"},
                {name:"服务业",value:"服务业"},
                {name:"政府",value:"政府"},
                {name:"非盈利机构",value:"非盈利机构"},
                {name:"其他行业",value:"其他行业"}],
				natureList: [
					 {name:"私营企业",value:"私营企业"},
					 {name:"外资企业",value:"外资企业"},
					 {name:"国有企业",value:"国有企业"},
					 {name:"民办非企业",value:"民办非企业"},
					 {name:"政府机关",value:"政府机关"},
					 {name:"事业单位",value:"事业单位"},
					 {name:"其它",value:"其它"}],
				
				scaleList: [
					 {name:"50人以内",value:"50人以内"},
					 {name:"51-100人",value:"51-100人"},
					 {name:"101-200人",value:"101-200人"},
					 {name:"201-500人",value:"201-500人"},
					 {name:"501-1000人",value:"501-1000人"},
					 {name:"1001-2000人",value:"1001-2000人"},
					 {name:"2000人以上",value:"2000人以上"}],
			}
		},
		onLoad({id}) {
			this.orgId=id;
			userApi.getQueryOrg(id).then(data=>{
				this.orgName=data.orgName;
				this.orgCode=data.orgCode;
				this.shortName=data.shortName;
				this.industry=data.industry;
				this.natrue=data.natrue;
				this.scale=data.scale;
				this.website=data.website;
				this.phone=data.phone;
				this.createTime= this.$formatDate(data.createTime, "YYYY-MM-DD");
				this.address=data.address;
				this.orgLicense=data.orgLicense;
				this.orgImg=data.orgImg;
				this.orgLogo=data.orgLogo|| this.$store.state.defaultImg.logo
				this.intro=data.intro;
				this.orgType=data.orgType;
			});
		},
		onShow() {
			this.$updateNavbarTitle("编辑企业");
		},
		methods: {
			onInputConfirm(value,key){
				this[key]=value;
			},
			onPickerChoose({value},key){
				this[key]=value;
			},
			onToEdit() {
				if(this.$isHaveEmpty([this.shortName,this.industry,this.natrue,this.scale])){
					this.$toast("请填写完整信息");return;
				}
				if((this.orgType!=2&&this.orgType!=3&&this.orgType!=5)&&this.$isEmpty(this.orgLicense)){
					this.$toast("请上传营业执照");return;
				}
				let rqData={
					orgId:this.orgId,
					shortName:this.shortName,
					industry:this.industry,
					natrue:this.natrue,
					scale:this.scale,
					orgLicense:this.orgLicense,
					website:this.website,
					orgImg:this.orgImg,
					orgLogo:this.orgLogo
				}
				userApi.postUpdateOrg(rqData).then(data=>{
					this.$toast("修改成功");
					this._refreshPrePage();
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000);
				}).catch(e=>{
					this.$toast(e);
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.block{
		margin-bottom: 20upx;
	}
	.page-full{
		padding-bottom: 1upx;
	}
	.confirm-btn {
	  $height: 88upx;
	  width: 690upx;
	  height: $height;
	  line-height: $height;
	  text-align: center;
	  background: $color-main;
	  border-radius: 10upx;
	  color: #fff;
	  font-size: $font-size-32;
	  margin: 40upx auto;
	}
</style>
