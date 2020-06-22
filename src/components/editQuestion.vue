<template>
	<view class="edit-question">
		<view v-if="addScenarios" class="behavior-title van-hairline--bottom">
			<text>添加情景题</text>
			<text class="iconfont iconchuangjian close" @tap="onClose"></text>
		</view>
		<view class="block">
			<info-picker v-if="!addScenarios" title="题库" :value="bank" :dataList="bankList" @onPickerChoose="onPickerChoose($event,'examBankId')" placeholder="请选择" required></info-picker>
			<info-text v-if="isEdit" title="题型" :value="typeText"></info-text>
			<info-picker v-else title="题型" :value="typeText" :dataList="typeList" @onPickerChoose="onPickerChoose($event,'type')"  mode="selector" placeholder="请选择" required></info-picker>
		</view>
		<view class="block">
			<info-textarea title="题干" :value="examQuestionTitle" @onTextAreaConfirm="onTextAreaConfirm($event,'examQuestionTitle')" placeholder="请填写题干"  required></info-textarea>
		</view>
		<view v-if="!addScenarios" class="block">
			<info-picker title="困难度" :value="diffcultyText" :dataList="diffcultyList" @onPickerChoose="onPickerChoose($event,'diffculty')" mode="selector" placeholder="请选择" required></info-picker>
			<view @tap="onPointClick">
				<info-picker title="知识点" :value="point1" showChoose :dataList="pointList1" @onPickerChoose="onPickerChoose($event,'point1')" placeholder="请选择"></info-picker>
				<info-picker title="知识点" :value="point2" showChoose :dataList="pointList2" @onPickerChoose="onPickerChoose($event,'point2')" placeholder="请选择"></info-picker>
				<info-picker title="知识点" :value="point3" showChoose :dataList="pointList3" @onPickerChoose="onPickerChoose($event,'point3')" placeholder="请选择"></info-picker>
			</view>
		</view>
		<!-- 单选 -->
		<view v-if="type==1">
			<view class="block" v-for="(o,i) of options" :key="i">
				<view class="info-item">
					<view class="info-item-title info-item-title-textarea van-hairline--bottom">
						<text>{{o.title}}<text  class="required">*</text></text>
						<view class="">
							<text class="answer-true">正确选项</text>
							<text class="iconfont van-hairline--right" @tap="chooseRightAnswer(o)" :class="{iconxuanzhong:o.choose,iconweixuanzhong:!o.choose}"></text>
							<text class="iconfont iconshanchu" @tap="onDelOption(i)"></text>
						</view>
					</view>
					<view class="info-item-content-textarea">
						<textarea :value="o.value" @blur="onOptionConfirm($event,o,'option')" @confirm="onOptionConfirm($event,o,'option')"  placeholder="请填写选项内容" :auto-height="true"  maxlength="-1" placeholder-class="tips content" />
					</view>
				</view>
			</view>
			<view class="block">
				<view class="create-btn" @tap="onAddOption">
					<text class="iconfont iconchuangjian"></text>
					<text>添加选项</text>
				</view>
			</view>
		</view>
		<!-- 多选 -->
		<view v-if="type==2">
			<view class="block" v-for="(o,i) of options" :key="i">
				<view class="info-item">
					<view class="info-item-title info-item-title-textarea van-hairline--bottom">
						<text>{{o.title}}<text  class="required">*</text></text>
						<view class="">
							<text class="answer-true">正确选项</text>
							<text class="iconfont van-hairline--right" @tap="chooseRightAnswer(o)" :class="{iconyigouxuan:o.choose,iconweigouxuan:!o.choose}"></text>
							<text class="iconfont iconshanchu" @tap="onDelOption(i)"></text>
						</view>
					</view>
					<view class="info-item-content-textarea">
						<textarea :value="o.value" @blur="onOptionConfirm($event,o,'option')" @confirm="onOptionConfirm($event,o,'option')"  placeholder="请填写选项内容" :auto-height="true"  maxlength="-1" placeholder-class="tips content" />
					</view>
				</view>
			</view>
			<view class="block">
				<view class="create-btn" @tap="onAddOption">
					<text class="iconfont iconchuangjian"></text>
					<text>添加选项</text>
				</view>
			</view>
		</view>
		<!-- 判断 -->
		<view v-if="type==3" class="block">
			<info-radio title="选项" :value="answer" @onRadioChange="onRadioChange" :options="[{text:'正确',value:'正确',checked:true},{text:'错误',value:'错误'}]" required></info-radio>
		</view>
		<!-- 情景 -->
		<view v-if="type==4">
			<view class="block" v-for="(o,i) of examQuestionScenarios" :key="i">
				<view class="info-item">
					<view class="info-item-title info-item-title-textarea van-hairline--bottom">
						<text>{{getType(o.type)}}<text  class="required">*</text></text>
						<view class="">
							<text class="iconfont iconbianji van-hairline--right" @tap="toEditSc(i)"></text>
							<text class="iconfont iconshanchu" @tap="onDelSc(i)"></text>
						</view>
					</view>
					<view class="info-item-content-textarea">
						<textarea :value="o.examQuestionTitle" disabled :auto-height="true"  maxlength="-1" />
					</view>
				</view>
			</view>
			<view class="block">
				<view class="create-btn" @tap="toAddSc">
					<text class="iconfont iconchuangjian"></text>
					<text>添加小题</text>
				</view>
			</view>
		</view>
		<!-- 填空 -->
		<view v-if="type==5">
			<view class="block" v-for="(o,i) of options" :key="i">
				<view class="info-item">
					<view class="info-item-title info-item-title-textarea van-hairline--bottom">
						<text>{{o.title}}<text  class="required">*</text></text>
						<view class="">
							<text class="iconfont iconshanchu" @tap="onDelOption(i)"></text>
						</view>
					</view>
					<view class="info-item-content-textarea">
						<textarea :value="o.value" @blur="onOptionConfirm($event,o,'option')" @confirm="onOptionConfirm($event,o,'option')"  placeholder="请输入填空内容" :auto-height="true"  maxlength="-1" placeholder-class="tips content" />
					</view>
				</view>
			</view>
			<view class="block">
				<view class="create-btn" @tap="onAddOption">
					<text class="iconfont iconchuangjian"></text>
					<text>添加填空</text>
				</view>
			</view>
		</view>
		<!-- 问答 -->
		<view v-if="type==6" class="block">
			<info-textarea title="答案" :value="answer" @onTextAreaConfirm="onTextAreaConfirm($event,'answer')" placeholder="请输入答案" required></info-textarea>
		</view>
		<!-- 答案解析 -->
		<view v-if="type!=4" class="block">
			<info-textarea title="答案解析" :value="analysis" @onTextAreaConfirm="onTextAreaConfirm($event,'analysis')" placeholder="请输入答案解析"></info-textarea>
		</view>
		
		<view v-if="type==4&&!addScenarios"  :class="{top:addSc,bottom:!addSc}" class="page-full cover">
			<edit-question ref="question" v-if="addSc" @onClose="onClose" :question="questionSc" :addScenarios="true"></edit-question>
			<view class="bottom-full-btn" :class="{top:addSc,bottom:!addSc}" @tap="onComfirm">
				<text>确定</text>
			</view>
		</view>
	</view>
