<template>
	<view class="live-edit page-full">
		<view class="block">
			<template v-if="create">
				<info-picker title="企业名称" :text="orgName" showSearch @onPickerChoose="onPickerChoose($event,'orgId')" :dataList="orgList" required placeholder="请选择"></info-picker>
			</template>

			<template v-else>
				<info-text title="企业名称" required color="#000000" :value="orgName"></info-text>
			</template>
			<info-input title="直播标题" :value="liveTitle" @onInputConfirm="onInputConfirm($event,'liveTitle')" required placeholder="请填写直播标题"></info-input>
		</view>
		<view class="block">
			<info-image title="直播封面" :value="liveImg" @imageChoose="imageChoose" :uploadType="2" path="/live/img"  placeholder="手机拍照或上传" canUpload horizontal :width="203" :height="114" ></info-image>
		</view>
		<view class="block">
			<info-picker title="直播分类" showChoose :text="categoryText" @onPickerChoose="onPickerChoose($event,'categoryId')" :dataList="categoryList"  placeholder="请选择"></info-picker>
			<info-picker title="可见范围" :text="visibleRangeText" @onPickerChoose="onPickerChoose($event,'visibleRange')" :dataList="visibleRangeList" required placeholder="请选择"></info-picker>
		</view>
		<view class="block">
			<info-input title="原价" :value="originalPrice" @onInputConfirm="onInputConfirm($event,'originalPrice')" type="digit" placeholder="请填写原价（元）"></info-input>
			<info-input title="现价/优惠价" :value="price" @onInputConfirm="onInputConfirm($event,'price')" type="digit"  placeholder="请填写现价/优惠价（元）"></info-input>
		</view>
		<info-textarea v-if="create" title="直播简介" :value="intro" @onTextAreaConfirm="onTextAreaConfirm" required placeholder="请输入直播简介" ></info-textarea>
		<info-richtext v-else title="直播简介（请在pc端排版编辑）" :value="$escape2Html(intro)"></info-richtext>
		<view class="confirm-btn" @tap="onToEdit">
			<text>{{create?"下一步":"确定"}}</text>
		</view>
	</view>
</template>

<script>
	import infoPicker from "@/components/infoPicker.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoText from "@/components/infoText.vue"
	import infoImage from "@/components/infoImage.vue"
	import infoTextarea from "@/components/infoTextarea.vue"
	import infoRichtext from "@/components/infoRichtext.vue"
	import userApi from "@/api/modules/user.js"
	import liveApi from "@/api/modules/live.js"
	import puApi from "@/api/modules/public.js"
	import {list2FilterList} from "@/utils/utils.js"
	
	export default {
		components: {
			infoPicker,infoInput,infoImage,infoTextarea,infoText,infoRichtext
		},
		data() {
			return {
				create:false,
				liveId:undefined,
				orgList:[],
				categoryList:[],
				visibleRangeList:[{name:'仅自己',value:1},{name:'本企业',value:2},{name:'开放',value:3}],
				liveTitle:"",
				visibleRange:3,
				visibleRangeText:"开放",
				intro:"",
				categoryId:undefined,
				categoryText:"",
				liveImg:"",
				originalPrice:0,//原价
				price:0,
				orgId:"",
				orgName:"",
				btnText:"确定"
			};
		},
		onLoad({create,id,categoryTitle}) {
			userApi.getQueryMyorgList().then(data=>{
				list2FilterList(data,"orgName","orgId");
				let orgId=this.$store.state.userInfo.org.orgId;
				if(create){
					let org=data.find(v=>{
						return v.orgId==orgId;
					});
					if(org){
						this.orgId=org.orgId;
						this.orgName=org.orgName;
						org.choose=true;
					}
				}
				this.orgList=data;
			});
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建直播");
				this.onPickerChoose({text:this.$store.state.userInfo.org.orgName,value:this.$store.state.userInfo.org.orgId},"orgId");
			}else{
				this.$updateNavbarTitle("编辑直播");
				uni.showLoading();
				this.liveId=id;
				this.categoryText=categoryTitle;
				liveApi.getQueryLiveAdmin(id).then(data=>{
					this.orgId=data.orgId;
					this.liveTitle=data.liveTitle;
					this.liveImg=data.liveImg||this.$store.state.defaultImg.live;
					this.categoryId=data.categoryId;
					this.visibleRange=data.visibleRange;
					this.intro=data.intro;
					this.originalPrice=data.originalPrice;
					this.price=data.price;
					userApi.getQueryOrg(data.orgId).then(data=>{
						if(data)
						this.orgName=data.orgName;
					});
					this.visibleRangeText=this.visibleRangeList.find(v=>{
						return v.value==data.visibleRange;
					}).name;
					this.getCategoryList(data.orgId,false);
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
			imageChoose(img) {
					this.liveImg=img;
			},
			onTextAreaConfirm(val){
				this.intro=val;
			},
			onInputConfirm(val,key){
				this[key]=val;
			},
			onPickerChoose(choose,key){
				if(key=="orgId"){
					this.orgName=choose.text;
					this.getCategoryList(choose.value);
				}else if(key=="categoryId"){
					this.categoryText=choose.text;
				}else if(key=="liveType"){
					this.liveTypeText=choose.text;
				}else if(key=="visibleRange"){
					this.visibleRangeText=choose.text;
				}
				this[key]=choose.value;
			},
			async getCategoryList(orgId,reset=true){
				puApi.getLiveCategoryListAdmin({orgId}).then(data=>{
					list2FilterList(data,"categoryTitle","categoryId");
					this.categoryList=[];
					if(reset)
						this.categoryId=this.categoryText="";
					this.$nextTick(()=>{
						this.categoryList=data;
					});
				})
			},
			onToEdit(){
				if(this.$isHaveEmpty([this.orgId,this.liveTitle,this.intro])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				let rqData={
					orgId:this.orgId,
					liveTitle:this.liveTitle,
					liveImg:this.liveImg,
					categoryId:this.categoryId,
					visibleRange:this.visibleRange,
					intro:this.intro,
					originalPrice:this.originalPrice,
					price:this.price
				}
				let r_=undefined;
				uni.showLoading();
				if(this.create){
					r_=liveApi.postCreateLiveAdmin(rqData);
				}else{
					rqData.liveId=this.liveId;
					r_=liveApi.postUpdateLiveAdmin(rqData);
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
						if(this.create){
							setTimeout(()=>{
								// 直播章节
								uni.navigateTo({
									url: `/pages/manage/live/live/editChapter?liveId=${data}&liveTitle=${this.liveTitle}&isCreateLive=true&create=true`
								});
							},1500);
						}else{
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},2000);
						}
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
	.live-edit{
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
