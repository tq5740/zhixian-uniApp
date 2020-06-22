<template>
	<view class="train-edit page-full">
		<view class="block">
			<info-picker title="企业名称" :text="orgName" showSearch @onPickerChoose="onPickerChoose($event,'orgId')" :dataList="orgList" required placeholder="请选择"></info-picker>
			<info-input title="培训标题" :value="trainTitle" @onInputConfirm="onInputConfirm($event,'trainTitle')" required placeholder="请填写培训标题"></info-input>
		</view>
		<view class="block">
			<info-image title="培训封面" :value="trainImg" @imageChoose="imageChoose" :uploadType="2" path="/train/train/img" placeholder="手机拍照或上传" canUpload horizontal :width="203" :height="114"></info-image>
		</view>
		<view class="block">
			<info-picker title="培训类型" :text="trainTypeText" @onPickerChoose="onPickerChoose($event,'trainType')" :dataList="trainTypeList" required placeholder="请选择"></info-picker>
			<info-picker title="培训分类" :text="categoryText" @onPickerChoose="onPickerChoose($event,'categoryId')" :dataList="categoryList" placeholder="请选择"></info-picker>
			<info-picker title="可见范围" :text="visibleRangeText" @onPickerChoose="onPickerChoose($event,'visibleRange')" :dataList="visibleRangeList" required placeholder="请选择"></info-picker>
			<info-input title="辅导员" :value="tutor?tutor:''" @onInputConfirm="onInputConfirm($event,'tutor')" placeholder="请填写辅导员姓名"></info-input>
		</view>
		<view class="block" @tap="addressClick">
			<info-text title="培训地址" required :value="address?address:'请选择地址'" :color="address?'#000000':'#999999'"></info-text>
		</view>
		<view class="block">
			<info-picker title="开班开始日期" :value="startDate" @onPickerChoose="onPickerChoose($event,'startDate')" mode="date" required placeholder="请选择"></info-picker>
			<info-picker title="开班结束日期" :value="endDate" :start="startDate" @onPickerChoose="onPickerChoose($event,'endDate')" mode="date" required placeholder="请选择"></info-picker>
		</view>
		<view class="block">
			<info-input title="原价" :value="originalPrice" @onInputConfirm="onInputConfirm($event,'originalPrice')" type="digit" placeholder="请填写原价（元）"></info-input>
			<info-input title="现价/优惠价" :value="price" @onInputConfirm="onInputConfirm($event,'price')" type="digit" placeholder="请填写现价/优惠价（元）"></info-input>
		</view>
		<info-textarea v-if="create" title="培训简介" :value="intro" @onTextAreaConfirm="onTextAreaConfirm" required placeholder="请输入培训简介"></info-textarea>
		<info-richtext v-else title="培训简介（请在pc端排版编辑）" :value="$escape2Html(intro)"></info-richtext>
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
import userApi from "@/api/modules/user.js"
import trainApi from "@/api/modules/train.js"
import puApi from "@/api/modules/public.js"
import { list2FilterList,getAddressInfo } from "@/utils/utils.js"