</template>

<script>
	import infoPicker from "@/components/infoPicker.vue"
	import infoInput from "@/components/infoInput.vue"
	import infoTextarea from "@/components/infoTextarea.vue"
	import infoText from "@/components/infoText.vue"
	import infoRadio from "@/components/infoRadio.vue"
	import {getQuestionType,getQuestionDifficulty,list2FilterList } from "@/utils/utils.js"
	import examApi from "@/api/modules/exam.js"
	const codeList=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	function parseJsonArray(source){
		// source要么是数组要么是数组内容的字符串
		if(typeof source == "string"){
			try{
				return JSON.parse(source);
			}catch(e){
				return [];
			}
		}else if(!source){
			return [];
		}
		return source;
	}
	
	export default {
		props: {
			addScenarios:{//添加情景题
				type:Boolean,
				default:false
			},
			question:{//问题
				type:Object,
				default:undefined
			},
			isEdit:{//是否是编辑
				type:Boolean,
				default:false
			},
			examPointTitle:{type:Array,default(){return [];}}
		},
		components: {
			infoPicker,infoInput,infoTextarea,infoRadio,infoText
		},
		watch: {
			addScenarios:{
				handler:function(newValue, oldValue) {
					if(newValue){
						let i=this.typeList.findIndex(v=>{
							return v.value==4;
						});
						this.typeList.splice(i,1);
					}else{
						examApi.getQueryExamBankTitleAdmin().then(data=>{
							list2FilterList(data,"examBankTitle","examBankId");
							this.bankList=data;
						});
						getQuestionDifficulty().forEach(v=>{
							this.diffcultyList.push({name:v.text,value:v.id});
						});
					}
				},
				immediate:true
			},
			question:{
				handler:function(data, oldValue) {
					if(data){
						//保证options，examPointId，examPointTitle为数组对象，answer选择判断时为数组
						this.examQuestionTitle=data.examQuestionTitle;
						this.type=data.type;
						this.typeText=this.getType(data.type);
						this.analysis=data.analysis||"";
						data.answer=parseJsonArray(data.answer)
						data.options=parseJsonArray(data.options)
						if(this.type==1||this.type==2){
							// 选择
							this.options=[];
							data.options.forEach((v,i)=>{
								this.options.push({
									title:codeList[i]+"选项",
									value:v,
									choose:data.answer.some(a=>{
										return a==v;
									})
								});
							});
						}else if(this.type==5){
							// 填空,把答案转成选项
							this.options=[];
							data.answer.forEach((v,i)=>{
								this.options.push({
									title:`第${i+1}空`,
									value:v
								});
							});
						}else if(this.type==3||this.type==6){
							// 问答、判断，把答案取出来
							this.answer=data.answer[0];
						}
						// 添加情景小题不用管这些
						if(!this.addScenarios){
							this.examBankId=data.examBankId;
							this.bank=data.examBankTitle;
							this.diffculty=data.diffculty;
							this.diffcultyText=this.diffcultyList.find(v=>{
								return v.value==data.diffculty;
							}).name;
							if(data.examQuestionScenarios){
								// 情景小题会在递归子组件中再次执行这个监听，只要编辑情景小题
								this.examQuestionScenarios=data.examQuestionScenarios;
							}
							data.examPointId=parseJsonArray(data.examPointId)
							data.examPointTitle=parseJsonArray(data.examPointTitle);
							if(data.orgId){
								this.orgId=data.orgId;
								this.getPointList(data.orgId);
							}
							// 补足3位
							for (var i = 0; i < 3; i++) {
								if(this.$isEmpty(data.examPointId[i])){
									data.examPointId[i]="";
								}
							}
							this.examPointId=data.examPointId;
							this.point1=this.examPointTitle[0]||"";
							this.point2=this.examPointTitle[1]||"";
							this.point3=this.examPointTitle[2]||"";
						}
					}
				},
				immediate:true
			},
		},
		data() {
			let typeList=getQuestionType().concat([]);
			return {
				orgId:undefined,
				typeList:typeList,
				diffcultyList:[],
				bankList:[],
				pointList1:[],
				pointList2:[],
				pointList3:[],
				examBankId:undefined,
				bank:"",
				examPointId:[],
				point1:"",
				point2:"",
				point3:"",
				examQuestionTitle:"",
				type:1,
				diffculty:1,
				typeText:"单选题",
				diffcultyText:"困难",
				answer:"",
				analysis:"",
				options:[{title:"A选项",choose:true}],
				examQuestionScenarios:[],//情景小题
				addSc:false,
				questionSc:""
			};
		},
		computed: {
			
		},
		created() {
		},
		methods: {
			onRadioChange(val){
				this.answer=val;
			},
			onTextAreaConfirm(val,key){
				this[key]=val;
			},
			onOptionConfirm({detail:{value}},o,key){
				this.$set(o,"value",value);
			},
			onPickerChoose(choose,key) {
				this[key]=choose.value;
				if(key=="examBankId"){
					this.bank=choose.text;
					if(this.orgId!=choose.item.orgId){
						this.orgId=choose.item.orgId;
						this.getPointList();
						this.examPointId.length=0;
						this.point1="";
						this.point2="";
						this.point3="";
					}
				}else if(key=="point1"||key=="point2"||key=="point3"){
					this[key]=choose.text;
					if(key=="point1"){
						this.examPointId.splice(0,1,choose.value);
					}
					if(key=="point2"){
						this.examPointId.splice(1,1,choose.value);
					}
					if(key=="point3"){
						this.examPointId.splice(2,1,choose.value);
					}
				}else if(key=="type"){
					this.typeText=choose.text;
					this.typeChange();
				}else if(key=="diffculty"){
					this.diffcultyText=choose.text;
				}
			},
			typeChange(){
				if(this.type==1||this.type==2){
					// 单选/多选
					this.options.length=0;
					this.options.push({
						title:"A选项"
					});
				}else if(this.type==5){
					// 填空
					this.options.length=0;
					this.options.push({
						title:"第1空"
					});
				}else if(this.type==3){
					// 判断题
					this.answer="正确";
				}
			},
			// 增加选项
			onAddOption(){
				let i=this.options.length;
				if(i>25){
					uni.showToast({
						title:"已达上限",icon:"none"
					});return;
				}
				let title="";
				if(this.type==1||this.type==2){
					// 单选/多选
					title=codeList[i]+"选项";
				}else if(this.type==5){
					// 填空
					title=`第${i+1}空`;
				}
				this.options.push({
					title:title
				});
			},
			// 删除选项
			onDelOption(i){
				if(this.options.length<2){
					return;
				}
				this.options.splice(i,1);
				this.options.forEach((v,i)=>{
					if(this.type==1||this.type==2){
						// 单选/多选
						v.title=codeList[i]+"选项";
					}else if(this.type==5){
						// 填空
						v.title=`第${i+1}空`;
					}
				});
			},
			// 删除情景小题
			onDelSc(i){
				this.examQuestionScenarios.splice(i,1);
			},
			toEditSc(i){
				this.questionSc=this.examQuestionScenarios[i];
				this.editSc=i;
				this.addSc=true;
			},
			toAddSc(){
				this.questionSc=null;//编译成小程序undefined不会改变置空递归子组件的question
				this.addSc=true;
			},
			// 选择正确答案
			chooseRightAnswer(option){
				if(this.type==1){
					// 单选
					this.options.forEach(v=>{
						this.$set(v,"choose",false);
					});
					this.$set(option,"choose",true);
				}else if(this.type==2){
					this.$set(option,"choose",!option.choose);
				}
			},
			getPointList(orgId){
				uni.showLoading();
				examApi.getExamPointListAdmin({orgId:orgId||this.orgId}).then(data=>{
					list2FilterList(data,"examPointTitle","examPointId");
					this.pointList=[];
					this.$nextTick(function(){
						uni.hideLoading();
						this.pointList1=data;
						this.pointList2=JSON.parse(JSON.stringify(data));
						this.pointList3=JSON.parse(JSON.stringify(data));
					});
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duration: 2000,
						icon: "none"
					});
				});
			},
			onPointClick(){
				if(this.$isEmpty(this.orgId)){
					uni.showToast({
						title:"请选择题库",icon:"none"
					});
				}
			},
			onClose(){
				this.$emit("onClose");
				this.addSc=false;
				this.editSc=-1;
			},
			onComfirm(){
				// 按钮点击比文本的焦点失去事件更快执行
				setTimeout(()=>{
					// 获取情景小题
					let data=this.$refs.question.getData();
					if(this.$isEmpty(data))return;
					if(!data.options)data.options=[];
					if(this.editSc>-1){
						// 编辑
						this.examQuestionScenarios.splice(this.editSc,1,data);
						this.editSc=-1;
					}else{
						// 添加
						this.examQuestionScenarios.push(data);
					}
					this.addSc=false;
				},1);
			},
			getData(){
				let data={
					type:this.type,
					analysis:this.analysis||""
				};
				if(this.$isEmpty(this.examQuestionTitle)){
					uni.showToast({
						title:"请添加题干",icon:"none"
					});return;
				}
				data.examQuestionTitle=this.examQuestionTitle;
				if(!this.addScenarios){
					// 不是情景小题
					// 题库
					if(this.$isEmpty(this.examBankId)){
						uni.showToast({
							title:"请选择题库",icon:"none"
						});return;
					}
					data.examBankId=this.examBankId;
					data.examPointId=this.examPointId.filter(v=>{
						return !this.$isEmpty(v);
					});
					data.diffculty=this.diffculty;
				}
				data.answer=[];
				data.options=[];
				if(this.type==1||this.type==2||this.type==5){
					if(this.type==1||this.type==2){
						// 单选，多选
						let result=this.options.some(v=>{
							return v.choose;
						});
						if(!result){
							uni.showToast({
								title:"请选择正确答案",icon:"none"
							});return;
						}
					}
					// 选择+填空
					for (let o of this.options) {
						if(this.$isEmpty(o.value)){
							uni.showToast({
								title:`请输入${this.type!=5?"选项":"填空"}内容`,icon:"none"
							});return;
						}
					}
					this.options.forEach(v=>{
						if(this.type==5){
							data.answer.push(v.value);
						}else{
							data.options.push(v.value);
							if(v.choose)
								data.answer.push(v.value);
						}
					});
				}
				if(this.type==3||this.type==6){
					// 判断，问答
					if(this.$isEmpty(this.answer)){
						uni.showToast({
							title:`输入答案`,icon:"none"
						});return;
					}
					if(this.type==3){
						data.options=["正确","错误"];
					}
					data.answer.push(this.answer);
				}
				if(this.type==4){
					// 情景题，情景小题没有type=4
					if(this.examQuestionScenarios.length==0){
						uni.showToast({
							title:`请添加情景小题`,icon:"none"
						});return;
					}
					data.questionScenarios=this.examQuestionScenarios;
				}
				return data;
			}
			,getType(type){
				return this.typeList.find(v=>{
					return v.value==type;
				}).name;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.block{
		margin-bottom: 20upx;
	}
	.info-item{
		background: #FFFFFF;
		&-title-textarea{position: relative; height: 100upx;line-height: 100upx;padding:0px 30upx;}
		&,.content{font-size:$font-size-30;}
		&-title{
			display: flex;justify-content:space-between;align-items: center;
			color:#6D9985;
			.iconxuanzhong,.iconweixuanzhong,.iconyigouxuan,.iconweigouxuan{
				position: relative;
				padding-right: 30upx;
				margin-right: 30upx;
			}
			.answer-true{
				font-size:$font-size-26;margin-right: 12upx;color: #000000;
			}
			.iconbianji{
				position: relative;
				padding-right: 30upx;
				margin-right: 30upx;
			}
		}
		.content{padding-right: 30upx;}
		.required{color: #FC703E;}
		.info-item-content-textarea{padding:30upx;}
		.tips{color: #999999;}
	}
	textarea{width: 100%;min-height: 300upx; font-size: 30upx;
		/* #ifdef MP-WEIXIN */
		padding: 0px;margin: 0px; border: none;border-radius: 0px;
		/* #endif */
	}
	.create-btn{
		position: relative;
		border: none;
		z-index: 0;
	}
	
	.behavior-title{
		height: 102upx;
		display: flex;justify-content: space-between;align-items: center;
		font-weight: bold;
		font-size: $font-size-31;
		padding: 0px 30upx;
		background:#FFFFFF;position:relative;
		.close{
			color: $color-666;
			transform: rotate(45deg);
		}
	}

	.cover{
		position: fixed;
		height: 100%;
		box-sizing: border-box;
		width: 100%;
		overflow: scroll;
		transition: bottom 0.2s linear,opacity 0.2s linear;
		padding-bottom: 100upx;
		z-index: 9;
	}
	.top{
		bottom: 0;
		opacity: 1;
	}
	.bottom{
		bottom: -100%;
		opacity: 0;
	}
	
	.bottom-full-btn{
		z-index:9;
	}
</style>
