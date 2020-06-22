<template>
	<view class="address-edit">
		<view class="info-list">
			<info-picker title="企业名称" :text="orgName" :dataList="orgList" showSearch placeholder="请选择企业" @onPickerChoose="onPickerChoose($event,'org')" required></info-picker>
			<info-input title="联系人" :value="contact" @onInputConfirm="onInputConfirm($event,'contact')" placeholder="请填写联系人" required></info-input>
			<info-input title="联系电话" :value="tel" @onInputConfirm="onInputConfirm($event,'tel')" placeholder="请填写联系电话" required></info-input>
			<view class="separate"></view>
			<info-input title="地址标题" :value="addrTitle" placeholder="请输入地址标题" @onInputConfirm="onInputConfirm($event,'addrTitle')"></info-input>
			<info-picker title="地址" :text="area" placeholder="请选择省市区" @onPickerChoose="onPickerChoose($event,'area')" required mode="region"></info-picker>
			<info-input title="街道地址" :value="street" @onInputConfirm="onInputConfirm($event,'street')" placeholder="请填写街道地址" required></info-input>
			<info-input title="门牌号" :value="doorNumber" @onInputConfirm="onInputConfirm($event,'doorNumber')" placeholder="请填写门牌号"></info-input>
		</view>
		<view class="confirm-btn" @tap="onToCrate">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
import workApi from "@/api/modules/work.js"
import userApi from "@/api/modules/user.js"
import { list2FilterList } from "@/utils/utils.js"
import infoInput from "../../../../components/infoInput.vue"
import infoPicker from "../../../../components/infoPicker.vue"

export default {
	components: {
		infoInput, infoPicker
	},
	data() {
		return {
			orgList: [],
			orgId: undefined,
			orgName: undefined,
			area: "",
			areaList: [],
			addrTitle: "",
			contact: "",
			tel: "",
			street: "",
			doorNumber: "",
			addressId: undefined
		}
	},
	onLoad({ address }) {
		this.$updateNavbarTitle("编辑地址");
		let a = JSON.parse(address);
		this.orgId = a.orgId;
		this.orgName = a.orgName;
		this.getOrgList();
		this.addrTitle = a.title;
		this.addressId = a.addressId;
		this.contact = a.contact;
		this.tel = a.tel;
		this.street = a.street;
		this.doorNumber = a.doorNumber || "";
		this.area = a.province + a.city + a.district;
		this.areaList.splice(-1, 0, a.province, a.city, a.district);
	},
	methods: {
		async getOrgList() {
			userApi.getQueryMyorgList().then(data => {
				list2FilterList(data, "orgName", "orgId")
				this.orgList = data;
				if (!this.orgName) {
					let org = data.find(v => {
						return v.orgId == this.orgId;
					});
					if (org) {
						this.orgName = org.orgName;
					}
				}
			});
		},
		onToCrate() {
			if (!this.contact || !this.tel || !this.street || !this.orgId || this.areaList.length < 1) {
				uni.showToast({
					title: "请填写完整信息",
					icon: "none"
				});
				return;
			}
			if (!this.$mobileReg(this.tel)) {
				uni.showToast({
					title: "请填写正确的手机号",
					icon: "none"
				});
				return;
			}
			uni.showLoading({
				title: "请稍等"
			});
			let rqData = {
				addressId: this.addressId,
				contact: this.contact,
				tel: this.tel,
				province: this.areaList[0],
				city: this.areaList[1],
				district: this.areaList[2],
				street: this.street,
				doorNumber: this.doorNumber,
				orgId: this.orgId
			}
			workApi.postUpdateAddressAdmin(rqData).then(data => {
				this.$toast("编辑成功！");
				setTimeout(() => {
					this._refreshPrePage();
					uni.navigateBack({ delta: 1 });
				}, 2000);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					icon: "none"
				});
			})
		},
		onPickerChoose(choose, flag) {
			if (flag == "org") {
				this.orgName = choose.text;
				this.orgId = choose.value;
			} else if (flag == "area") {
				let text_ = "";
				this.areaList = choose.value;
				choose.value.forEach(v => {
					text_ = text_ + v;
				});
				this.area = text_;
			}
		},
		onInputConfirm(value, key) {
			this[key] = value;
		}
	}
}
</script>

<style lang="scss" scoped>
	.address-edit {
	  height: 100%;
	  background: $color-f2;
	}
	.separate {
	  height: 20upx;
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
