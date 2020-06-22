<template>
	<view class="list-item">
		<view class="title">
			<text>{{qType}}{{title}}</text>
		</view>
		<view class="intro">
			<view class="info">
				<view class="point ">
					<text>知识点：</text>
					<text class="point-text uni-ellipsis">{{point}}</text>
				</view>
				<view v-if="bank" class="bank">
					<text>所属题库：{{bank}}</text>
				</view>
			</view>
			<view class="difficulty" v-show="qDifficulty" :style="{color:qDifficultyColor}">
				<text>{{qDifficulty}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {getQuestionType,getQuestionDifficulty } from "@/utils/utils.js"
	const questionType=getQuestionType();
	const questionDifficulty=getQuestionDifficulty();
	export default {
		props: {
			type: {
				type: Number,
				default: 1
			},
			title: {
				type: String,
				default: "xxx"
			},
			point: {
				type: String,
				default: ""
			},
			bank: {
				type: String,
				default: ""
			},
			difficulty: {
				type: Number,
				default: 1
			},
		},
		computed: {
			qType() {
				let type_=questionType.find(v=>{
					return v.value==this.type;
				}).name;
				return `【${type_}】`;
			},
			qDifficulty(){
				let obj=questionDifficulty.find(v=>{
					return v.id==this.difficulty;
				});
				return obj?obj.text:"";
			},
			qDifficultyColor(){
				let obj=questionDifficulty.find(v=>{
					return v.id==this.difficulty;
				});
				return obj?obj.color:"";
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.list-item{
		background: #FFFFFF;
		padding:30upx 20upx;
		.title{
			font-size: $font-size-30;
			font-weight:bold;
			margin-bottom: 25upx;
			// 两行省略
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.intro{
			font-size: $font-size-24;
			display:flex;justify-content:space-between;
			align-items:flex-end;
			.info{
				flex-grow: 1;
			}
			.point{
				color: $color-666;
				display:flex;align-items:flex-start;
				&-text{
					color: #6D9985;
					display: inline-block;
					max-width: 500upx;
				}
			}
			.bank{
				margin-top: 20upx;
				color: $color-999;
			}
			.difficulty{
				$color:#FFAE00;
				$height:36upx;
				width: 76upx;text-align: center;
				height: $height;
				line-height: $height;
				margin-left: 10upx;
				background:#FFF5E0;
				border:1upx solid $color;
				color:$color;
				border-radius:50upx;
			}
		}
	}
</style>
