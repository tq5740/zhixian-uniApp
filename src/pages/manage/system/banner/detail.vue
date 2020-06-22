<template>
	<view class="banner-detail page-full">
		<view class="banner-image">
			<image :src="bannerImg"></image>
		</view>
		<info-input title="banner标题" :value="title"></info-input>
		<info-input title="banner类型" :value="type"></info-input>
		<info-input title="链接地址" :value="link"></info-input>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	import infoInput from "@/components/infoInput.vue"
	export default {
		components: {
			infoInput
		},
		computed:{
			...mapState(["configData"])
		},
		data() {
			return {
				bannerImg:undefined,
				title:undefined,
				type:undefined,
				link:undefined
			}
		},
		onLoad({banner}) {
			banner=JSON.parse(banner);
			this.$updateNavbarTitle(banner.title);
			this.bannerImg=this.configData.imgDomain+banner.img+this.$imgSize.width800;
			this.title=banner.title;
			this.type=banner.type==1?'电脑':'手机';
			this.link=banner.linkUrl;
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.banner-image{
	width: 100%;
	height: 300upx;
	> image{width: 100%;height: 100%;}
}
</style>
