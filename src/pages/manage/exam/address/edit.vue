<template>
	<view class="address-edit">
		<view class="info-list">
			<info-picker title="企业名称" :text="orgName" :dataList="orgList" showSearch placeholder="请选择企业" @onPickerChoose="onPickerChoose($event,'org')"  required></info-picker>
			<info-input title="考试地址名称" :value="examAddressTitle" @onInputConfirm="onInputConfirm($event,'examAddressTitle')"  placeholder="请填写名称，如：第一考场" required></info-input>
			<view @tap="chooseAddress">
				<info-text title="考试地址" :value="address?address:'请填写并选择考试地址'" :color="address?'#000000':'#999999'" required></info-text>
			</view>
			<info-input title="门牌号" :value="doorNumber" @onInputConfirm="onInputConfirm($event,'doorNumber')"  placeholder="请填写门牌号"></info-input>
		</view>
		<view class="confirm-btn" @tap="onToCrate">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import userApi from "@/api/modules/user.js"
	import {list2FilterList,getAddressInfo} from "@/utils/utils.js"
	import infoInput from "@/components/infoInput.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import infoText from "@/components/infoText.vue"
	
	export default {
		components: {
			infoInput,infoPicker,infoText
		},
		data(){
			return {
				orgList:[],
				orgId:undefined,
				orgName:undefined,
				examAddressTitle:"",
				address:"",
				doorNumber:"",
				addressId:undefined
			}
		},
		onLoad({create,address}) {
			this.getOrgList();
			if(create){
				this.create=create;
				this.$updateNavbarTitle("创建地址");
				this.orgId=this.$store.state.userInfo.org.orgId;
				this.orgName=this.$store.state.userInfo.org.orgName;
			}else{
				this.$updateNavbarTitle("编辑地址");
				let a=JSON.parse(address);
				this.examAddressId=a.examAddressId;
				this.orgId=a.orgId;
				this.orgName=a.org.orgName;
				this.examAddressTitle=a.examAddressTitle;
				this.address=(a.province||"")+(a.city||"")+(a.district||"")+(a.street||"");
				this.province=a.province;
				this.city=a.city;
				this.district=a.district;
				this.street=a.street;
				this.doorNumber=a.doorNumber||"";
				this.lng=a.lng;
				this.lat=a.lat;
			}
		},
		methods:{
			async getOrgList(){
				 userApi.getQueryMyorgList().then(data=>{
					 list2FilterList(data,"orgName","orgId")
					this.orgList=data;
				});
			},
			onToCrate(){
				if(this.$isHaveEmpty([this.examAddressTitle,this.address,this.orgId])){
					uni.showToast({
						title:"请填写完整信息",
						icon:"none"
					});
					return ;
				}
				uni.showLoading({
					title:"请稍等"
				});
				let rqData={
					examAddressTitle:this.examAddressTitle,
					province:this.province||"",
					city:this.city||"",
					district:this.district||"",
					street:this.street||"",
					lat:this.lat,
					lng:this.lng,
					doorNumber:this.doorNumber,
					orgId:this.orgId
				}
				let r_=undefined;
				if(this.create){
					r_=examApi.postCreateExamAddressAdmin(rqData);
				}else{
					rqData.examAddressId=this.examAddressId;
					r_=examApi.postUpdateExamAddressAdmin(rqData);
				}
				if(r_){
					r_.then(data=>{
						uni.hideLoading();
						uni.showToast({
							title:`${this.create?"创建":"编辑"}成功`,
							complete:()=> {
								this._refreshPrePage();
							}
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							});
						},2000);
					}).catch(err=>{
						uni.hideLoading();
						uni.showToast({
							title:err,
							icon:"none"
						});
					})
				}
			},
			chooseAddress(){
				let self_=this;
				uni.chooseLocation({
					success(res) {
						self_.lng=res.longitude;
						self_.lat=res.latitude;
						self_.address=res.address;
						userApi.getAddrByLngLat({
							lng:res.longitude,
							lat:res.latitude
						}).then((data=>{
							let address=getAddressInfo(data.address);
							self_.province=address.province;
							self_.city=address.city;
							self_.district=address.district;
							self_.street=address.street;
						}));
					}
				})
			},
			onPickerChoose(choose,flag){
				if(flag=="org"){
					this.orgName=choose.text;
					this.orgId=choose.value;
				}else if(flag=="area"){
					let text_="";
					this.areaList=choose.value;
					choose.value.forEach(v=>{
						text_=text_+v;
					});
					this.area=text_;
				}
			},
			onInputConfirm(value,key){
				this[key]=value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-edit{height: 100%;background: $color-f2;}
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
