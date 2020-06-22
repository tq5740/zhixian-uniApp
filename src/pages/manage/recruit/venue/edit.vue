<template>
	<view class="venue-edit page-full">
		<info-image title="封面" :value="venueImg" :uploadType="2" path="/work/venue/img" @imageChoose="onInputConfirm($event,'venueImg')" canUpload horizontal placeholder="手机拍照或上传" :width="120"></info-image>
		<view class="separate"></view>
		<info-input title="名称" :value="venueTitle" @onInputConfirm="onInputConfirm($event,'venueTitle')" placeholder="请填入名称" required></info-input>
		<info-picker title="类型" :text="typeText" mode="selector" @onPickerChoose="onPickerChoose($event,'type')" placeholder="请选择类型" :dataList='typeList' required></info-picker>
		<info-picker title="开始日期" mode="date" :text="startDate" :start="minDate" @onPickerChoose="onPickerChoose($event,'startDate')" placeholder="请选择开始日期" required></info-picker>
		<info-picker title="结束日期" mode="date" :text="endDate" :start="minEndDate" @onPickerChoose="onPickerChoose($event,'endDate')" placeholder="请选择结束日期" required></info-picker>
		<info-picker title="开始时间段" mode="time" :text="periodStart" @onPickerChoose="onPickerChoose($event,'periodStart')" placeholder="请选择开始时间段" required></info-picker>
		<info-picker title="结束时间段" mode="time" :text="periodEnd" :start="periodStart" @onPickerChoose="onPickerChoose($event,'periodEnd')" placeholder="请选择结束时间段" required></info-picker>
		<view class="separate"></view>
		<info-picker title="报名截止时间" mode="date" :text="deadline" :start="minDate" :end="maxDeadline" @onPickerChoose="onPickerChoose($event,'deadline')" placeholder="请选择报名截止时间" required></info-picker>
		<info-input title="联系人" :value="contact" @onInputConfirm="onInputConfirm($event,'contact')" placeholder="请选择联系人" required></info-input>
		<info-input title="联系电话" :value="phone" @onInputConfirm="onInputConfirm($event,'phone')" placeholder="请选择联系电话" required></info-input>
		<!-- <info-picker title="地点" mode="region" :text="area" @onPickerChoose="onPickerChoose($event,'area')" placeholder="请选择地点" required></info-picker> -->
		<info-input title="地址" :value="address" @onInputConfirm="onInputConfirm($event,'address')" placeholder="请填入街道" required></info-input>
		<view class="separate"></view>
		<info-textarea title="企业参会须知" :value="notice" @onTextAreaConfirm="onInputConfirm($event,'notice')" placeholder="请填入企业参会须知" required></info-textarea>
		<view class="separate"></view>
		<info-textarea title="简介" :value="intro" @onTextAreaConfirm="onInputConfirm($event,'intro')" placeholder="请填入简介" required></info-textarea>
		<view class="confirm-btn" @tap="onToConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
