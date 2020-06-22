<template>
	<view class="banner-edit page-full">
		<info-picker v-if="create" title="企业名称" :text="orgName" showSearch :dataList="orgList" placeholder="请选择企业" @onPickerChoose="onPickerChoose($event,'org')" required></info-picker>
		<info-input title="banner标题" :value="title" @onInputConfirm="onInputConfirm($event,'title')" placeholder="请输入标题名称" required></info-input>
		<view class="separate"> </view>
		<info-radio title="banner类型" :value="type" @onRadioChange="onRadioChange" :options="[{text:'电脑',value:1},{text:'手机',value:2}]" required></info-radio>
		<view class="separate"> </view>
		<info-image title="banner图" :value="getImageSrc()" :uploadType="2" path="/article/img" @imageChoose="imageChoose" placeholder="点击上传图片" required horizontal canUpload :width="203" :height="114"></info-image>
		<view class="separate">
			<text>*请上传尺寸为{{type==1?"1920px*400px":"750px*350px"}}的图片</text>
		</view>
		<info-input title="链接地址" :value="linkUrl" @onInputConfirm="onInputConfirm($event,'linkUrl')" placeholder="例：https://www.baidu.com/" required></info-input>
		<view class="separate">
			<text>*必须要加http或者https协议</text>
		</view>
		<view class="confirm-btn" @tap="onToEdit">
			<text>确定</text>
		</view>
	</view>
</template>

<script>
import { mapState } from "vuex"
import puApi from "@/api/modules/public.js"
import userApi from "@/api/modules/user.js"
import { list2FilterList } from "@/utils/utils.js"
import infoInput from "@/components/infoInput.vue"
import infoRadio from "@/components/infoRadio.vue"
import infoImage from "@/components/infoImage.vue"
import infoPicker from "@/components/infoPicker.vue"

export default {
	components: {
		infoInput, infoImage, infoRadio, infoPicker
	},
	computed: {
		...mapState(["configData"])
	},
	data() {
		return {
			orgList: [],
			orgId: undefined,
			orgName: undefined,
			bannerId: undefined,
			title: undefined,
			type: 1,
			img: undefined,
			linkUrl: undefined,
			create: false//创建or修改
		};
	},
	onLoad({ banner, create }) {
		if (create) { this.create = true; this.getOrgList(); }
		this.$updateNavbarTitle(create ? "创建banner" : "编辑banner");
		if (!this.create) {
			banner = JSON.parse(banner);
			this.orgId = banner.orgId;
			this.title = banner.title;
			this.type = banner.type;
			this.img = banner.img;
			this.linkUrl = banner.linkUrl;
			this.bannerId = banner.bannerId;
		}else{
			this.orgId=this.$store.state.userInfo.org.orgId;
			this.orgName=this.$store.state.userInfo.org.orgName;
		}
	},
	methods: {
		async getOrgList() {
			userApi.getQueryMyorgList().then(data => {
				list2FilterList(data, "orgName", "orgId")
				this.orgList = data;
			});
		},
		getImageSrc() {
			if (this.img)
				return this.configData.imgDomain + this.img + this.$imgSize.width224;
			return undefined;
		},
		onToEdit() {
			if (!this.title || !this.img || !this.linkUrl) {
				uni.showToast({
					icon: "none",
					title: "请填写完成信息"
				});
				return;
			}

			let rqData = {
				title: this.title,
				type: this.type,
				img: this.img,
				linkUrl: this.linkUrl,
				orgId: this.orgId
			}
			let r_ = undefined;
			if (this.create)
				r_ = puApi.postCreateBanner(rqData);
			else {
				rqData.bannerId = this.bannerId;
				r_ = puApi.postUpdateBanner(rqData);
			}
			if (r_) {
				r_.then(data => {
					this.$toast(this.create ? "创建成功" : "修改成功");
					setTimeout(() => {
						this._refreshPrePage();
						uni.navigateBack({ delta: 1 });
					}, 2000);
				}).catch(err => {
					uni.showToast({
						icon: "none",
						title: err
					})
				})
			}
		},
		onPickerChoose(choose) {
			this.orgId = choose.value;
			this.orgName = choose.text;
		},
		onRadioChange(type) {
			this.type = type;
		},
		onInputConfirm(val, key) {
			this[key] = val;
		},
		imageChoose(value) {
			this.img = value;
		}
	}
}
</script>

<style lang="scss" scoped>
	.separate {
	  min-height: 20upx;
	  color: #fc703e;
	  font-size: $font-size-24;
	  text {
	    display: block;
	    margin: 18upx 27upx 27upx;
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
	  margin: 40upx auto;
	}
</style>
