<template>
	<view class="exam-edit page-full">
		<view class="block">
			<template v-if="create">
				<info-picker title="企业名称" :text="orgName" showSearch @onPickerChoose="onPickerChoose($event,'orgId')" :dataList="orgList" required placeholder="请选择"></info-picker>
			</template>
			<template v-else>
				<info-text title="企业名称" :value="orgName" required></info-text>
			</template>
			<info-input title="题库标题" :value="examBankTitle" @onInputConfirm="onInputConfirm($event,'examBankTitle')" required placeholder="请填写题库标题"></info-input>
			<info-picker title="可见范围" :text="visibleRangeText" @onPickerChoose="onPickerChoose($event,'visibleRange')" :dataList="visibleRangeList" required placeholder="请选择"></info-picker>
		</view>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoPicker from "@/components/infoPicker.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoText from "@/components/infoText.vue"
	import userApi from "@/api/modules/user.js"
	import examApi from "@/api/modules/exam.js"
	import {list2FilterList} from "@/utils/utils.js"
	
	export default {
		components: {
			infoPicker,infoInput, infoText
		},
		data() {
			return {
				create:false,
				examBankId:undefined,
				orgId:undefined,
				orgName:"",
				examBankTitle:"",//题库
				visibleRange:3,
				visibleRangeText:"开放",
				orgList:[],
				visibleRangeList:[{name:'仅自己',value:1},{name:'本企业',value:2},{name:'开放',value:3}],
			};
		},
		onLoad({create,bank}) {
			userApi.getQueryMyorgList().then(data=>{
				list2FilterList(data,"orgName","orgId");
				this.orgList=data;
			});
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建题库");
				this.orgId=this.$store.state.userInfo.org.orgId;
				this.orgName=this.$store.state.userInfo.org.orgName;
			}else{
				this.$updateNavbarTitle("编辑题库");
				bank=JSON.parse(bank);
				this.examBankId=bank.examBankId;
				this.examBankTitle=bank.examBankTitle;
				this.orgId=bank.orgId;
				this.orgName=bank.orgModelBO.orgName;
				this.visibleRange=bank.visibleRange;
				this.visibleRangeText=this.visibleRangeList.find(v=>{
					return v.value==bank.visibleRange;
				}).name;
			}
		},
		methods: {
			onInputConfirm(val,key){
				this[key]=val;
			},
			onPickerChoose(choose,key){
				if(key=="orgId"){
					this.orgName=choose.text;
				}else if(key=="visibleRange"){
					this.visibleRangeText=choose.text;
				}
				this[key]=choose.value;
			},
			onToEdit(){
				if(this.$isHaveEmpty([this.orgId,this.examBankTitle,this.visibleRange])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				let rqData={
					orgId:this.orgId,
					examBankTitle:this.examBankTitle,
					visibleRange:this.visibleRange,
				}
				let r_=undefined;
				uni.showLoading();
				if(this.create){
					r_=examApi.postCreateExamBankAdmin(rqData);
				}else{
					rqData.examBankId=this.examBankId;
					r_=examApi.postUpdateExamBankAdmin(rqData);
				}
				
				if(r_){
					r_.then(data=>{
						uni.hideLoading();
						uni.showToast({
							title:`${this.create?"创建":"修改"}成功`,
							complete:()=> {
								this._refreshPrePage();
							}
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},2000);
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
							duration: 2000,
							icon: "none"
						});
					});
				}
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	
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
