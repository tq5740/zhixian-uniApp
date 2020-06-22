<template>
	<div class="placeholders">
		<div class="s1"></div>
		<div class="s2"></div>
		<div class="s3"></div>
		<div class="s4"></div>
		<div class="s5 van-hairline--bottom"></div>
		<div class="s6"></div>
		<div class="s7"></div>
		<div class="s8"></div>
		<div class="s9"></div>
		<div class="s10"></div>
		<div class="s11"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	computed: {
		
	},
	methods: {
		
	}
}
</script>
<style lang="scss" scoped>
	.placeholders {
		padding: 50upx 30upx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 60;
		background-color: #ffffff!important;
		height: 100%;
		width: 100%;
		div {
			background-color: #F2F3F7;
		}
		.s1 {
			width: 100%;
			height: 52upx;
		}
		.s2 {
			width: 388upx;
			height: 52upx;
			margin-top: 20upx;
			margin-bottom: 30upx;
		}
		.s3, .s4 {
			float: left;
			width: 135upx;
			height: 35upx;
			margin-right: 20upx;
			
		}
		.s5 {
			overflow: auto;
			height: 57upx;
			width: 100%;
			background-color: #ffffff;
		}
		.s6 {
			width: 100%;
			height: 388upx;
			margin-top: 55upx;
		}
		.s7 {
			width: 623upx;
			height: 40upx;
			float: right;
			margin-top: 50upx;
		}
		.s8 {
			width: 100%;
			height: 40upx;
			margin-top: 120upx;
		}
		.s9 {
			width: 623upx;
			height: 40upx;
			margin-top: 30upx;
		}
		.s10 {
			height: 40upx;
			width: 100%;
			margin-top: 30upx;
		}
		.s11 {
			height: 40upx;
			width: 100%;
			margin-top: 30upx;
		}
	}
</style>

