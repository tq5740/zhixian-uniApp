<template>
	<view class="page-full">
		<view class="block">
			<info-text title="试题题干" :value="title"></info-text>
		</view>
		<view class="block">
			<info-text title="试题类型" :value="getType(type)"></info-text>
			<info-text title="所属题库" :value="examBankTitle"></info-text>
			<info-text title="困难度" :value="getDifficulty(diffculty)"></info-text>
			<info-text title="所属知识点" :value="point"></info-text>
		</view>
		<template v-if="type!=4">
			<view class="block">
				<template v-for="(o,i) of options">
					<info-text :title='"试题选项"+(i+1)' :value="o" :key="i"></info-text>
				</template>
			</view>
			<view class="block">
				<info-text title="答案" :value="answer"></info-text>
			</view>
			<view class="block">
				<info-text title="解析" :value="analysis"></info-text>
			</view>
		</template>
		<template v-else>
			<view v-for="(q,i) of examQuestionScenarios" :key="i">
				<view class="block">
					<info-text title="试题题干" :value="q.examQuestionTitle"></info-text>
					<info-text title="试题类型" :value="getType(q.type)"></info-text>
				</view>
				<view class="block">
					<template v-for="(o,j) of q.options">
						<info-text :title='"试题选项"+(i+1)' :value="o" :key="j"></info-text>
					</template>
				</view>
				<view class="block">
					<info-text title="答案" :value="q.answer"></info-text>
				</view>
				<view class="block">
					<info-text title="解析" :value="q.analysis"></info-text>
				</view>
			</view>
		</template>
		<view class="bottom-full-btn" @tap="onExamine">
			<text>确认</text>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
	</view>
</template>

<script>
	import examApi from "@/api/modules/exam.js"
	import {getQuestionType,getQuestionDifficulty } from "@/utils/utils.js"
	import infoText from "@/components/infoText.vue"
	const typeList=getQuestionType();
	const difficultyList=getQuestionDifficulty();
	export default {
		components: {
			infoText
		},
		data() {
			return {
				examQuestionTemporaryId:undefined,
				title:"",
				analysis:"",
				answer:"",
				type:"",
				options:"",
				diffculty:"",
				examBankTitle:"",
				point:"",
				examQuestionScenarios:[]
			};
		},
		onLoad({examQuestionId}) {
			uni.showLoading();
			examApi.getQueryQuestionTemporaryAdmin(examQuestionId).then(data=>{
				this.examQuestionTemporaryId=data.examQuestionTemporaryId;
				this.options=JSON.parse(data.options);
				this.analysis=data.analysis;
				this.answer=JSON.parse(data.answer).join("；");
				this.point=JSON.parse(data.examPointTitle).join("；");
				this.title=data.examQuestionTitle;
				this.type=data.type;
				if(data.examQuestionScenarios){
					data.examQuestionScenarios.forEach(v=>{
						v.answer=JSON.parse(v.answer).join("；");
						v.options=JSON.parse(v.options);
					});
					this.examQuestionScenarios=data.examQuestionScenarios;
				}
				this.examBankTitle=data.examBankTitle;
				this.diffculty=data.diffculty;
				uni.hideLoading();
			}).catch(err => {
				console.log(err);
				uni.hideLoading();
				uni.showToast({
					title:typeof err == "string"?err:JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		},
		methods:{
			onExamine(){
				this.$refs.msg.show(`审核通过后此试题将加入正式试题，无法再对试题进行修改、删除等操作！`);
			},
			onMsgConfirm(id){
				let r_=undefined;
				uni.showLoading();
				examApi.postAddQuestionTemporaryAdmin({
					examQuestionTemporaryId:JSON.stringify([this.examQuestionTemporaryId])
				}).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"审核成功",
						complete:()=> {
							this._refreshPrePage();
						}
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000)
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			},
			getType(type){
				let obj_=typeList.find(v=>{
					return v.value==type;
				});
				if(obj_)
					return obj_.name;
			},
			getDifficulty(val){
				let obj_=difficultyList.find(v=>{
					return v.id==val;
				});
				if(obj_)
					return obj_.text;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-full{
		padding-bottom: 100upx;
		box-sizing: border-box;
	}
.block{
	margin-bottom: 20upx;
}
</style>
