<template>
	<view class="course-chapter page-full">
		<view class="list-content">
			<template v-for="(d,i) of dataList">
				<list-item
				:item="d"
				 
				 @onBtnClick="onBtnClick"
				 :key="i">
					<template v-slot:content>
						<list-item-article :name="d.courseChapterTitle" :tips="getTips(d)" tipsColor="#999999">
							<template v-slot:intro>
								<view class="link">
									<text class="title">{{d.fileId?"FILE_ID":"URL地址"}}：</text>
									<text class="url uni-ellipsis">{{d.fileId||d.url}}</text>
								</view>
							</template>
						</list-item-article>
					</template>
				</list-item>
			</template>
		</view>
		<no-data :isNoData="noData"></no-data>
		<!-- <view class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>创建章节</text>
		</view> -->
		<view class="edit" v-show="showFlag">
			<view class="mark" @tap="showFlag=false"></view>
			<view class="chapter">
				<view class="title van-hairline--bottom">{{isEdit?"编辑":"创建"}}章节</view>
				<info-input title="章节标题" :value="courseChapterTitle" @onInputConfirm="onInputConfirm($event,'courseChapterTitle')" placeholder="请填写章节标题" required></info-input>
				<info-text class="chapter-type" title="文件类型" value="视频" color="#000" required ></info-text>
				<info-radio title="文件类型" :value="type" @onRadioChange="onRadioChange" required :options='[{text:"上传视频",value:1},{text:"输入URL",value:2}]' ></info-radio>
				<view v-show="type==2">
					<info-input title="URL地址" :value="url" @onInputConfirm="onInputConfirm($event,'url')"  placeholder="请填写URL地址" required></info-input>
					<info-input title="总时长(秒)" :value="totalLength" @onInputConfirm="onInputConfirm($event,'totalLength')"  type="number" placeholder="请填写" required></info-input>
				</view>
				<view v-show="type==1"  @tap="onUploadVideo">
					<info-text title="点击上传视频" :value="uploadName"  color="#000"  required></info-text>
					<text class="upload-tips">*上传视频只支持mp4的格式文件</text>
				</view>
				
				<view class="bottom-full-btn" @tap="onConfirm">
					<text>确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import trainApi from "@/api/modules/train.js";
	import puApi from "@/api/modules/public.js"
	import listItemArticle from "@/components/listItemArticle.vue"
	import infoText from "@/components/infoText.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoRadio from "@/components/infoRadio.vue"
	
	
	export default {
		components: {
			listItemArticle,infoText,infoInput,infoRadio
		},
		data() {
			return {
				courseId:undefined,
				dataList:[],
				courseChapterId:undefined,
				parentId:0,
				courseChapterTitle:undefined,
				type:1,
				fileType:1,
				fileId:undefined,
				url:undefined,
				totalLength:undefined,
				sort:undefined,
				uploadName:'点击上传视频',
				showFlag:false,
				isEdit:false//是否是编辑
			};
		},
		onLoad({id,name}) {
			this.$updateNavbarTitle(name);
			this.courseId=id;
			this.getList();
		},
		methods: {
			getList(){
				trainApi.getCourseChapterListAdmin(this.courseId).then(data=>{
					this.dataList=data;
				})
			},
			onRadioChange(val){
				this.type=val;
			},
			onInputConfirm(val,key){
				this[key]=val;
			},
			onUploadVideo(){
				if(this.$isEmpty(this.courseChapterTitle)){
					uni.showToast({
						title:"请填写章节标题",icon:"none"
					});return;
				}
				
				uni.chooseVideo({
					sourceType:["album"],
					compressed:false,
				}).then(([err, res]) => {
					if (err) uni.showToast({
						title:err,
						icon:"none"
					});
					else {
						uni.showLoading({
							title:"上传中",
							mask:true
						});
						puApi.postUploadVideo({
							filePath:res.tempFilePath,
							name:"file",
							path:"/train/course/file"
						}).then(data=>{
							uni.hideLoading();
							this.uploadName=`视频大小：${this.$getFloat(res.size/(1024*1024),1)}M`;
							this.fileId=data.fileId;
						}).catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: err,
								duration: 2000,
								icon: "none"
							});
						});
					}
				});
			},
			onConfirm(){
				if(this.$isEmpty(this.courseChapterTitle)){
					uni.showToast({
						title:"请填写章节标题",icon:"none"
					});return;
				}
				
				let r_=undefined;
				let rqData={
					courseId:this.courseId,
					type:this.type,
					fileType:this.fileType,
					courseChapterTitle:this.courseChapterTitle,
					parentId:this.parentId
				}
				if(this.type==1){
					rqData.fileId=this.fileId;
					if(this.$isEmpty(this.fileId)){
						uni.showToast({
							title:"请上传视频",icon:"none"
						});return;
					}
				}else{
					rqData.url=this.url;
					rqData.totalLength=this.totalLength;
					if(this.$isEmpty(this.url)){
						uni.showToast({
							title:"请填写视频地址",icon:"none"
						});return;
					}
					if(this.$isEmpty(this.totalLength)){
						uni.showToast({
							title:"请填写视频时长",icon:"none"
						});return;
					}
				}
				if(this.isEdit){
					// 编辑
					rqData.sort=this.sort;
					rqData.courseChapterId=this.courseChapterId;
					r_=trainApi.postUpdateCourseChapterAdmin(rqData);
				}else{
					// 创建
					r_=trainApi.postCreateCourseChapterAdmin(rqData);
				}
				if(r_){
					r_.then(data=>{
						this.showFlag=false;
						this.getList();
					}).catch(err => {
						uni.showToast({
							title: err,
							duration: 2000,
							icon: "none"
						});
					});
				}
			},
			onBtnClick({btn:{key},item}){
				if(key=="bianji"){
					this.isEdit=true;
					this.showFlag=true;
					this.courseChapterId=item.courseChapterId;
					this.parentId=item.parentId;
					this.courseChapterTitle=item.courseChapterTitle;
					this.type=item.type;
					if(this.type==1){
						this.fileId=item.fileId;
					}else if(this.type==2){
						this.url=item.url||"";
						this.totalLength=item.totalLength;
					}
					this.fileType=item.fileType;
					this.sort=item.sort;
					this.uploadName='点击上传视频';
				}else if(key=="shanchu"){
					trainApi.getDeleteCourseChapterAdmin({
						courseChapterId:item.courseChapterId,
						courseId:this.courseId
					}).then(data=>{
						this.getList(true);
					}).catch(err => {
						uni.showToast({
							title:typeof err == "string"?err:JSON.stringify(err),
							duration: 2000,
							icon: "none"
						});
					});
				}
			},
			onCreateBtnClick(){
				this.isEdit=false;
				this.showFlag=true;
				this.courseChapterId=undefined;
				this.parentId=0;
				this.courseChapterTitle=undefined;
				this.type=1;
				this.fileType=1;
				this.fileId=undefined;
				this.url=undefined;
				this.totalLength=undefined;
				this.sort=undefined;
				this.uploadName='点击上传视频';
			},
			getTips: function(d) {
				return `创建人：${d.createUserName} 创建时间：${this.$formatDate(d.createTime,"YYYY-MM-DD hh:mm:ss")}`;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.course-chapter{
		padding-bottom: 138upx;
		min-height: calc(100% - 138upx);
	}
	.link{
		font-size:$font-size-24 ;
		width: 100%;
		margin: 30upx 0px 22upx;
		color:#666666;
		.url{
			color: #FC703E;
			display: inline-block;
			width: 580upx;
			vertical-align: top;
		}
	}
	.edit{
		.mark{position: fixed;z-index: 10;}
		.chapter{
			position: fixed;bottom: 0px;width: 100%;z-index: 10;
			background: #FFFFFF;
			.title{
				$h:87upx;
				font-size: $font-size-30;color:$color-666;text-align: center;height: $h;line-height: $h;position: relative;
			}
			&-type{
				border-bottom: 20upx solid $color-f2;
			}
			.upload-tips{
				font-size: $font-size-24;color:#FC703E;
				display: inline-block;width: 100%;
				padding:20upx 0px 0px 29upx;background-color: $color-f2;
			}
			.bottom-full-btn{
				border-top: 40upx solid $color-f2;
			}
			.bottom-full-btn{
				position: relative;
			}
		}
	}
</style>
