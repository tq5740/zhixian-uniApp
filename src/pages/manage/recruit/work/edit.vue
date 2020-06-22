<template>
	<view class="work-edit page-full">
		<view class="infolist">
			<template v-if="create">
				<info-picker title="企业名称" :text="orgName" showSearch @onPickerChoose="onPickerChoose($event,'orgId')" :dataList="orgList" placeholder="请选择" required></info-picker>
			</template>

			<template v-else>
				<info-text title="企业名称" required  :value="orgName"></info-text>
			</template>
			<info-input title="职位名称" :value="workTitle" @onInputConfirm="onInputConfirm($event,'workTitle')" placeholder="请填写职位名称" required></info-input>
			<info-picker title="工作性质" :text="workNatureText" @onPickerChoose="onPickerChoose($event,'workNature')" mode="selector" :dataList="workNatureList" placeholder="请选择" required></info-picker>
			<info-picker title="职能名称" :text="workCategoryText" @onPickerChoose="onPickerChoose($event,'workCategory')" showChoose :dataList="workCategoryList" placeholder="请选择"></info-picker>
			<view class="separate"></view>
			<info-picker title="学历要求" :text="educationText" @onPickerChoose="onPickerChoose($event,'education')" mode="selector" :dataList="educationList" placeholder="请选择" required></info-picker>
			<info-picker title="经验要求" :text="experienceText" @onPickerChoose="onPickerChoose($event,'experience')" mode="selector" :dataList="experienceList" placeholder="请选择" required></info-picker>
			<view class="separate"></view>
			<info-input title="招聘人数" :value="recruitNumber" @onInputConfirm="onInputConfirm($event,'recruitNumber')" type="number" placeholder="请填写招聘人数(不少于1人)" required></info-input>
			<info-picker title="薪资类型" :text="salaryTypeText" @onPickerChoose="onPickerChoose($event,'salaryType')" mode="selector" :dataList="salaryTypeList" placeholder="请选择" required></info-picker>
			<view class="info-item">
				<view class="info-item-body van-hairline--bottom">
					<view class="info-item-title">
						<text>薪资范围</text><text class="required">*</text>
					</view>
					<view class="info-item-conten" v-if="salaryType == 2">
						<input type="number" v-model="lowSalary" placeholder="最低薪资" placeholder-class="input-placeholder">
						<text class="unit input-placeholder">元</text>
						<text class="short-bar input-placeholder">-</text>
						<input type="number" v-model="highSalary" placeholder="最高薪资" placeholder-class="input-placeholder">
						<text class="unit input-placeholder">元</text>
					</view>

					<view class="info-item-conten" v-else>
						<input class="low-salary-input" type="number" v-model="lowSalary" placeholder="输入日薪" placeholder-class="input-placeholder">
						<text class="input-placeholder">元/日</text>
					</view>
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-body van-hairline--bottom">
					<view class="info-item-title">
						<text>福利待遇</text>
					</view>
					<view class="info-item-conten info-item-conten-type-picker" @tap="showFlag=1">
						<text :class="{'input-placeholder':!haveWelfareChoose}">{{welfare.length==0?'请选择':`已选择${welfare.length}项`}}</text>
						<text class="iconfont icongengduo input-placeholder"></text>
					</view>
				</view>
				<view v-if="showFlag==1" class="picker-body">
					<view class="mark" @tap="showFlag=-1"></view>
					<view class="picker-content">
						<view class="top-btn van-hairline--bottom">
							<text @tap="onCancel" class="btn top-btn-cancle">取消</text>
							<text @tap="onPickerConfirm('welfare')" class="btn top-btn-confirm">确定</text>
						</view>
						<view class="data-list">
							<view v-for="(v,i) of welfareList" :key="i" class="data-item" @tap="onDataItemClick(v)" :class="{'data-item-choose':v.choose}">
								<text>{{v.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-body van-hairline--bottom">
					<view class="info-item-title">
						<text>工作地点</text><text class="required">*</text>
					</view>
					<view class="info-item-conten info-item-conten-type-picker" @tap="onAddressClick">
						<text :class="{'input-placeholder':!haveAddressChoose}">{{addressId.length==0?'请选择':`已选择${addressId.length}处地址`}}</text>
						<text class="iconfont icongengduo input-placeholder"></text>
					</view>
				</view>
				<view v-show="showFlag==2" class="picker-body">
					<view class="mark" @tap="showFlag=-1"></view>
					<view class="mul-picker-content">
						<view class="top-btn van-hairline--bottom">
							<text @tap="onCancel" class="btn top-btn-cancle">取消</text>
							<text @tap="onPickerConfirm('address')" class="btn top-btn-confirm">确定</text>
						</view>
						<view class="data-list">
							<view v-for="(v,i) of addressList" :key="i" class="data-item van-hairline--bottom" :class="{'data-item-choose':v.choose}" @tap="onMulDataItemClick(v)">
								<text>{{v.name}}</text>
								<text class="iconfont icongou" :class="{'data-item-choose-icon':v.choose}"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="separate"></view>
			<template v-if="create">
				<info-textarea title="职位描述" :value="intro" @onTextAreaConfirm="onTextAreaConfirm" placeholder="请输入职位描述" required></info-textarea>
			</template>
			<template v-else>
				<info-richtext title="职位描述" :value="$escape2Html(intro)" @onTextAreaConfirm="onTextAreaConfirm" placeholder="职位描述(请在pc端排版编辑)" required></info-richtext>
			</template>
		</view>
		<view class="remark">
			<text>*发布职位即表示您已同意遵守 </text>
			<text class="rule">《职位信息发布规则》</text>
			<text>，所有职位均有专人审核，禁止发布虚假招聘信息，一经发现立即永久禁用帐号。</text>
		</view>
		<view class="confirm-btn" @tap="onToConfirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
import infoInput from '@/components/infoInput.vue'
import infoPicker from '@/components/infoPicker.vue'
import infoTextarea from '@/components/infoTextarea.vue'
import infoText from '@/components/infoText'
import infoRichtext from "@/components/infoRichtext.vue"
import { getWorkNature, getWorkEducation, getWorkExperience, list2FilterList } from "@/utils/utils.js";
import userApi from "@/api/modules/user.js"
import workApi from "@/api/modules/work.js"

export default {
	components: {
		infoInput, infoPicker, infoTextarea, infoText,infoRichtext
	},
	data() {
		let educationList = [];
		getWorkEducation().forEach((v, i) => {
			educationList.push({ name: v, value: i });
		});
		let experienceList = [];
		getWorkExperience().forEach((v, i) => {
			experienceList.push({ name: v, value: i });
		});
		let welfareList = [
			{ name: "五险一金", value: "五险一金", choose: false },
			{ name: "六险一金", value: "六险一金", choose: false },
			{ name: "免费班车", value: "免费班车", choose: false },
			{ name: "专业培训", value: "专业培训", choose: false },
			{ name: "绩效奖金", value: "绩效奖金", choose: false },
			{ name: "年终奖金", value: "年终奖金", choose: false },
			{ name: "定期体检", value: "定期体检", choose: false },
			{ name: "餐饮补贴", value: "餐饮补贴", choose: false },
			{ name: "节日福利", value: "节日福利", choose: false },
			{ name: "生日福利", value: "生日福利", choose: false },
			{ name: "员工旅游", value: "员工旅游", choose: false },
			{ name: "股票期权", value: "股票期权", choose: false },
			{ name: "交通补贴", value: "交通补贴", choose: false },
			{ name: "通讯补贴", value: "通讯补贴", choose: false },
		]
		return {
			create: false,
			workId: undefined,
			workTitle: undefined,
			workNature: undefined,//工作性质
			workNatureText: undefined,
			workCategory: undefined,//工作职能ID
			workCategoryText: undefined,
			education: 0,//学历要求
			educationText: "不限",
			experience: 0,//经验要求
			experienceText: "不限",
			recruitNumber: undefined,
			salaryType: 2,
			salaryTypeText: "月薪",
			lowSalary: undefined,//最低薪资
			highSalary: undefined,//最高薪资
			welfare: [],
			intro: undefined,
			addressId: [],
			orgId: undefined,
			orgName: undefined,
			orgList: [],
			workCategoryList: [],
			addressList: [],
			workNatureList: getWorkNature(),
			educationList: educationList,
			experienceList: experienceList,
			salaryTypeList: [{ name: "日薪", value: 1 }, { name: "月薪", value: 2 }],
			welfareList: welfareList,
			showFlag: -1
		}
	},
	computed: {
		haveWelfareChoose() {
			return this.welfare.length > 0;
		},
		haveAddressChoose() {
			return this.addressId.length > 0;
		}
	},
	onLoad({ create, id }) {
		userApi.getQueryMyorgList().then(data => {
			list2FilterList(data, 'orgName', 'orgId');
			this.orgList = data;
		});
		workApi.getWorkCategoryTree().then(data => {
			list2FilterList(data, 'workCategoryTitle', 'workCategoryId');
			this.workCategoryList = data;
		});
		if (create) {
			this.create = true;
			this.onPickerChoose({ text: this.$store.state.userInfo.org.orgName, value: this.$store.state.userInfo.org.orgId }, "orgId");
			this.$updateNavbarTitle("创建职位");
		} else {
			this.$updateNavbarTitle("编辑职位");
			this.workId = id;
			uni.showLoading();
			workApi.getQueryWorkAdmin(id).then(data => {
				this.workTitle = data.workTitle;
				this.workNature = data.workNature;
				this.workNatureText = this.workNatureList.find(v => {
					return v.value == data.workNature;
				}).name;
				this.workCategory = data.workCategory;
				this.workCategoryText = data.workCategoryTitle;
				this.education = data.education;
				this.educationText = this.educationList.find(v => {
					return v.value == data.education;
				}).name;
				this.experience = data.experience;
				this.experienceText = this.experienceList.find(v => {
					return v.value == data.experience;
				}).name;
				this.recruitNumber = data.recruitNumber;
				this.salaryType = data.salaryType;
				this.salaryTypeText = this.salaryTypeList.find(v => {
					return v.value == data.salaryType;
				}).name;
				this.lowSalary = data.lowSalary;
				this.highSalary = data.highSalary;
				this.welfare = JSON.parse(data.welfare) || [];
				this.welfare.forEach(w => {
					this.welfareList.find(v => {
						return v.name == w;
					}).choose = true;
				})
				this.intro = data.intro;
				data.addresses.forEach(v => {
					this.addressId.push(v.addressId);
				});
				this.orgId = data.orgId;
				this.orgName = data.org.orgName;
				workApi.getAddressListAdmin({ pageSize: 99, pageNum: 1, orgId: data.orgId }).then(data => {
					if (data.result.length == 0) {
						return;
					}
					data.result.forEach(d => {
						d.value = d.addressId;
						d.name = (d.province || "") + (d.city || "") + (d.district || "") + (d.street || "") + (d.doorNumber || "");
						let index = this.addressId.findIndex(v => {
							return d.addressId == v;
						});
						if (index != -1) d.choose = true;
					});
					this.addressList = data.result;
				});
				uni.hideLoading();
			})
		}
	},
	methods: {
		onToConfirm() {
			if (this.salaryType == 2) {
				if (!this.lowSalary || !this.highSalary) {
					uni.showToast({
						title: "薪资填写不完整",
						icon: "none"
					});
					return;
				}
				if (Number(this.lowSalary) > Number(this.highSalary)) {
					uni.showToast({
						title: "最高薪资需要大于最低薪资",
						icon: "none"
					});
					return;
				}
			}

			if (this.$isHaveEmpty([this.workTitle, this.workNature, this.education, this.experience, this.recruitNumber, this.salaryType, this.lowSalary, this.intro, this.orgId])
				|| this.addressId.length == 0) {
				uni.showToast({
					title: "请填写完整信息",
					icon: "none"
				});
				return;
			}
			if (this.recruitNumber < 1) {
				uni.showToast({
					title: "招聘人数不得少于1人",
					icon: "none"
				});
				return;
			}
			if (this.lowSalary < 0) {
				uni.showToast({
					title: "请填写正确的薪资范围",
					icon: "none"
				});
				return;
			}
			let rqData = {
				workTitle: this.workTitle,
				workNature: this.workNature,
				workCategory: this.workCategory,
				education: this.education,
				experience: this.experience,
				recruitNumber: this.recruitNumber,
				salaryType: this.salaryType,
				lowSalary: this.lowSalary,
				highSalary: this.highSalary ? this.highSalary : '',
				welfare: JSON.stringify(this.welfare),
				intro: this.intro,
				addressId: JSON.stringify(this.addressId),
				orgId: this.orgId
			}
			let r_ = undefined;
			if (this.create) {
				r_ = workApi.postCreateWorkAdmin(rqData);
				rqData.state = 4;
			}
			else {
				rqData.workId = this.workId;
				r_ = workApi.postUpdateWorkAdmin(rqData);
			}
			if (r_) {
				r_.then(data => {
					this.$toast("创建成功！");
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
		onAddressClick() {
			if (!this.orgId)
				uni.showToast({
					title: "请选择企业",
					icon: "none"
				});
			else
				this.showFlag = 2;
		},
		onPickerChoose(choose, key) {
			if (key == "workNature") {
				this.workNatureText = choose.text;
			} else if (key == "education") {
				this.educationText = choose.text;
			} else if (key == "experience") {
				this.experienceText = choose.text;
			} else if (key == "salaryType") {
				this.salaryTypeText = choose.text;
			} else if (key == "orgId") {
				this.orgName = choose.text;
				this.addressText = null,//undefined小程序不更新视图
					this.addressId = this.addressList = [];
				// 获取地址列表
				workApi.getAddressListAdmin({ pageSize: 99, pageNum: 1, orgId: choose.value }).then(data => {
					if (data.result.length == 0) {
						uni.showToast({
							title: "该企业暂无工作地址",
							icon: "none"
						});
						return;
					}
					data.result.forEach(d => {
						d.value = d.addressId;
						d.name = (d.province || "") + (d.city || "") + (d.district || "") + (d.street || "") + (d.doorNumber || "");
					});
					this.$nextTick(function () {
						this.addressList = data.result;
					})
				})
			} else if (key == "workCategory") {
				this.workCategoryText = choose.text;
			} else if (key == "addressId") {
				this.addressText = choose.text;
			}
			this[key] = choose.value;
		},
		onTextAreaConfirm(val) {
			this.intro = val;
		},
		onInputConfirm(val, key) {
			this[key] = val;
		},
		onMulDataItemClick(v) {
			if (v.choose) this.$set(v, "choose", false);
			else this.$set(v, "choose", true);
		},
		onDataItemClick(item) {
			if (item.choose) {
				item.choose = false;
			}
			else {
				let num = 0;
				this.welfareList.forEach(v => {
					if (v.choose) {
						++num;
					}
				});
				if (num >= 8) return;
				item.choose = true;
			}
		},
		onCancel() { this.showFlag = -1; },
		onPickerConfirm(type) {
			this.$set(this, "showFlag", -1);
			if ("welfare" == type) {
				this.welfare = [];
				this.welfareList.forEach(v => {
					if (v.choose) {
						this.welfare.push(v.value);
					}
				});
			} else if ("address" == type) {
				this.addressId = [];
				this.addressList.forEach(v => {
					if (v.choose) {
						this.addressId.push(v.value);
					}
				});
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.work-edit{
		padding-bottom: 1upx;}
	.mark {
	  z-index: 10;
	  position: fixed;
	}
	.selector-picker {
	  z-index: 10;
	  position: fixed;
	  height: 680upx;
	  width: 100%;
	  bottom: 0;
	  left: 0;
	  background: #ffffff;
	  &-indicator {
	    // height: 68upx;
	  }
	  &-item {
	    // height: 68upx;
	    // line-height: 68upx;
	    // text-align: center;
	    // font-size:$font-size-32;
	    background: #344565;
	  }
	  picker-view {
	    height: 100%;
	    width: 100%;
	  }
	  > .top-btn {
	    position: relative;
	  }
	}

	.info-item {
	  background: #ffffff;
	  &-body {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    position: relative;
	    margin-left: 30upx;
	    height: 100upx;
	  }
	  &-title {
	    font-size: 30upx;
	    color: #6d9985;
	  }
	  .required {
	    color: #fc703e;
	  }
	  &-conten {
	    width: 490upx;
	    display: flex;
	    align-items: center;
	    font-size: $font-size-30;
	  }
	  &-conten-type-picker {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    padding-right: 30upx;
	    box-sizing: border-box;
	  }
	  .input-placeholder {
	    color: $color-999;
	  }
	  .unit {
	    $h: 56upx;
	    display: inline-block;
	    width: 60upx;
	    height: $h;
	    line-height: $h;
	    text-align: center;
	    background: $color-f2;
	    margin: 0upx 14upx;
	  }
	  input {
	    width: 117upx;
	    font-size: $font-size-30;
	  }
	  .low-salary-input {
	    width: 384upx;
	    font-size: $font-size-30;
	  }
	  .short-bar {
	    margin: 0px 31upx 0px 17upx;
	  }
	}
	.mark {
	  position: fixed;
	  z-index: 9;
	}
	.top-btn {
	  $h: 88upx;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  position: relative;
	  font-size: $font-size-32;
	  .btn {
	    height: $h;
	    line-height: $h;
	    margin: 0px 31upx;
	  }
	  &-confirm {
	    color: $color-main;
	  }
	}
	.picker-content {
	  position: fixed;
	  z-index: 10;
	  background: #ffffff;
	  width: 100%;
	  height: 680upx;
	  bottom: 0px;
	  .data-list {
	    height: calc(100% - 88upx);
	    display: flex;
	    align-items: center;
	    flex-wrap: wrap;
	    overflow: scroll;
	    padding: 20upx 15upx;
	    box-sizing: border-box;
	    .data-item {
	      $h: 60upx;
	      font-size: $font-size-28;
	      width: 208upx;
	      height: $h;
	      line-height: $h;
	      text-align: center;
	      border-radius: 8upx;
	      border: 1upx solid;
	      margin: 20upx 15upx;
	      &-choose {
	        border-color: $color-main;
	        color: $color-main;
	      }
	    }
	  }
	}
	.mul-picker-content {
	  position: fixed;
	  z-index: 10;
	  background: #ffffff;
	  width: 100%;
	  height: 680upx;
	  bottom: 0px;
	  .data-list {
	    height: calc(100% - 88upx);
	    overflow: scroll;
	    padding: 20upx 15upx;
	    box-sizing: border-box;
	    .data-item {
	      display: flex;
	      align-items: center;
	      justify-content: space-between;
	      width: 100%;
	      box-sizing: border-box;
	      position: relative;
	      padding: 20upx 40upx;
	      font-size: $font-size-28;
	      .icongou {
	        display: none;
	      }
	      &-choose-icon {
	        display: inline-block !important;
	      }
	      &-choose {
	        color: $color-main;
	      }
	    }
	  }
	}
	.separate {
	  height: 20upx;
	}
	.remark {
	  font-size: $font-size-24;
	  padding: 40upx 20upx;
	  .rule {
	    color: $color-main;
	    text-decoration: underline;
	  }
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
	  margin: 0px auto 30upx;
	}
</style>
