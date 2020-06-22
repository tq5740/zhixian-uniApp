<template>
	<view class="page-full">
		<info-input title="分类名称" :value="categoryTitle" @onInputConfirm="onInputConfirm" required placeholder="请填写分类名称"></info-input>
		<info-picker title="上级分类" ref="picker" :value="parentText" @onPickerChoose="onPickerChoose" showChoose :dataList="categoryList" required placeholder="请选择"></info-picker>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import puApi from "@/api/modules/public.js"
	import {list2FilterList} from "@/utils/utils.js"
	export default {
		components: {
			infoInput,infoPicker
		},
		data() {
			return {
				create:false,
				orgId:undefined,
				categoryTitle:undefined,
				parentId:0,
				parentText:"顶层",
				categoryList:[]
			};
		},
		onLoad({create,orgId,categoryId,categoryTitle}) {
			this.orgId=orgId;
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建分类");
			}else{
				this.$updateNavbarTitle("编辑分类");
				this.categoryTitle=categoryTitle;
				this.categoryId=categoryId;
			}
			this.getCategoryList();
		},
		methods:{
			onToEdit(){
				if(this.$isHaveEmpty([this.categoryTitle,this.parentId])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				uni.showLoading();
				let r_=undefined;
				let rqData={
					parentId:this.parentId,
					categoryTitle:this.categoryTitle,
					orgId:this.orgId
				}
				if(this.create){
					r_=puApi.postCreateCourseCategory(rqData);
				}else{
					rqData.categoryId=this.categoryId;
					r_=puApi.postUpdateCourseCategory(rqData);
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
											page.getCategoryList(page.orgId);
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
			getCategoryList(refresh){
				puApi.getCourseCategoryListAdmin({orgId:this.orgId}).then(data=>{
					if(this.create){
						list2FilterList(data,"categoryTitle","categoryId");
					}else{
						// 限制层级筛选
						this.deleteLowerLevel(data,"categoryTitle","categoryId",this.categoryId);
					}
					data.unshift({name:"顶层",value:0,choose:true});
					if(refresh){
						this.$refs.picker.onReset();
						this.categoryList=[];
						this.$nextTick(()=>{
							this.categoryList=data;
						});
					}else{
						this.categoryList=data;
					}
				})
			},
			onInputConfirm(val){
				this.categoryTitle=val;
			},
			onPickerChoose(choose){
				this.parentId=choose.value;
				this.parentText=choose.text;
			},
			deleteLowerLevel(list,nameKey,valKey,condition){
				for (var i = 0; i < list.length; i++) {
					let v=list[i];
					if(v[valKey]==condition){
						list.splice(i,1);
						--i;
					}else{
						v.name = v[nameKey];
						v.value = v[valKey];
						if (v.children&&v.children.length>0)
							this.deleteLowerLevel(v.children,nameKey,valKey,condition);
					}
				}
			},
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
