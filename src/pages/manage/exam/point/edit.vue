<template>
	<view class="page-full">
		<info-input title="分类名称" :value="examPointTitle" @onInputConfirm="onInputConfirm" required placeholder="请填写分类名称"></info-input>
		<info-picker title="上级分类" :value="parentText" @onPickerChoose="onPickerChoose" showChoose :dataList="categoryList" required placeholder="请选择"></info-picker>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import examApi from "@/api/modules/exam.js"
	import {list2FilterList} from "@/utils/utils.js"
	export default {
		components: {
			infoInput,infoPicker
		},
		data() {
			return {
				create:false,
				orgId:undefined,
				examPointTitle:undefined,
				parentId:0,
				parentText:"顶层",
				categoryList:[]
			};
		},
		onLoad({create,orgId,examPointId,examPointTitle}) {
			uni.showLoading();
			examApi.getExamPointListAdmin({orgId}).then(data=>{
				if(create){
					list2FilterList(data,"examPointTitle","examPointId");
				}else{
					// 限制层级筛选
					this.deleteLowerLevel(data,"examPointTitle","examPointId",examPointId);
				}
				data.unshift({name:"顶层",value:0,choose:true});
				this.categoryList=data;
			})
			this.orgId=orgId;
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建");
			}else{
				this.$updateNavbarTitle("编辑");
				this.examPointTitle=examPointTitle;
				this.examPointId=examPointId;
			}
			uni.hideLoading();
		},
		methods:{
			onToEdit(){
				if(this.$isHaveEmpty([this.examPointTitle,this.parentId])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				uni.showLoading();
				let r_=undefined;
				let rqData={
					parentId:this.parentId,
					examPointTitle:this.examPointTitle,
					orgId:this.orgId
				}
				if(this.create){
					r_=examApi.postCreateExamPointAdmin(rqData);
				}else{
					rqData.examPointId=this.examPointId;
					r_=examApi.postUpdateExamPointAdmin(rqData);
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
							uni.navigateBack({
								delta:1
							});
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
			onInputConfirm(val){
				this.examPointTitle=val;
			},
			onPickerChoose(choose){
				this.parentId=choose.value;
				this.parentText=choose.text;
			},
			deleteLowerLevel(list,nameKey,valKey,condition){
				this.findLevel(list,condition,valKey,nameKey);
				// console.log(list);
			},
			findLevel(list,condition,valKey,nameKey){
				for (var i = 0; i < list.length; i++) {
					let v=list[i];
					if(v[valKey]==condition){
						list.splice(i,1);
						--i;
					}else{
						if (v.children&&v.children.length>0)
							this.findLevel(v.children,condition,valKey,nameKey)
						v.name = v[nameKey];
						v.value = v[valKey];
					}
				}
			}
		}
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
