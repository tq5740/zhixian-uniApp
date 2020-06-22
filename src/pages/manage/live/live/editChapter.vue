<template>
	<view class="chapter-edit page-full">
		<view class="block">
			<info-input :value="liveChapterTitle" @onInputConfirm="onInputConfirm($event,'liveChapterTitle')" title="章节标题" placeholder="请填写章节标题" required></info-input>
			<info-radio :value="liveType" :disabled="!create" @onRadioChange="onRadioChange" title="直播类型" :options="liveTypeOptions" required></info-radio>
			<template v-if="create">
				<info-picker v-if="liveType==1" :value="templateTypeText" @onPickerChoose="onPickerChoose($event,'templateType')" title="模板类型" placeholder="请选择" :dataList="templateTypeList" required></info-picker>
			</template>
			<template v-else>
				<info-text v-if="liveType==1" title="模板类型" required :value="templateTypeText"></info-text>
			</template>
		</view>
		<view class="block">
			<info-input :value="speaker" @onInputConfirm="onInputConfirm($event,'speaker')" title="主讲人" placeholder="请填写主讲人" required></info-input>
			<info-picker :value="startDate" @onPickerChoose="onPickerChoose($event,'startDate')" title="开始日期" placeholder="请选择" mode="date" required></info-picker>
			<info-picker :value="startTime" @onPickerChoose="onPickerChoose($event,'startTime')" title="开始时间" placeholder="请选择" mode="time" required></info-picker>
		</view>
		<view class="block">
			<info-input :value="totalLength" @onInputConfirm="onInputConfirm($event,'totalLength')" title="预计总时长" type="number" placeholder="请输入预计总时长（分钟）"></info-input>
			<view  @tap="addressClick">
				<info-text title="现场地址" :value="address?address:'请选择地址'" :color="address?'#000000':'#999999'"></info-text>
			</view>
		</view>
		<view class="block">
			<info-textarea :value="intro" @onTextAreaConfirm="onTextAreaConfirm" title="直播描述" placeholder="请输入直播描述" required></info-textarea>
		</view>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import infoRadio from "@/components/infoRadio.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import infoTextarea from "@/components/infoTextarea.vue"
	import infoText from "@/components/infoText.vue"
	import liveApi from "@/api/modules/live.js"
	import {getLiveTemplateType} from "@/utils/utils.js"
	let templateTypeList=getLiveTemplateType();
	export default {
		components: {
			infoInput,infoRadio,infoPicker,infoTextarea,infoText
		},
		data() {
			let templateTypePickerList=[];
			getLiveTemplateType().forEach(v=>{
				templateTypePickerList.push({name:v.text,value:v.id});
			});
			return {
				create:false,//创建章节
				isCreateLive:false,//通过创建直播进入
				liveId:undefined,
				liveTitle:"",
				liveChapterId:undefined,
				liveChapterTitle:"",
				liveType:1,
				liveTypeOptions:[{text:'直播',value:1},{text:'课堂',value:2}],
				templateType:5,
				templateTypeText:"视频+文档+聊天",
				templateTypeList:templateTypePickerList,
				speaker:"",
				startDate:"",
				startTime:"",
				totalLength:"",
				address:"",
				lng:"",
				lat:"",
				intro:""
			}
		},
		onLoad({create,liveChapterId,liveId,liveTitle,isCreateLive}) {
			this.liveId=liveId;
			this.isCreateLive=isCreateLive?true:false;
			this.liveTitle=liveTitle;
			if(create){
				this.create=true;
			}else{
				uni.showLoading();
				this.liveChapterId=liveChapterId;
				liveApi.getQueryLiveChapterAdmin(liveChapterId).then(data=>{
					this.liveChapterTitle=data.liveChapterTitle;
					this.liveType=data.liveType;
					this.templateType=data.templateType;
					this.speaker=data.speaker;
					this.totalLength=data.totalLength;
					this.liveChapterTitle=data.liveChapterTitle;
					this.intro=data.intro;
					this.address=data.address;
					this.lng=data.lng;
					this.lat=data.lat;
					this.startDate=this.$formatDate(data.startTime,"YYYY-MM-DD");
					this.startTime=this.$formatDate(data.startTime,"hh:mm");
					this.templateTypeText=templateTypeList.find(v=>{
						return v.id==data.templateType;
					}).text;
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			}
		},
		methods: {
			onToEdit(){
				if(this.$isHaveEmpty([this.liveChapterTitle,this.liveType,this.templateType,this.speaker,this.startDate,this.startTime,this.intro])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				let rqData={
					liveId:this.liveId,
					liveChapterTitle:this.liveChapterTitle,
					liveType:this.liveType,
					speaker:this.speaker,
					startTime:this.startDate+" "+this.startTime+":00",
					totalLength:this.totalLength,
					address:this.address,
					lng:this.lng,
					lat:this.lat,
					intro:this.intro
				}
				if(this.liveType==1){
					rqData.templateType=this.templateType;
				}
				uni.showLoading();
				let r_=undefined;
				if(this.create){
					r_=liveApi.postCreateLiveChapterAdmin(rqData);
				}else{
					rqData.liveChapterId=this.liveChapterId;
					r_=liveApi.postUpdateLiveChapterAdmin(rqData)
				}
				
				if(r_){
					r_.then(data=>{
						uni.hideLoading();
						uni.showToast({
							title:`${this.create?"创建":"修改"}成功`,
							complete:()=> {
								this._refreshPrePage();
							}
						})
						setTimeout(()=>{
							uni.redirectTo({
								url:`/pages/manage/live/live/chapter?id=${this.liveId}&name=${this.liveTitle}&isCreateLive=${this.isCreateLive?true:""}`
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
			},
			addressClick(){
				let self_=this;
				uni.chooseLocation({
					success(res) {
						console.log(res);
						self_.lng=res.longitude;
						self_.lat=res.latitude;
						self_.address=res.address;
					}
				})
			},
			onPickerChoose(choose,key){
				if(key=="templateType"){
					this.templateTypeText=choose.text;
				}
				this[key]=choose.value;
			},
			onInputConfirm(val,key){
				this[key]=val;
			},
			onTextAreaConfirm(val){
				this.intro=val;
			},
			onRadioChange(val){
				this.liveType=val;
			}
		}
	}
</script>

<style scoped lang="scss">
	.chapter-edit{
		padding-bottom: 1upx;}
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
