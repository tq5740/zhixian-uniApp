<template>
	<view class="user-detail page-full">
		<view class="block">
			<info-image title="证件照" :width="120" horizontal></info-image>
		</view>
		<view class="block">
			<info-text title="用户姓名" :value="item.name"></info-text>
			<info-text title="手机号码" :value="item.phone"></info-text>
			<info-text title="身份证号" :value="item.idNumber"></info-text>
		</view>
		<view class="block">
			<info-text title="用户状态" :value="item.state|getState"></info-text>
			<info-text title="申请时间" :value="$formatDate(item.applyTime,'YYYY-MM-DD hh:mm:ss')"></info-text>
		</view>
		<view class="block">
			<info-text title="学习结果" :value='item.studyResult?"合格":"不合格"'></info-text>
			<info-text title="是否参加考试" :value='item.isTest?"是":"否"'></info-text>
			<info-text title="考试结果" :value='$isEmpty(item.testResult)?"-":item.testResult?"合格":"不合格"'></info-text>
			<info-text title="考勤结果" :value='$isEmpty(item.attendanceResult)?"-":item.testResult?"合格":"不合格"'></info-text>
		</view>
	</view>
</template>

<script>
	import infoText from "@/components/infoText.vue"
	import infoImage from "@/components/infoImage.vue"
	import userApi from "@/api/modules/user.js"
	import {getTrainClassUserState} from "@/utils/utils.js"
	const stateList=getTrainClassUserState();
	export default {
		components:{infoText,infoImage},
		data() {
			return {
				item:{},
				orgName:undefined
			};
		},
		filters:{
			getState(val){
				if(val==undefined)return "-";
				return stateList.find(v=>{
					return v.id==val;
				}).text;
			},
		},
		onLoad({user}) {
			this.$updateNavbarTitle("学员信息");
			this.item=JSON.parse(user);
		}
	}
</script>

<style lang="scss">
	.block{margin-bottom: 20upx;}
</style>
