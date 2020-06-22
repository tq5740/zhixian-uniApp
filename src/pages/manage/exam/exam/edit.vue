<template>
	<view class="exam-edit page-full">
		<view class="block">
			<template v-if="create">
				<info-picker title="企业名称" :text="orgName" showSearch @onPickerChoose="onPickerChoose($event,'orgId')" :dataList="orgList" required placeholder="请选择"></info-picker>
				<info-input title="考试标题" :value="examTitle" @onInputConfirm="onInputConfirm($event,'examTitle')" required placeholder="请填写考试标题"></info-input>
			</template>
			<template v-else>
				<info-text title="企业名称" :value="orgName" required></info-text>
				<info-text title="考试标题" :value="examTitle" required></info-text>
			</template>
		</view>
		<view class="block">
			<info-image title="考试封面" :value="examImg" @imageChoose="imageChoose" :uploadType="2" path="/exam/img" placeholder="手机拍照或上传" canUpload horizontal :width="203" :height="114"></info-image>
		</view>
		<view class="block">
			<info-radio title="考试类型" :disabled="!create" :value="type" :options="typeList" @onRadioChange="onRadioChange($event,'type')" required></info-radio>
			<template v-if="create">
				<info-picker title="选择题库" :text="examBankText" @onPickerChoose="onPickerChoose($event,'examBankId')" :dataList="examBankList" placeholder="请选择" required></info-picker>
			</template>
			<template v-else>
				<info-text title="选择题库" :value="examBankText" required></info-text>
			</template>
			<info-picker title="考试分类" showChoose :text="categoryText" @onPickerChoose="onPickerChoose($event,'categoryId')" :dataList="categoryList" placeholder="请选择"></info-picker>
			<info-picker title="可见范围" :text="visibleRangeText" @onPickerChoose="onPickerChoose($event,'visibleRange')" :dataList="visibleRangeList" required placeholder="请选择"></info-picker>
		</view>
		<view class="block">
			<info-radio title="考完显示成绩" :value="isDisplay" @onRadioChange="onRadioChange($event,'isDisplay')" :options="isDisplayList" required></info-radio>
		</view>
		<view class="block">
			<view v-show="type==2">
				<template v-if="create">
					<info-input title="考试时长" :value="examLength" @onInputConfirm="onInputConfirm($event,'examLength')" type="number" required placeholder="请填写考试时长（分钟）"></info-input>
					<info-picker title="开始日期" :text="startDate" @onPickerChoose="onPickerChoose($event,'startDate')" mode="date" placeholder="请选择" required></info-picker>
				</template>
				<template v-else>
					<info-text title="考试时长" :value="examLength" required></info-text>
					<info-text title="开始日期" :value="startDate" required></info-text>
				</template>
				<template v-if="state!=4">
					<info-picker title="开始时间" :text="startTime" @onPickerChoose="onPickerChoose($event,'startTime')" mode="selector" :dataList="startTimeList" placeholder="请选择" required></info-picker>
				</template>
				<template v-else>
					<info-text title="开始时间" :value="startTime" required></info-text>
				</template>
				
			</view>
		</view>
		<view class="block">
			<info-input title="原价" :value="originalPrice" @onInputConfirm="onInputConfirm($event,'originalPrice')" type="digit" placeholder="请填写原价（元）"></info-input>
			<info-input title="现价/优惠价" :value="price" @onInputConfirm="onInputConfirm($event,'price')" type="digit" placeholder="请填写现价/优惠价（元）"></info-input>
		</view>
		<info-textarea v-if="create" title="考试简介" :value="intro" @onTextAreaConfirm="onTextAreaConfirm" required placeholder="请输入考试简介"></info-textarea>
		<info-richtext v-else title="考试简介（请在pc端排版编辑）" :value="$escape2Html(intro)"></info-richtext>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
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
import infoRadio from "@/components/infoRadio.vue"
import userApi from "@/api/modules/user.js"
import examApi from "@/api/modules/exam.js"
import puApi from "@/api/modules/public.js"
import { list2FilterList } from "@/utils/utils.js"

