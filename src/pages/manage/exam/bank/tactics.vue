<template>
	<view class="page-full">
		<view class="tactics-info">
			<text>组卷题数:{{questionNumber}}</text>
			<text>合格分数:{{passScore2}}</text>
			<text>总分数:{{sumScore}}</text>
		</view>
		<view class="block">
			<info-input title="试卷套数" :value="paperNumber" @onInputConfirm="onInputConfirm($event,'paperNumber')" type="number" required placeholder="请填写试卷套数"></info-input>
			<view class="passScore">
				<view class="info-item">
					<view class="info-item-title">
						<text>合格比率</text><text class="required">*</text>
					</view>
					<view class="info-item-content" >
						<input  class="content" type="number" v-model="passScore"  placeholder="请填写合格比率" placeholder-class="tips content"
						 @confirm="onInputConfirm($event,'passScore')" @blur="onInputConfirm($event,'passScore')" @input="numberInput($event,'passScore')"/>
						 <text>%</text>
					</view>	
				</view>
			</view>
		</view>
		<!-- 单选题 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>单选</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="radio1RatioList" @onPickerChoose="onPickerChoose($event,'radio1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
							<view class="vert-center">
								<text class="color-fc">{{radio1Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="radio2RatioList" @onPickerChoose="onPickerChoose($event,'radio2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{radio2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="radio3RatioList" @onPickerChoose="onPickerChoose($event,'radio3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{radio3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="radioScore" type="number" @focus="zeroToEmpty('radioScore')" @blur="onInputConfirm($event,'radioScore')" @confirm="onInputConfirm($event,'radioScore')" @input="numberInput($event,'radioScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 多选 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>多选</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="multi1RatioList" @onPickerChoose="onPickerChoose($event,'multi1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
							<view class="vert-center">
								<text class="color-fc">{{multi1Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="multi2RatioList" @onPickerChoose="onPickerChoose($event,'multi2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{multi2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="multi3RatioList" @onPickerChoose="onPickerChoose($event,'multi3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{multi3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="multiScore" type="number" @focus="zeroToEmpty('multiScore')" @blur="onInputConfirm($event,'multiScore')" @confirm="onInputConfirm($event,'multiScore')" @input="numberInput($event,'multiScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 判断 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>判断</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="judge1RatioList" @onPickerChoose="onPickerChoose($event,'judge1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
							<view class="vert-center">
								<text class="color-fc">{{judge1Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="judge2RatioList" @onPickerChoose="onPickerChoose($event,'judge2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{judge2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="judge3RatioList" @onPickerChoose="onPickerChoose($event,'judge3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{judge3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="judgeScore" type="number" @focus="zeroToEmpty('judgeScore')" @blur="onInputConfirm($event,'judgeScore')" @confirm="onInputConfirm($event,'judgeScore')" @input="numberInput($event,'judgeScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 填空 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>填空</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="fill1RatioList" @onPickerChoose="onPickerChoose($event,'fill1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
								<view class="vert-center">
									<text class="color-fc">{{fill1Ratio}}</text><text class="iconfont iconxiala"></text>
								</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="fill2RatioList" @onPickerChoose="onPickerChoose($event,'fill2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{fill2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="fill3RatioList" @onPickerChoose="onPickerChoose($event,'fill3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{fill3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="fillScore" type="number" @focus="zeroToEmpty('fillScore')" @blur="onInputConfirm($event,'fillScore')" @confirm="onInputConfirm($event,'fillScore')" @input="numberInput($event,'fillScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 问答 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>问答</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="qa1RatioList" @onPickerChoose="onPickerChoose($event,'qa1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
							<view class="vert-center">
								<text class="color-fc">{{qa1Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="qa2RatioList" @onPickerChoose="onPickerChoose($event,'qa2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{qa2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="qa3RatioList" @onPickerChoose="onPickerChoose($event,'qa3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{qa3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="qaScore" type="number" @focus="zeroToEmpty('qaScore')" @blur="onInputConfirm($event,'qaScore')" @confirm="onInputConfirm($event,'qaScore')" @input="numberInput($event,'qaScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 情景 -->
		<view class="block">
			<view class="question-type">
				<view class="title"><text>情景</text></view>
				<view class="difficulty">
					<data-picker mode="selector" :dataList="sc1RatioList" @onPickerChoose="onPickerChoose($event,'sc1Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>困难</text></view>
							<view class="vert-center">
								<text class="color-fc">{{sc1Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="sc2RatioList" @onPickerChoose="onPickerChoose($event,'sc2Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>中等</text></view>
							<view class="vert-center">
								<text  class="color-ff">{{sc2Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<data-picker mode="selector" :dataList="sc3RatioList" @onPickerChoose="onPickerChoose($event,'sc3Ratio')">
						<view class="difficulty-item">
							<view class="difficulty-title"><text>简单</text></view>
							<view class="vert-center">
								<text class="color-ff">{{sc3Ratio}}</text><text class="iconfont iconxiala"></text>
							</view>
						</view>
					</data-picker>
					<view class="difficulty-item">
						<view class="difficulty-title"><text>每题</text></view>
						<view class="difficulty-input">
							<input class="score" v-model="scScore" type="number" @focus="zeroToEmpty('scScore')" @blur="onInputConfirm($event,'scScore')" @confirm="onInputConfirm($event,'scScore')" @input="numberInput($event,'scScore')" placeholder="请填写" placeholder-style="color:#999999;font-size:28upx" />
							<text class="unit">分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="first" class="bottom-full-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
		<view v-else class="bottom-btn van-hairline--top">
			<text  @tap="onCancel"  class="reset-btn van-hairline--right">取消</text>
			<text  @tap="onToEdit" class="confirm-btn">确定</text>
		</view>
	</view>
</template>

<script>
	import infoInput from "@/components/infoInput.vue"
	import dataPicker from "@/components/dataPicker.vue"
	import examApi from "@/api/modules/exam.js"
	export default {
		components: {
			infoInput,dataPicker
		},
		computed:{
			sumScore(){
				return (this.radio1Ratio+this.radio2Ratio+this.radio3Ratio)*this.radioScore+
				(this.multi1Ratio+this.multi2Ratio+this.multi3Ratio)*this.multiScore+
				(this.judge1Ratio+this.judge2Ratio+this.judge3Ratio)*this.judgeScore+
				(this.sc1Ratio+this.sc2Ratio+this.sc3Ratio)*this.scScore+
				(this.fill1Ratio+this.fill2Ratio+this.fill3Ratio)*this.fillScore+
				(this.qa1Ratio+this.qa2Ratio+this.qa3Ratio)*this.qaScore;
			},
			passScore2(){
				return this.$getFloat(this.sumScore*this.passScore/100,1);
			}
		},
		data() {
			return {
				first:false,
				examBankId:undefined,
				paperNumber:1,
				passScore:60,
				questionNumber:0,
				radio1RatioList:[{name:0,value:0}],//单选题-困难试题数量
				radio2RatioList:[{name:0,value:0}],//单选题-中等试题数量
				radio3RatioList:[{name:0,value:0}],//单选题-简单试题数量
				multi1RatioList:[{name:0,value:0}],//多选题-困难试题数量
				multi2RatioList:[{name:0,value:0}],//多选题-中等试题数量
				multi3RatioList:[{name:0,value:0}],//多选题-容易试题数量
				judge1RatioList:[{name:0,value:0}],//判断题-困难试题数量
				judge2RatioList:[{name:0,value:0}],//判断题-中等试题数量
				judge3RatioList:[{name:0,value:0}],//判断题-容易试题数量
				sc1RatioList:[{name:0,value:0}],//情景题-困难试题数量
				sc2RatioList:[{name:0,value:0}],//情景题-中等试题数量
				sc3RatioList:[{name:0,value:0}],//情景题-容易试题数量
				fill1RatioList:[{name:0,value:0}],//填空题-困难试题数量
				fill2RatioList:[{name:0,value:0}],//填空题-中等试题数量
				fill3RatioList:[{name:0,value:0}],//填空题-容易试题数量
				qa1RatioList:[{name:0,value:0}],//问答题-困难试题数量
				qa2RatioList:[{name:0,value:0}],//问答题-中等试题数量
				qa3RatioList:[{name:0,value:0}],//问答题-容易试题数量
				radio1Ratio:0,//单选题-困难试题数量
				radio2Ratio:0,//单选题-中等试题数量
				radio3Ratio:0,//单选题-简单试题数量
				multi1Ratio:0,//多选题-困难试题数量
				multi2Ratio:0,//多选题-中等试题数量
				multi3Ratio:0,//多选题-容易试题数量
				judge1Ratio:0,//判断题-困难试题数量
				judge2Ratio:0,//判断题-中等试题数量
				judge3Ratio:0,//判断题-容易试题数量
				sc1Ratio:0,//情景题-困难试题数量
				sc2Ratio:0,//情景题-中等试题数量
				sc3Ratio:0,//情景题-容易试题数量
				fill1Ratio:0,//填空题-困难试题数量
				fill2Ratio:0,//填空题-中等试题数量
				fill3Ratio:0,//填空题-容易试题数量
				qa1Ratio:0,//问答题-困难试题数量
				qa2Ratio:0,//问答题-中等试题数量
				qa3Ratio:0,//问答题-容易试题数量
				radioScore:1,//单选题
				multiScore:1,//多选题
				judgeScore:1,//判断题
				scScore:1,//情景题
				fillScore:1,//填空题
				qaScore:1,//问答题
				
			};
		},
		onLoad({examBankId}) {
			this.$updateNavbarTitle("组卷");
				uni.showLoading();
			this.examBankId=examBankId;
			examApi.getQueryPapersNumberAdmin(examBankId).then(data=>{
				// 试题数量信息
				this.questionNumber=data.questionNumber;
				this.radio1Ratio=this.fillList(this.radio1RatioList,data.radio1Ratio);
				this.radio2Ratio=this.fillList(this.radio2RatioList,data.radio2Ratio);
				this.radio3Ratio=this.fillList(this.radio3RatioList,data.radio3Ratio);
				this.multi1Ratio=this.fillList(this.multi1RatioList,data.multi1Ratio);
				this.multi2Ratio=this.fillList(this.multi2RatioList,data.multi2Ratio);
				this.multi3Ratio=this.fillList(this.multi3RatioList,data.multi3Ratio);
				this.judge1Ratio=this.fillList(this.judge1RatioList,data.judge1Ratio);
				this.judge2Ratio=this.fillList(this.judge2RatioList,data.judge2Ratio);
				this.judge3Ratio=this.fillList(this.judge3RatioList,data.judge3Ratio);
				this.sc1Ratio=this.fillList(this.sc1RatioList,data.sc1Ratio);
				this.sc2Ratio=this.fillList(this.sc2RatioList,data.sc2Ratio);
				this.sc3Ratio=this.fillList(this.sc3RatioList,data.sc3Ratio);
				this.fill1Ratio=this.fillList(this.fill1RatioList,data.fill1Ratio);
				this.fill2Ratio=this.fillList(this.fill2RatioList,data.fill2Ratio);
				this.fill3Ratio=this.fillList(this.fill3RatioList,data.fill3Ratio);
				this.qa1Ratio=this.fillList(this.qa1RatioList,data.qa1Ratio);
				this.qa2Ratio=this.fillList(this.qa2RatioList,data.qa2Ratio);
				this.qa3Ratio=this.fillList(this.qa3RatioList,data.qa3Ratio);
				
				examApi.getQueryExamTacticsAdmin(examBankId).then(data=>{
					// 原有组卷策略
					if(data){
						this.paperNumber=data.paperNumber;
						this.passScore=data.passScore*100;
						this.radio1Ratio=this.getQuestionNumber(this.radio1RatioList,data.radio1Ratio);
						this.radio2Ratio=this.getQuestionNumber(this.radio2RatioList,data.radio2Ratio);
						this.radio3Ratio=this.getQuestionNumber(this.radio3RatioList,data.radio3Ratio);
						this.multi1Ratio=this.getQuestionNumber(this.multi1RatioList,data.multi1Ratio);
						this.multi2Ratio=this.getQuestionNumber(this.multi2RatioList,data.multi2Ratio);
						this.multi3Ratio=this.getQuestionNumber(this.multi3RatioList,data.multi3Ratio);
						this.judge1Ratio=this.getQuestionNumber(this.judge1RatioList,data.judge1Ratio);
						this.judge2Ratio=this.getQuestionNumber(this.judge2RatioList,data.judge2Ratio);
						this.judge3Ratio=this.getQuestionNumber(this.judge3RatioList,data.judge3Ratio);
						this.sc1Ratio=this.getQuestionNumber(this.sc1RatioList,data.sc1Ratio);
						this.sc2Ratio=this.getQuestionNumber(this.sc2RatioList,data.sc2Ratio);
						this.sc3Ratio=this.getQuestionNumber(this.sc3RatioList,data.sc3Ratio);
						this.fill1Ratio=this.getQuestionNumber(this.fill1RatioList,data.fill1Ratio);
						this.fill2Ratio=this.getQuestionNumber(this.fill2RatioList,data.fill2Ratio);
						this.fill3Ratio=this.getQuestionNumber(this.fill3RatioList,data.fill3Ratio);
						this.qa1Ratio=this.getQuestionNumber(this.qa1RatioList,data.qa1Ratio);
						this.qa2Ratio=this.getQuestionNumber(this.qa2RatioList,data.qa2Ratio);
						this.qa3Ratio=this.getQuestionNumber(this.qa3RatioList,data.qa3Ratio);
						this.radioScore=data.radioScore;
						this.multiScore=data.multiScore;
						this.judgeScore=data.judgeScore;
						this.scScore=data.scScore;
						this.fillScore=data.fillScore;
						this.qaScore=data.qaScore;
					}else{
						this.first=true;
					}
						uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duRatioListn: 2000,
						icon: "none"
					});
				});
				
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title:typeof err == "string"?err:JSON.stringify(err),
					duRatioListn: 2000,
					icon: "none"
				});
			});
		},
		methods:{
			numberInput({detail:{value}},key){
				if(value%1!=0)
					setTimeout(()=>{
						this[key]=Number.parseInt(value);
					},0);
			},
			zeroToEmpty(key){
				if(this[key]==0){
					this[key]="";
				}
			},
			onInputConfirm(value,key){
				if(value.detail){
					value=value.detail.value;
				}
				if(this.$isEmpty(value)){
					value=0;
				}
				this[key]=value;
			},
			fillList(list,number){
				list.length=0;
				for (var i = 0; i < (number+1); i++) {
					list.push({name:i,value:i});
				}
				list[list.length-1].choose=true;
				return list[list.length-1].value;
			},
			getQuestionNumber(list,oldNum){
				let max=list[list.length-1].value;
				if(oldNum>max){
					this.$set(list[list.length-1],"choose",true);
				}else{
					let obj=list.find(v=>{
						return v.value==oldNum;
					});
					list[list.length-1].choose=false;//取消最大默认选择
					this.$set(obj,"choose",true);
				}
				return oldNum>max?max:oldNum;
			},
			onPickerChoose(choose,key){
				this[key]=choose.value;
			},
			onToEdit(){
				if(this.passScore>100||this.passScore<30){
					this.$toast("请填写30-100范围内的合格比率");return;
				}
				uni.showLoading();
				let rqData={
					paperNumber:this.paperNumber,
					passScore:this.passScore/100,
					radio1Ratio:this.radio1Ratio,
					radio2Ratio:this.radio2Ratio,
					radio3Ratio:this.radio3Ratio,
					multi1Ratio:this.multi1Ratio,
					multi2Ratio:this.multi2Ratio,
					multi3Ratio:this.multi3Ratio,
					judge1Ratio:this.judge1Ratio,
					judge2Ratio:this.judge2Ratio,
					judge3Ratio:this.judge3Ratio,
					sc1Ratio:this.sc1Ratio,
					sc2Ratio:this.sc2Ratio,
					sc3Ratio:this.sc3Ratio,
					fill1Ratio:this.fill1Ratio,
					fill2Ratio:this.fill2Ratio,
					fill3Ratio:this.fill3Ratio,
					qa1Ratio:this.qa1Ratio,
					qa2Ratio:this.qa2Ratio,
					qa3Ratio:this.qa3Ratio,
					radioScore:this.radioScore,
					multiScore:this.multiScore,
					judgeScore:this.judgeScore,
					scScore:this.scScore,
					fillScore:this.fillScore,
					qaScore:this.qaScore,
					examBankId:this.examBankId
				}
				
				examApi.postCreateExamTacticsAdmin(rqData).then(data=>{
					uni.hideLoading();
					uni.showToast({
						title:"组卷成功",icon:"none",
						complete:()=> {
							this._refreshPrePage();
						}
					});
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000);
				}).catch(err => {
					uni.showToast({
						title:typeof err == "string"?err:JSON.stringify(err),
						duRatioListn: 2000,
						icon: "none"
					});
				});
			},
			onCancel(){
				uni.navigateBack({
					delta:1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-full{
		padding-bottom: 100upx;
	}
	.tactics-info{
		$h:80upx;
		height: $h;line-height: $h;
		font-size: $font-size-28;color: #FC703E;background: #FFF4F0;
		padding-left: 5upx;
		position: sticky;top: 0px;z-index: 10;
		text{
			margin: auto 25upx;
		}
	}
	.passScore{
		width: 100%;background: #FFFFFF;
		.info-item{position: relative;margin-left: 30upx;height: 100upx;}
		.info-item-content,.info-item{display: flex;align-items: center;justify-content: space-between;}
		.info-item-content{width: 460upx;
		padding-right: 30upx;
			text{
				font-size: $font-size-30;color: $color-666;
			}
		}
		.info-bottom-border{border-bottom: 1upx solid #D8D8D8;}
		.info-item-title,.content{font-size:30upx;font-family:PingFang-SC-Medium;}
		.info-item-title{color:#6D9985;}
		.content{padding-right: 30upx;}
		.ban{color: #666666;}
		.tips{color: #999999;}
		.required{color: #FC703E;}
		input{width: 100%;font-size: 30upx;}
	}
	.block{
		margin-bottom: 20upx;
	}
	.bottom-full-btn{
		z-index: 1;
	}
	.question-type{
		background-color: #FFFFFF;
		width: 100%;
		height: 280upx;box-sizing: border-box;
		padding: 30upx;
		display:flex;align-items: center;justify-content: space-between;
		.title{
			font-size: $font-size-40;font-weight: bold;color:#6D9985 ;
		}
	}
	.difficulty{
		display:flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		height:220upx;
		width:564upx;
		&-item{
			display: flex;justify-content: space-between;align-items: center;
			width: 272upx;height: 100upx;background:#F0F9F5;border:1upx solid #92BCA9;border-radius:10upx;
			box-sizing: border-box;
			padding: 0px 20upx 0px 35upx;
		}
		&-title{
			font-size: $font-size-28
		}
		&-input{
			flex-grow: 1;
			display: flex;align-items: center;
		}
		.score{
			font-size:$font-size-40;
			font-weight:bold;
			color:#6D9985;
			width: 90upx;
			margin:0px 12upx 0px 30upx;
			text-align: right;
		}
		.unit{
			font-size:$font-size-24;
			color:#6D9985;
		}
		.iconxiala{
			color: #999999;font-size: 18upx;margin-left: 20upx;
		}
		.color-fc{
			color:#FC703E;
		}
		.color-ff{
			color:#FFAE00;
		}
	}
	
	.bottom-btn{
		$height:98upx;
		position:fixed;bottom:0px;
		font-size:$font-size-32;
		width:100%;height:$height;
		background: #FFFFFF;
		text{display:inline-block;width :50%;height: 100%;line-height: $height;text-align: center;}
	}
	.reset-btn{position: relative;}
	.confirm-btn{background: $color-main;color: #FFFFFF;}
	.vert-center{
		display: flex;align-items: center;
	}
</style>
