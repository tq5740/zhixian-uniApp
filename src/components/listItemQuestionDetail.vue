<template>
	<view class="question" :style="{background:questionBgColor}">
		<view class="question-title">
			<text>{{question}}</text>
			<text v-if="!$isEmpty(score)" class="score">({{score}}分)</text>
		</view>
		<template v-if="type==4">
			<view class="scenario-list">
				<list-item-question-detail v-for="(q,i) of scenarioList" :key="i"
				:question="q.examQuestionTitle"
				:options="q.options" :answer="q.answer" :analysis="q.analysis" :showAnalysis="showAnalysis" :border="border" :type="q.type"
				titleBgColor="#fff">
				</list-item-question-detail>
			</view>
		</template>
		<template v-else>
			<view class="option" >
				<view class="option-item" v-for="(o,i) of optionList" :key="i">
					<text class="code">{{i|getCode}}</text><text>{{o}}</text>
				</view>
			</view>
			<view class="answer " :class="{'van-hairline--top':border}">
				<text class="title"  :style="{background:titleBgColor}">正确答案</text>
				<view v-if="isSelect" class="select-answers">
					<text class="select-item" v-for="(a,i) of answerList" :key="i">
						{{getAnswerCode(a)}}
					</text>
				</view>
				<view v-else class="text-answers">
					<text class="text-item" v-for="(a,i) of answerList" :key="i">
						({{i+1}}){{a}}
					</text>
				</view>
			</view>
			<view v-if="showAnalysis" class="analysis">
				<text class="title" :style="{background:titleBgColor}">解析</text>
				<text class="analysis-text">{{analysis||"-"}}</text>
			</view>
		</template>
	</view>
</template>

<script>
	import {getQuestionType } from "@/utils/utils.js"
	const typeList=getQuestionType();
	const codeList=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	export default {
		props: {
			question:{
				type:String,
				default:""
			},
			options:{
				type:String,
				default:""
			},
			answer:{
				type:String,
				default:""
			},
			analysis:{
				type:String,
				default:""
			},
			border: {
				type: Boolean,
				default: true
			},
			showAnalysis: {
				type: Boolean,
				default: true
			},
			score:{
				type:[String,Number],
				default:undefined
			},
			type:{
				type:[String,Number],
				default:1,
				required:true
			},
			questionScenarioList:{
				type:Array,
				default(){return []}
			},
			questionBgColor:{
				type:String,
				default:""
			},
			titleBgColor:{
				type:String,
				default:""
			},
		},
		computed: {
			isSelect() {
				return this.type<4;
			},
			optionList(){
				if(!this.options)return [];
				return JSON.parse(this.options);
			},
			answerList(){
				if(!this.answer)return [];
				return JSON.parse(this.answer);
			},
			scenarioList(){
				this.questionScenarioList.forEach((v,i)=>{
					let type=typeList.find((t)=>{
						return t.value==v.type;
					});
					v.examQuestionTitle=`${i+1}、【${type.name}】${v.examQuestionTitle}`;
				});
				return this.questionScenarioList;
			}
		},
		filters:{
			getCode(i){
				// 一般不会有26个选项
				return codeList[i];
			}
		},
		data() {
			return {
			};
		},
		methods: {
			getAnswerCode(a) {
				let i=this.optionList.findIndex(v=>{
					return v==a;
				});
				return codeList[i];
			}
		},
	}
</script>

<style lang="scss" scoped>
	.question {
		background: #FFFFFF;
		margin-bottom: 20upx;
		&-title {
			font-size: $font-size-34;
			padding: 30upx 30upx 0px;
		}
		.score{
			font-size: $font-size-34;
			color: #FC703E;
		}
		.title {
			display: block;
			padding-left: 30upx;
			font-size: $font-size-26;
			color: #888888;
			height: 76upx;
			line-height: 76upx;
			background: $color-f2;
		}

		.option {
			font-size: $font-size-34;
			padding: 20upx 30upx 10upx;
			
			&-item {
				padding: 20upx 0px;
			}

			.code {
				color: #28A0F6;
				display: inline-block;
				width: 50upx;
				height: 50upx;
				text-align: center;
				line-height: 50upx;
				font-size: $font-size-26;
				font-weight: bold;
				border: 1upx solid #28A0F6;
				border-radius: 50%;
				margin-right: 20upx;
			}
		}

		.answer {
			position:relative;
			.select-answers {
				padding-left: 30upx;
				height: 88upx;
				line-height: 88upx;
				color: #FC703E;
				font-size: $font-size-34;

				.select-item {
					margin-right: 10upx;
				}
			}

			.text-answers {
				padding: 25upx 0px 15upx 30upx;
				color: #FC703E;
				font-size: $font-size-34;
				.text-item {
					display: block;
					margin-bottom: 10upx;
				}
			}
		}

		.analysis {
			text {
				display: block;
			}

			&-text {
				font-size: $font-size-34;
				padding: 30upx;
			}
		}

		.scenario-list{
			padding: 30upx;
		}

	}
</style>