export default {
	components: {
		infoPicker, infoInput, infoImage, infoTextarea, infoText,infoRichtext
	},
	data() {
		return {
			create: false,
			trainId: undefined,
			orgList: [],
			categoryList: [],
			trainTypeList: [{ name: '线下培训', value: 1 }, { name: '线上培训', value: 2 }, { name: '混合式培训', value: 3 }],
			visibleRangeList: [{ name: '仅自己', value: 1 }, { name: '本企业', value: 2 }, { name: '开放', value: 3 }],
			startDate: undefined,
			endDate: undefined,
			trainTitle: undefined,
			visibleRange: 3,
			visibleRangeText: "开放",
			intro: undefined,
			categoryId: undefined,
			categoryText: undefined,
			trainType: 1,
			trainTypeText: "线下培训",
			trainImg: undefined,
			tutor: undefined,
			tutorText: undefined,
			originalPrice: "0",//原价
			price: "0",
			province: undefined,
			city: undefined,
			district: undefined,
			street: undefined,
			address: undefined,
			lng: undefined,
			lat: undefined,
			orgId: undefined,
			orgName: undefined
		};
	},
	onLoad({ create, id }) {
		userApi.getQueryMyorgList().then(data => {
			list2FilterList(data, "orgName", "orgId");
			this.orgList = data;
		});
		if (create) {
			this.create = true;
			this.$updateNavbarTitle("创建培训");
				this.orgId=this.$store.state.userInfo.org.orgId;
				this.orgName=this.$store.state.userInfo.org.orgName;
		} else {
			this.$updateNavbarTitle("编辑培训");
			this.trainId = id;
			uni.showLoading();
			trainApi.getQueryTrainAdmin(id).then(data => {
				this.orgId = data.orgId;
				this.trainTitle = data.trainTitle;
				this.trainImg = data.trainImg || this.$store.state.defaultImg.train;
				this.categoryId = data.categoryId;
				this.categoryText = data.categoryTitle;
				this.visibleRange = data.visibleRange;
				this.trainType = data.trainType;
				this.startDate = this.$formatDate(data.startTime, "YYYY-MM-DD");
				this.endDate = this.$formatDate(data.endTime, "YYYY-MM-DD");
				this.intro = data.intro;
				this.province = data.province;
				this.city = data.city;
				this.district = data.district;
				this.street = data.street;
				this.address = (data.province || "") + (data.city || "") + (data.district || "") + (data.street || "");
				this.lng = data.lng;
				this.lat = data.lat;
				this.tutor = data.tutor;
				this.originalPrice = data.originalPrice;
				this.price = data.price;
				userApi.getQueryOrg(data.orgId).then(data => {
					if (data)
						this.orgName = data.orgName;
				});
				this.trainTypeText = this.trainTypeList.find(v => {
					return v.value == data.trainType;
				}).name;
				this.visibleRangeText = this.visibleRangeList.find(v => {
					return v.value == data.visibleRange;
				}).name;
				this.getCategoryList(data.orgId);
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
			this.trainImg = img;
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
				this.getCategoryList(choose.value);
			} else if (key == "categoryId") {
				this.categoryText = choose.text;
			} else if (key == "trainType") {
				this.trainTypeText = choose.text;
			} else if (key == "visibleRange") {
				this.visibleRangeText = choose.text;
			}
			this[key] = choose.value;
		},
		async getCategoryList(orgId) {
			puApi.getTrainCategoryListAdmin({ orgId }).then(data => {
				list2FilterList(data, "categoryTitle", "categoryId");
				this.categoryList = data;
			})
		},
		addressClick() {
			let self_ = this;
			uni.chooseLocation({
				success(res) {
					self_.lng = res.longitude;
					self_.lat = res.latitude;
					self_.address = res.address;
					userApi.getAddrByLngLat({
						lng:res.longitude,
						lat:res.latitude
					}).then((data=>{
						let address=getAddressInfo(data.address);
						self_.province=address.province;
						self_.city=address.city;
						self_.district=address.district;
						self_.street=address.street;
					}));
				}
			})
		},
		onToEdit() {
			if (this.$isHaveEmpty([this.orgId, this.trainTitle, this.address, this.startDate, this.endDate, this.intro])) {
				uni.showToast({
					title: "请填写完整信息", icon: "none"
				}); return;
			}
			let rqData = {
				orgId: this.orgId,
				trainTitle: this.trainTitle,
				trainImg: this.trainImg,
				categoryId: this.categoryId ? this.categoryId : '',
				visibleRange: this.visibleRange,
				trainType: this.trainType,
				startDate: this.startDate + " 00:00:00",
				endDate: this.endDate + " 23:59:59",
				intro: this.intro,
				province: this.province || "",
				city: this.city || "",
				district: this.district || "",
				street: this.street || "",
				lng: this.lng || "",
				lat: this.lat || "",
				tutor: this.tutor || "",
				originalPrice: this.originalPrice || "",
				price: this.price
			}
			let r_ = undefined;
			uni.showLoading();
			if (this.create) {
				r_ = trainApi.postCreateTrainAdmin(rqData);
			} else {
				rqData.trainId = this.trainId;
				r_ = trainApi.postUpdateTrainAdmin(rqData);
			}

			if (r_) {
				r_.then(data => {
					this.$toast(`${this.create ? "创建" : "修改"}成功`)
					setTimeout(() => {
						this._refreshPrePage();
						uni.navigateBack({ delta: 1 });
					}, 2000);
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