import workApi from "@/api/modules/work.js"
import infoInput from "@/components/infoInput.vue"
import infoImage from "@/components/infoImage.vue"
import infoPicker from "@/components/infoPicker.vue"
import infoTextarea from "@/components/infoTextarea.vue"
export default {
	components: {
		infoInput, infoImage, infoPicker, infoTextarea
	},
	data() {
		let minDate = this.$formatDate(Date.now(), "YYYY-MM-DD");
		return {
			create: false,
			minDate: minDate,
			venueId: undefined,
			venueTitle: undefined,
			venueImg: undefined,
			type: undefined,
			typeText: undefined,
			startDate: undefined,
			endDate: undefined,
			period: undefined,
			periodStart: undefined,
			periodEnd: undefined,
			contact: undefined,
			phone: undefined,
			deadline: undefined,
			// area:undefined,
			address: undefined,
			notice: undefined,
			intro: undefined,
			orgId: undefined,
			typeList: [{ name: "专场招聘", value: 1 }, { name: "校园招聘", value: 2 }]
		}
	},
	computed: {
		minEndDate() {
			return this.startDate || this.minDate;
		},
		maxDeadline() {
			return this.startDate || this.minDate;
		}
	},
	onLoad({ id, create }) {
		this.$updateNavbarTitle("编辑现场招聘会");
		if (create) {
			this.create = true;
			this.orgId = uni.getStorageSync("userinfo").org.orgId;
		} else {
			workApi.getQueryenueAdmin(id).then(v => {
				this.venueId = v.venueId;
				this.venueTitle = v.venueTitle;
				this.venueImg = v.venueImg || this.$store.state.defaultImg.logo;
				this.type = v.type;
				this.typeText = v.type == 1 ? "专场招聘" : "校园招聘";
				this.startDate = this.$formatDate(v.startDate, "YYYY-MM-DD");
				this.endDate = this.$formatDate(v.endDate, "YYYY-MM-DD");
				this.period = v.period;
				this.periodStart = v.period.split("-")[0];
				this.periodEnd = v.period.split("-")[1];
				this.contact = v.contact;
				this.phone = v.phone;
				this.deadline = this.$formatDate(v.deadline, "YYYY-MM-DD");
				this.area = v.area;
				this.address = v.address;
				this.notice = v.notice;
				this.intro = v.intro;
				this.orgId = v.orgId;
			});
		}
	},
	methods: {
		onToConfirm() {
			if (!this.venueTitle || !this.type || !this.startDate || !this.endDate || !this.periodStart ||
				!this.periodEnd || !this.contact || !this.phone || !this.deadline || !this.address ||
				!this.notice || !this.intro) {
				uni.showToast({
					icon: "none", title: "请填写完整信息"
				});
				return;
			}
			if (!this.$mobileReg(this.phone)) {
				uni.showToast({
					icon: "none", title: "请填写正确的手机号"
				});
				return;
			}
			if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
				uni.showToast({
					icon: "none", title: "开始时间不得大于结束时间"
				});
				return;
			}
			if (new Date(this.deadline).getTime() > new Date(this.startDate).getTime()) {
				uni.showToast({
					icon: "none", title: "报名截止时间不得大于开始时间"
				});
				return;
			}
			if (new Date(`2000-1-1 ${this.periodStart}`).getTime() > new Date(`2000-1-1 ${this.periodEnd}`).getTime()) {
				uni.showToast({
					icon: "none", title: "请选择正确的时间段"
				});
				return;
			}
			this.period = this.periodStart + "-" + this.periodEnd;
			let rqData = {
				orgId: this.orgId,
				venueTitle: this.venueTitle,
				venueImg: this.venueImg,
				type: this.type,
				startDate: this.startDate,
				endDate: this.endDate,
				period: this.period,
				contact: this.contact,
				phone: this.phone,
				deadline: this.deadline + " 23:59:59",
				address: this.address,
				notice: this.notice,
				intro: this.intro
			}
			let r_ = undefined;
			uni.showLoading();
			if (this.create) {
				r_ = workApi.postCreateVenueAdmin(rqData);
			} else {
				rqData.venueId = this.venueId;
				r_ = workApi.postUpdateVenueAdmin(rqData);
			}
			if (r_) {
				r_.then(data => {
					this.$toast("操作成功！");
					setTimeout(() => {
						this._refreshPrePage();
						uni.navigateBack({ delta: 1 });
					}, 2000);
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err,
						icon: "none"
					})
				})
			}

		},
		onPickerChoose(choose, key) {
			if (key == "area") {
				this.area = choose.text[0] + choose.text[1] + choose.text[2];
			} else if (key == "type") {
				this.type = choose.value;
				this.typeText = choose.text;
			} else {
				this[key] = choose.text;
			}
		},
		onInputConfirm(val, key) {
			this[key] = val;
		},
	}
}
</script>

<style lang="scss" scoped>
	.venue-edit{
		padding-bottom: 1upx;}
	.separate {
	  min-height: 20upx;
	  color: #fc703e;
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
