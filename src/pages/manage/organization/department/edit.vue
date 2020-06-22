<template>
	<view class="page-full">
		<info-input title="部门名称" :value="deptName" @onInputConfirm="onInputConfirm($event,'deptName')" required placeholder="部门名称"></info-input>
		
		<view v-if="create">
			<info-picker title="上级分类" :value="parentText" @onPickerChoose="onPickerChoose($event,'parentId')" showChoose showSearch :dataList="categoryList" required placeholder="请选择"></info-picker>
			<info-picker title="部门类型" :value="typeText" @onPickerChoose="onPickerChoose($event,'type')" mode="selector"  :dataList="typeList" required placeholder="请选择" class="block"></info-picker>
			<view  v-show="type!=9">
				<info-input title="企业简称" :value="shortName" @onInputConfirm="onInputConfirm($event,'shortName')" required placeholder="企业简称"></info-input>
				<info-picker title="注册时间" :value="regDate" @onPickerChoose="onPickerChoose($event,'regDate')" showChoose mode="date" required placeholder="请选择"></info-picker>
				<info-input title="注册地址" :value="address" @onInputConfirm="onInputConfirm($event,'address')" required placeholder="注册地址"></info-input>
				<info-input title="统一信用码" :value="orgCode" @onInputConfirm="onInputConfirm($event,'orgCode')" :required="type!=2&&type!=3&&type!=5" placeholder="统一信用码" class="block"></info-input>
				<info-picker title="所属行业" :value="industry" @onPickerChoose="onPickerChoose($event,'industry')" mode="selector" :dataList="industryList" required placeholder="请选择"></info-picker>
				<info-picker title="企业性质" :value="natrue" @onPickerChoose="onPickerChoose($event,'natrue')" mode="selector" :dataList="natureList" required placeholder="请选择"></info-picker>
				<info-picker title="企业规模" :value="scale" @onPickerChoose="onPickerChoose($event,'scale')" mode="selector" :dataList="scaleList" required placeholder="请选择"></info-picker>
				<info-input title="官方网址" :value="website" @onInputConfirm="onInputConfirm($event,'website')"  placeholder="例：http://www.baidu.com/" class="block"></info-input>
				<info-input title="管理员姓名" :value="contact" @onInputConfirm="onInputConfirm($event,'contact')" required placeholder="管理员姓名"></info-input>
				<info-input title="管理员电话" :value="phone" @onInputConfirm="onInputConfirm($event,'phone')" required placeholder="管理员电话"></info-input>
				<info-input title="管理员邮箱" :value="email" @onInputConfirm="onInputConfirm($event,'email')" placeholder="管理员邮箱" class="block"></info-input>
				<info-image title="营业执照" :value="orgLicense" @imageChoose="onInputConfirm($event,'orgLicense')" placeholder="手机拍照或上传" path="/user/org/license" :width="210" :height="297" :required="type!=2&&type!=3&&type!=5" canUpload class="block"></info-image>
				<info-image title="企业LOGO" :value="orgLogo" @imageChoose="onInputConfirm($event,'orgLogo')" placeholder="请上传组织LOGO" path="/user/org/logo" :width="120" required canUpload class="block"></info-image>
				<info-image title="企业形象" :value="orgImg" @imageChoose="onInputConfirm($event,'orgImg')" placeholder="手机拍照或上传" path="/user/org/img" :width="214" :height="120" canUpload class="block"></info-image>
				<info-textarea  title="企业简介" :value="intro" @onTextAreaConfirm="onInputConfirm($event,'intro')" required class="block"></info-textarea>
			</view>
		</view>
		
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import infoImage from "@/components/infoImage.vue"
	import infoTextarea from "@/components/infoTextarea.vue"
	import userApi from "@/api/modules/user.js"
	import {list2FilterList,getIndustryList,getNatureList,getScaleList,creditCode,checkEmail2} from "@/utils/utils.js"
	export default {
		components: {
			infoInput,infoPicker,infoImage,infoTextarea
		},
		data() {
			return {
				create:false,
				deptId:"",
				deptName:"",
				parentText:"",
				parentId:"",
				typeText:"部门",
				type:9,
				shortName:"",
				regDate:"",
				address:"",
				orgCode:"",
				industry:"计算机/互联网/通信/电子",
				natrue:"私营企业",
				scale:"50人以内",
				website:"",
				contact:"",
				phone:"",
				email:"",
				orgLicense:"",
				orgImg:"",
				orgLogo:"",
				intro:"",
				categoryList:[],
				typeList:[
					 {name:"市场主体",value:1},
					 {name:"机关群团",value:2},
					 {name:"事业单位",value:3},
					 {name:"社会组织",value:4},
					 {name:"中/高职院校",value:5},
					 {name:"部门",value:9}],
				industryList: getIndustryList(),
				natureList: getNatureList(),
				scaleList: getScaleList(),
			};
		},
		onLoad({create,deptId,deptName}) {
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建部门");
				userApi.getDeptList().then(data=>{
					list2FilterList(data,"deptName","deptId");
					this.categoryList=data;
				}).catch(err => {
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
							duration: 2000,
							icon: "none"
						});
					});
			}else{
				this.$updateNavbarTitle("编辑部门");
				this.deptName=deptName;
				this.deptId=deptId;
			}
		},
		methods:{
			onToEdit(){
				if(this.$isHaveEmpty([this.deptName])){
					uni.showToast({
						title:"请填写部门名称",icon:"none"
					});return;
				}
				let rqData={
					deptName:this.deptName,
					type:this.type
				}
				if(this.create){
					if(this.$isEmpty(this.parentId)){
						uni.showToast({
							title:"请选择上级分类",icon:"none"
						});return;
					}
					rqData.parentId=this.parentId;
				}
				if(this.type!=9){
					if(this.$isHaveEmpty([this.shortName,this.regDate,this.address,this.industry,this.natrue,this.scale,this.contact,this.phone,this.orgLogo,this.intro])){
						uni.showToast({
							title:"请填写完整信息",icon:"none"
						});return;
					}
					if(!this.$isEmpty(this.email)&&!checkEmail2(this.email)){
						this.$toast("请输入正确的管理员邮箱");return;
					}
					if(!this.$mobileReg(this.phone)){
						this.$toast("请输入正确的管理员手机号");return;
					}
					if(this.type!=2&&this.type!=3&&this.type!=5){
						if(this.$isHaveEmpty([this.orgCode,this.orgLicense])){
							uni.showToast({
								title:"请填写完整信息",icon:"none"
							});return;
						}
						if(!creditCode(this.orgCode)){
							this.$toast("请输入正确的统一社会信用码");return;
						}
						rqData.orgCode=this.orgCode;
						rqData.orgLicense=this.orgLicense;
					}
					rqData.shortName=this.shortName;
					rqData.regDate=this.regDate;
					rqData.address=this.address;
					rqData.industry=this.industry;
					rqData.natrue=this.natrue;
					rqData.scale=this.scale;
					rqData.contact=this.contact;
					rqData.phone=this.phone;
					rqData.email=this.email;
					rqData.orgLogo=this.orgLogo;
					rqData.intro=this.intro;
					
					rqData.website=this.website;
				}
				
				uni.showLoading();
				let r_=undefined;
				if(this.create){
					r_=userApi.postCreateDept(rqData);
				}else{
					rqData.deptId=this.deptId;
					r_=userApi.postUpdateDept(rqData);
				}
				if(r_){
					r_.then(data=>{
						uni.hideLoading();
						uni.showToast({
							title:`${this.create?"创建":"修改"}成功`,
							complete:()=> {
								this._refreshPrePage({
									handler:function(page){
										// #ifdef MP-WEIXIN
											page.onShow(true);
										// #endif
										// #ifdef H5
											page.getCategoryList();
										// #endif
									}
								});
							}
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							});
						},2000);
					}).catch(err => {
						uni.hideLoading();
					});
				}
			},
			onInputConfirm(val,key){
				this[key]=val;
			},
			onPickerChoose(choose,key){
				if(key=="parentId"){
					this.parentText=choose.text;
				}else if(key=="type"){
					this.typeText=choose.text;
				}
				this[key]=choose.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.block{
		margin-bottom: 20upx;
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
