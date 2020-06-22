<template>
	<view class="basic">
		<search-select :dataList="orgList" :showSearch="false" @onPickerChoose="onPickerChoose" ></search-select>
		<view class="">
			<info-image title="站点LOGO" :value="siteLogo" @imageChoose="imageChoose" placeholder="手机拍照或上传" canUpload horizontal :width="120"></info-image>
			<view class="separate"></view>
			<info-input title="站点名称" :value="siteName" @onInputConfirm="onInputConfirm($event,'siteName')" placeholder="请填写站点名称" required></info-input>
			<view class="separate"></view>
			<info-input title="二级域名" :value="twoDomain" @onInputConfirm="onInputConfirm($event,'twoDomain')" placeholder="请填写二级域名(至少3位)"></info-input>
			<view class="separate">
				<text>*二级域名和主域名请选填一个</text>
			</view>
			<info-input title="自主域名" :value="selfDomain" @onInputConfirm="onInputConfirm($event,'selfDomain')" placeholder="请填写主域名"></info-input>
			<view class="separate">
				<text>*请将您的域名解析至：140.143.84.249</text>
			</view>
			<info-input title="AppId" :value="wxAppId" @onInputConfirm="onInputConfirm($event,'wxAppId')" placeholder="请填写AppId"></info-input>
			<info-input title="AppSecret" :value="wxAppSecret" @onInputConfirm="onInputConfirm($event,'wxAppSecret')" placeholder="请填写AppSecret" ></info-input>
			<info-input title="小程序AppId" :value="xcxAppId" @onInputConfirm="onInputConfirm($event,'xcxAppId')" placeholder="请填写小程序AppId"></info-input>
			<info-input title="小程序AppSecret" :value="xcxAppSecret" @onInputConfirm="onInputConfirm($event,'xcxAppSecret')" placeholder="请填写小程序AppSecret" ></info-input>
			<view class="separate"></view>
			<info-input title="客服QQ" :value="serviceQq" @onInputConfirm="onInputConfirm($event,'serviceQq')" placeholder="请填写客服QQ"></info-input>
			<info-input title="客服电话" :value="serviceTel" @onInputConfirm="onInputConfirm($event,'serviceTel')" placeholder="请填写客服电话" ></info-input>
		</view>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import userApi from "@/api/modules/user.js"
	import {list2FilterList} from "@/utils/utils.js"
	import infoImage from "@/components/infoImage.vue"
	import infoInput from "@/components/infoInput.vue"
	import searchSelect from "@/components/searchSelect.vue"
	
	export default {
		components: {
			infoImage,infoInput,searchSelect
		},
		data() {
			return {
				orgId:undefined,
				orgList: [],
				siteName:"",
				siteLogo:"",
				twoDomain:"",
				selfDomain:"",
				serviceQq:"",
				serviceTel:"",
				wxAppId:"",
				wxAppSecret:"",
				xcxAppId:"",
				xcxAppSecret:""
			}
		},
		onLoad() {
			this.$updateNavbarTitle("基本配置");
			let selfOrg=this.$store.state.userInfo.org;
			let orgId=selfOrg.orgId;
			this.orgId=orgId;
			this.getOrgsite(orgId);
			userApi.getQueryMyorgList().then(data => {
				list2FilterList(data, "orgName", "orgId");
				let i=data.findIndex(v=>{
					return v.value==orgId;
				});
				if(i!=-1){
					let org=data.splice(i,1)[0];
					org.choose=true;
					data.unshift(org);
				}else{
					data.unshift({name:selfOrg.orgName,value:selfOrg.orgId,choose:true});
				}
				this.orgList = data;
			}).catch(err => {
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					icon: "none"
				})
			});
		},
		methods: {
			onPickerChoose(obj){
				this.orgId=obj;
				this.getOrgsite(obj);
			},
			getOrgsite(orgId){
				userApi.getOrgsite(orgId).then(data=>{
					if(!data){
						uni.showToast({
							icon:"none",
							title:"暂无站点信息"
						});
						this.siteName="";
						this.siteLogo="";
						this.twoDomain="";
						this.selfDomain="";
						this.serviceQq="";
						this.serviceTel="";
						this.wxAppId="";
						this.wxAppSecret="";
						this.xcxAppId="";
						this.xcxAppSecret="";
						return;
					}
					this.siteName=data.siteName;
					this.siteLogo=data.siteLogo;
					this.twoDomain=data.twoDomain;
					this.selfDomain=data.selfDomain;
					this.serviceQq=data.serviceQq;
					this.serviceTel=data.serviceTel;
					this.wxAppId=data.wxAppId;
					this.wxAppSecret=data.wxAppSecret;
					this.xcxAppId=data.xcxAppId;
					this.xcxAppSecret=data.xcxAppSecret;
				}).catch(err=>{
					uni.showToast({
						icon:"none",
						title: typeof err == "string" ? err : err.toString()
					})
				});
			},
			onToEdit(){
				if(!this.siteName){
					uni.showToast({
						icon:"none",
						title:"请填写站点名称"
					});
					return;
				}
				let rqData={
					orgId:this.orgId,
					siteName:this.siteName,
					siteLogo:this.siteLogo,
					serviceQq:this.serviceQq,
					serviceTel:this.serviceTel,
					twoDomain:this.twoDomain,
					selfDomain:this.selfDomain,
					wxAppId:this.wxAppId,
					wxAppSecret:this.wxAppSecret,
					xcxAppId:this.xcxAppId,
					xcxAppSecret:this.xcxAppSecret,
				}
				userApi.postUpdateOrgsite(rqData).then(data=>{
					uni.showToast({
						title:"修改成功"
					})
				}).catch(err=>{
					uni.showToast({
						icon:"none",
						title:err
					})
				});
			},
			imageChoose(img){
				this.siteLogo=img;
			},
			onInputConfirm(val,key){
				this[key]=val;
			}
		}
	}
</script>

<style scoped lang="scss">
.basic{
	min-height: 100%;background: $color-f2;
}
.separate{
	&{min-height: 20upx;color: #FC703E;font-size:$font-size-24;}
	text{display: block;margin: 18upx 27upx 27upx;}
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