export default {
	components: {
		infoPicker, infoInput, infoImage, infoTextarea, infoText, infoRadio,infoRichtext
	},
	data() {
		return {
			create: false,
			examId: undefined,
			orgId: undefined,
			orgName: "",
			examTitle: "",
			examImg: "",
			type: 2,
			examBankId: "",
			examBankText: "",//题库
			categoryId:"",
			categoryText: "",
			visibleRange: 3,
			visibleRangeText: "开放",
			isDisplay: 1,
			startDate: "",
			startTime: "",
			examLength: 0,
			originalPrice: 0,//原价
			price: 0,
			intro: "",
			orgList: [],
			typeList: [{ text: '练习', value: 1 }, { text: '正式考试', value: 2 }],
			examBankList: [],
			categoryList: [],
			visibleRangeList: [{ name: '仅自己', value: 1 }, { name: '本企业', value: 2 }, { name: '开放', value: 3 }],
			isDisplayList: [{ text: '显示', value: 1 }, { text: '不显示', value: 0 }],
			startTimeList:[[{ name: '8:00', value: "8:00" },{ name: '8:30', value: "8:30" },{ name: '9:00', value: "9:00" },{ name: '9:30', value: "9:30" },{ name: '10:00', value: "10:00" },{ name: '10:30', value: "10:30" },{ name: '11:00', value: "11:00" },{ name: '11:30', value: "11:30" },{ name: '12:00', value: "12:00" },{ name: '12:30', value: "12:30" },{ name: '13:00', value: "13:00" },{ name: '13:30', value: "13:30" },{ name: '14:00', value: "14:00" },{ name: '14:30', value: "14:30" },{ name: '15:00', value: "15:00" },{ name: '15:30', value: "15:30" },{ name: '16:00', value: "16:00" },{ name: '16:30', value: "16:30" },{ name: '17:00', value: "17:00" },{ name: '17:30', value: "17:30" },{ name: '18:00', value: "18:00" },{ name: '18:30', value: "18:30" },{ name: '19:00', value: "19:00" },{ name: '19:30', value: "19:30" },{ name: '20:00', value: "20:00" }]],
			state:0//为4不能修改开始时间
		};
	},
	onLoad({ create, id, categoryTitle, examBankTitle }) {
		userApi.getQueryMyorgList().then(data => {
			list2FilterList(data, "orgName", "orgId");
			this.orgList = data;
		});
		if (create) {
			this.create = true;
			this.$updateNavbarTitle("创建考试");
			this.orgId=this.$store.state.userInfo.org.orgId;
			this.orgName=this.$store.state.userInfo.org.orgName;
			this.getCategoryList(this.orgId);
			this.getExamBankList(this.orgId);
		} else {
			uni.showLoading();
			this.$updateNavbarTitle("编辑考试");
			this.examId = id;
			this.categoryText = categoryTitle;
			this.examBankText = examBankTitle;
			examApi.getQueryExamAdmin(id).then(data => {
				this.orgId = data.orgId;
				this.examTitle = data.examTitle;
				this.examImg = data.examImg || this.$store.state.defaultImg.exam;
				this.type = data.type;
				this.examBankId = data.examBankId;
				this.categoryId = data.categoryId;
				this.visibleRange = data.visibleRange;
				this.intro = data.intro;
				this.originalPrice = data.originalPrice;
				this.price = data.price;
				this.isDisplay = data.isDisplay;
				this.examLength = data.examLength;
				if (data.startTime) {
					this.startDate = this.$formatDate(data.startTime, "YYYY-MM-DD");
					this.startTime = this.$formatDate(data.startTime, "hh:mm");
				}
				userApi.getQueryOrg(data.orgId).then(data => {
					if (data)
						this.orgName = data.orgName;
				});
				this.visibleRangeText = this.visibleRangeList.find(v => {
					return v.value == data.visibleRange;
				}).name;
				// 标题，企业，类型，题库，时间，时长不能修改
				this.state=data.state;
				this.getCategoryList(data.orgId);
				this.getExamBankList(data.orgId);
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: typeof err == "string" ? err : JSON.stringify(err),
					duration: 2000,
					icon: "none"
				});
			});
		}
	},
	methods: {
		imageChoose(img) {
			this.examImg = img;
		},
		onTextAreaConfirm(val) {
			this.intro = val;
		},
		onInputConfirm(val, key) {
			this[key] = val;
		},
		onPickerChoose(choose, key) {
			if (key == "orgId") {
				this.orgName = choose.text;
				this.examBankId=this.examBankText=this.categoryId=this.categoryText= "";
				this.getCategoryList(choose.value);
				this.getExamBankList(choose.value);
			} else if (key == "categoryId") {
				this.categoryText = choose.text;
			} else if (key == "visibleRange") {
				this.visibleRangeText = choose.text;
			} else if (key == "examBankId") {
				this.examBankText = choose.text;
			}else if(key=="startDate"){
				if(new Date(choose.value+" "+(this.startTime||"23:59:59")).getTime()<Date.now()){
					this.$toast("开始时间不能小于当前时间");
					return;
				}
			}else if(key=="startTime"){
				choose.value=choose.text[0].value;
				if(new Date(this.startDate+" "+choose.value).getTime()<Date.now()){
					this.$toast("开始时间不能小于当前时间");
					return;
				}
			}
			this[key] = choose.value;
		},
		onRadioChange(val, key) {
			this[key] = val;
		},
		async getCategoryList(orgId) {
			puApi.getExamCategoryListAdmin({ orgId }).then(data => {
				list2FilterList(data, "categoryTitle", "categoryId");
				this.categoryList =[];
				this.$nextTick(()=>{
					this.categoryList = data;
				})
				
			})
		},
		async getExamBankList(orgId) {
			examApi.getQueryExamBankTitleAdmin({ orgId }).then(data => {
				list2FilterList(data, "examBankTitle", "examBankId");
				this.examBankList =[];
				this.$nextTick(()=>{
					this.examBankList = data.filter(v=>{
						return v.type;
					});
				})
			})
		},
		onToEdit() {
			if (this.$isHaveEmpty([this.orgId, this.examTitle, this.examBankId, this.visibleRange])) {
				uni.showToast({
					title: "请填写完整信息", icon: "none"
				}); return;
			}
			if(this.create&&this.$isEmpty(this.intro)){
				uni.showToast({
					title: "请填写完整信息", icon: "none"
				}); return;
			}
			// 正式考试，开始时间必填
			if (this.type == 2) {
				if (this.$isHaveEmpty([this.startDate, this.startTime, this.examLength])) {
					uni.showToast({
						title: "请填写完整信息", icon: "none"
					}); return;
				}
			}
			let rqData = {
				orgId: this.orgId,
				examTitle: this.examTitle,
				examImg: this.examImg,
				type: this.type,
				examBankId: this.examBankId,
				categoryId: this.categoryId,
				visibleRange: this.visibleRange,
				isDisplay: this.isDisplay,
				examLength: this.examLength,
				intro: this.intro,
				originalPrice: this.originalPrice,
				price: this.price
			}
			if (this.type == 2) {
				rqData.startTime = `${this.startDate} ${this.startTime}:00`;
			}
			
			let r_ = undefined;
			uni.showLoading();
			if (this.create) {
				r_ = examApi.postCreateExamAdmin(rqData);
			} else {
				rqData.examId = this.examId;
				r_ = examApi.postUpdateExamAdmin(rqData);
			}

			if (r_) {
				r_.then(data => {
					uni.hideLoading();
					uni.showToast({
						title: `${this.create ? "创建" : "修改"}成功`,
						complete: () => {
							this._refreshPrePage();
						}
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},2000);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: typeof err == "string" ? err : JSON.stringify(err),
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
	.exam-edit{
		padding-bottom: 1upx;
	}
	.block {
	  margin-bottom: 20upx;
	}

	.confirm-btn {
	  $height: 88upx;
	  width: 690upx;
	  height: $height;
	  line-height: $height;
	  text-align: center;
	  background: $color-main;
	  border-radius: 10upx;
	  color: #fff;
	  font-size: $font-size-32;
	  margin: 40upx auto;
	}
</style>
