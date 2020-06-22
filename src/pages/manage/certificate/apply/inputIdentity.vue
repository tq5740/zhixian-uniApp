<template>
	<view class="class-detail page-full">
		<view class="block">
			<info-image title="证件照" :value="idPhoto" path="/user/user/id" @imageChoose="imageChoose($event,'idPhoto')" placeholder="请上传证件照" :width="120" horizontal required canUpload></info-image>
		</view>
		<view class="block">
			<info-text title="身份证号" :value="idNumber" required></info-text>
			<info-input title="姓名" :value="name" @onInputConfirm="imageChoose($event,'name')" placeholder="请输入姓名" required></info-input>
			<info-input title="手机号" :value="phone" @onInputConfirm="imageChoose($event,'phone')" placeholder="请输入手机号" required></info-input>
			<info-input title="民族" :value="nation" @onInputConfirm="imageChoose($event,'nation')" placeholder="请输入民族" required></info-input>
			<info-radio title="性别" :value="sex" @onRadioChange="imageChoose($event,'sex')" :options="sexList" required></info-radio>
			<info-input title="住址" :value="address" @onInputConfirm="imageChoose($event,'address')" placeholder="请输入住址" required></info-input>
			<info-picker title="出生日期" :value="birthdayDate" @onPickerChoose="onPickerChoose($event,'birthdayDate')" mode="date" placeholder="请选择出生日期" required></info-picker>
			<info-input title="签发机关" :value="issued" @onInputConfirm="imageChoose($event,'issued')" placeholder="请输入签发机关" required></info-input>
			<info-picker title="签发日期" :value="startDate" @onPickerChoose="onPickerChoose($event,'startDate')" mode="date" placeholder="请选择签发日期" required></info-picker>
			<info-picker title="失效日期" :value="endDate" @onPickerChoose="onPickerChoose($event,'endDate')" mode="date" placeholder="请选择失效日期" required></info-picker>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
		
	</view>
</template>

<script>
	import infoText from "@/components/infoText.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoImage from "@/components/infoImage.vue"
	import infoRadio from "@/components/infoRadio.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import userApi from "@/api/modules/user.js"
	export default {
		components:{infoText,infoInput,infoImage,infoRadio,infoPicker},
		data() {
			return {
				idPhoto:"",
				name:"",
				sex:1,
				nation:"",
				address:"",
				idNumber:"",
				issued:"",
				startDate:"",
				endDate:"",
				birthdayDate:"",
				classUserId:"",
				hierarchy:"",
				phone:"",
				sexList:[{text:"男",value:1},{text:"女",value:2}]
			};
		},
		onLoad({id,hierarchy,idNumber,name,phone}) {
			this.$updateNavbarTitle("身份录入");
			this.classUserId=id;
			this.hierarchy=hierarchy;
			this.idNumber=idNumber;
			this.name=name;
			this.phone=phone;
		},
		methods: {
			imageChoose(val,key) {
				this[key]=val;
			},
			onPickerChoose(val,key) {
				this[key]=val.value;
			},
			onMsgConfirm(key) {
				uni.showLoading();
				userApi.getGeneratePhone().then(data => {
					uni.hideLoading();
					this.phone=data;
				});
			},
			onToEdit(){
				if(this.$isHaveEmpty([this.idPhoto,this.name,this.sex,this.nation,this.address,this.idNumber,this.issued,this.startDate,this.endDate,this.birthdayDate,this.phone])){
					this.$toast("请填写完整信息");return;
				}
				if(!this.$mobileReg(this.phone)){
					this.$toast("请填写正确的手机号");return;
				}
				uni.showLoading();
				let rqData={
					idPhoto:this.idPhoto,
					name:this.name,
					sex:this.sex,
					nation:this.nation,
					address:this.address,
					idNumber:this.idNumber,
					issued:this.issued,
					startDate:this.startDate,
					endDate:this.endDate,
					birthdayDate:this.birthdayDate,
					phone:this.phone,
					classUserId:this.classUserId,
					hierarchy:this.hierarchy
				}
				userApi.postPrintIdcardAuth(rqData).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:`录入成功`,
						complete:()=> {
							this._refreshPrePage();
						}
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000);
				}).catch(code=>{
					uni.hideLoading();
					if(code==2053){
						this.$refs.msg.show(`该手机号码已被认证，是否需要系统随机生成手机号码？（也可以自行更换手机号码认证）
`);
					}else{
						this.$toast(code);
					}
				});
			}
		},
	}
</script>

<style lang="scss">
	.block{margin-bottom: 20upx;}
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
