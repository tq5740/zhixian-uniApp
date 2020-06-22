<template>
	<view class="page-full">
		<info-input title="岗位名称" :value="postName" @onInputConfirm="onInputConfirm" required placeholder="请填写岗位名称"></info-input>
		<info-picker title="上级分类" ref="picker" :value="parentText" @onPickerChoose="onPickerChoose" showChoose :dataList="categoryList" required placeholder="请选择"></info-picker>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import infoPicker from "@/components/infoPicker.vue"
	import userApi from "@/api/modules/user.js"
	import {list2FilterList} from "@/utils/utils.js"
	export default {
		components: {
			infoInput,infoPicker
		},
		data() {
			return {
				create:false,
				orgId:undefined,
				postName:undefined,
				parentId:0,
				parentText:"顶层",
				categoryList:[]
			};
		},
		onLoad({create,orgId,postId,postName}) {
			if(create){
				this.create=true;
				this.$updateNavbarTitle("创建岗位");
			}else{
				this.$updateNavbarTitle("编辑岗位");
				this.postName=postName;
				this.postId=postId;
			}
			this.getCategoryList();
		},
		methods:{
			onToEdit(){
				if(this.$isHaveEmpty([this.postName,this.parentId])){
					uni.showToast({
						title:"请填写完整信息",icon:"none"
					});return;
				}
				uni.showLoading();
				let r_=undefined;
				let rqData={
					parentId:this.parentId,
					postName:this.postName
				}
				if(this.create){
					r_=userApi.postCreatePost(rqData);
				}else{
					rqData.postId=this.postId;
					r_=userApi.postUpdatePost(rqData);
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
											page.getCategoryList(true);
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
				userApi.getQueryPostTree().then(data=>{
					if(!this.create){
						// 限制层级筛选
						this.deleteSelf(data,this.postId);
					}
					list2FilterList(data,"postName","postId");
					data.unshift({name:"顶层",value:0,choose:true});
					this.categoryList=data;
				})
			},
			onInputConfirm(val){
				this.postName=val;
			},
			onPickerChoose(choose){
				this.parentId=choose.value;
				this.parentText=choose.text;
			},
			deleteSelf(list,condition){
				for (var i = 0; i < list.length; i++) {
					let v=list[i];
					if(v.postId==condition){
						list.splice(i,1);
						return true;
					}else{
						if (v.children&&v.children.length>0)
							if(this.deleteSelf(v.children,condition)){
								return true;
							}
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
