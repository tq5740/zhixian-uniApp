<template>
	<view class="booking-detail page-full">
		<view class="agree-on">
			<view class="title van-hairline--bottom">
				<text>约定信息（可修改）</text>
			</view>
			<view class="content">
				<view class="item van-hairline--bottom">
					<text class="item-title">{{type == 1 ? "面试时间" : "报到时间"}}</text>
					<view class="item-content">
						<rui-date-picker fields="minute" :text="dateText" :value="$formatDate(Date.now(),'YYYY-MM-DD hh:mm')" start="1997-12-30 23:59" end="3030-12-30 23:59" @change="timeChange"></rui-date-picker>
					</view>
					<text class="iconfont icongengduo"></text>
				</view>
				<view class="item van-hairline--bottom" @tap="showFlag=true">
					<text class="item-title">{{type == 1 ? "面试地点" : "报到地点"}}</text>
					<view class="item-content">
						<text class="address-text">{{addressText}}</text>
						<view v-show="showFlag">
							<view class="mark" @click.stop="onCancel"></view>
							<view class="mul-picker-content">
								<view class="top-btn van-hairline--bottom">
									<text @click.stop="onCancel" class="btn top-btn-cancle">取消</text>
									<text @click.stop="onPickerConfirm" class="btn top-btn-confirm">确定</text>
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
					<text class="iconfont icongengduo"></text>
				</view>
				<view class="item van-hairline--bottom" v-if="type == 2">
					<text class="item-title">入职备注</text>
					<view class="item-content">
						<input v-model="content" />
					</view>
				</view>
			</view>
		</view>
		<div class="userDetails">
			<div class="user_info scale-1px-bottom">
				<div class="padding_b_20 user_info_title">
					<div class="margin_l_20 text_title">
						<span class="icon">
							<i class="iconfont zx-svg edit_icon icon-jibenxinxi iconjibenxinxi"></i>
						</span>
						<span class="title">基本信息</span>
					</div>
				</div>
			</div>
			<div class="user_info">
				<div class="user_info card">
					<div class="list">
						<div class="list_box">
							<div class="con_img">
								<img class="con_img" :src="imgSrcDomain+userData.photo" v-if="userData.photo">
								<img class="con_img" src="/static/img/user/photo.png" v-else>
							</div>
							<div class="con_info">
								<div class="con_text1">
									<div class="con_text1_name">{{userData.userName}}</div>
									<div class="con_text1_sex">
										<i class="iconfont zx-svg con_text1_sex icon-nan- iconnan-" v-if="userData.sex == 1"></i>
										<i class="iconfont zx-svg con_text1_sex icon-nv- iconnv-" v-if="userData.sex == 2"></i>
									</div>
								</div>
								<div class="con_text1 con_text2">
									<div class="con_text2_tag" style="color: #000">{{isBirthDate}}岁 | {{userData.education}} | {{isStartWorkYear}}年经验</div>
								</div>
							</div>
						</div>
					</div>

					<div class="user_info_span" :class="userData.tag ? 'scale-1px-bottom' : ''">
						<div class="div">
							<span class="tips1">联系电话</span>
							<span class="spanborder" @click="toPhone(userData.phone)">{{userData.phone}}</span>
						</div>

						<div class="div">
							<span class="tips1">所在地区</span>
							<span class="tips2" v-if="userData.city == '市辖区'">{{userData.province}} - {{userData.district}}</span>
							<span class="tips2" v-else>{{userData.city}} - {{userData.district}}</span>
						</div>

					</div>
				</div>
				<div class="user_tag">
					{{userData.tag}}
				</div>
			</div>

			<div class="user_info margin_t_20" v-if="intention">
				<div class="padding_b_20 user_info_title scale-1px-bottom">
					<div class="margin_l_20 text_title">
						<span class="icon">
							<i class="iconfont zx-svg edit_icon icon-qiuzhiyixiang iconqiuzhiyixiang"></i>
						</span>
						<span class="title">求职意向</span>
					</div>
				</div>
				<div class="user_info_span li-sp">
					<div class="div" v-if="intention.workTitleArr.length">
						<span class="tips1">工作职位</span>
						<span class="tips2" v-for="(item, index) in intention.workTitleArr" :key="index">{{item}}；</span>
					</div>

					<div class="div" v-if="intention.salary">
						<span class="tips1">期望薪资</span>
						<span class="tips2">{{intention.salary}}元</span>
					</div>

					<div class="div" v-if="intention.availableTime && intention.availableTime > -1">
						<span class="tips1">到岗时间</span>
						<span class="tips2">{{pickerColumnsArr[2][intention.availableTime-1]}}</span>
					</div>

					<div class="div" v-if="intention.workNature && intention.workNature > -1">
						<span class="tips1">工作性质</span>
						<span class="tips2">{{pickerColumnsArr[4][intention.workNature]}}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="buttom-btn" @click="clickBooking">
			确认
		</div>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>

	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import workApi from "@/api/modules/work.js"
import Work from "../../../../api/modules/work";
import User from "../../../../api/modules/user";
export default {
	components: {
		ruiDatePicker
	},
	data() {
		return {
			showFlag: false,
			addressList: [],
			address: [],//已选择地址
			orgId: undefined,
			pickerColumnsArr: [
				["男", "女"],
				["在职", "离职", "在校大学生"],
				["随时", "一周内", "一个月内", "待定"],
				["初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
				["全部", "全职", "兼职", "实习"],
				["月薪", "年薪", "日薪"]
			],
			userData: {},
			loading: false,
			intention: null,

			notesStateNumber: 0,
			userId: "",
			workId: "",
			bookingId: "",
			phone: "",
			type: "",
			time: "",
			content: "",
			dateText: "请选择时间",
			addressText: "选择地址"
		}
	},
	onLoad(options) {
		this.orgId = this.$store.state.userInfo.org.orgId;
		this.userId = options.userId;
		this.workId = options.workId;
		this.bookingId = options.bookingId;
		this.phone = options.phone;
		this.type = options.type;
		this.getAddressList();
		let data = {
			userId: options.userId
		};
		// 求职意向
		Work.getQueryIntention(data).then(res => {
			this.intention = res ? res : {};
			this.intention.workTitleArr = res ? JSON.parse(res.workTitle) : [];
		})
		// 用户档案
		User.getUserArchives(data).then(res => {
			this.userData = res;
			this.userData.photo === null ? 0 : this.userData.photo;
			this.userData.education = this.pickerColumnsArr[3][this.userData.education - 1];
			this.userData.workState = this.pickerColumnsArr[1][this.userData.workState - 1];
			this.userData.availableTime = this.pickerColumnsArr[2][this.userData.availableTime - 1];
		})
	},
	computed: {
		imgSrcDomain() {
			return this.$store.state.configData.imgDomain;
		},
		isBirthDate() {
			return this.$getParseAge(this.userData.birthDate);
		},
		isStartWorkYear() {
			return this.$getParseExperience(this.userData.startWorkYear);
		},
		presentDate() {
			return this.$formatDate(new Date().getTime(), "YYYY-MM-DD");
		}
	},
	methods: {
		clickBooking() {
			if (!this.time) {
				this.$toast('请选择时间！')
				return;
			}
			if (this.address.length == 0) {
				this.$toast('请选择地址！')
				return;
			}
			if (this.type == 1) {
				this.$refs.msg.show("你确定要邀请面试吗?");
			} else {
				this.$refs.msg.show("你确定要邀请入职吗?");
			}
		},
		onMsgConfirm() {
			let data = {
				phone: this.phone,
				bookingId: this.bookingId,
				workId: this.workId,
				userId: this.userId,
				interviewTime: this.time,
				addressId: this.address[0].addressId,
				content: this.content,
				state: this.type == 1 ? "3" : "6"
			}
			if (this.type == 2) {
				data.content = this.content
			}
			Work.updateBooking(data).then(res => {
				this.$toast("简历已修改！");
				setTimeout(() => {
					uni.navigateBack({ delta: 2 });
				}, 2000);
			})
		},
		getAddressList() {
			workApi.getAddressListAdmin({ pageSize: 99, pageNum: 1, orgId: this.orgId }).then(data => {
				if (data.result.length == 0) {
					return;
				}
				data.result.forEach((d, i) => {
					d.value = d.addressId;
					d.name = (d.province || "") + (d.city || "") + (d.district || "") + (d.street || "") + (d.doorNumber || "");
				});
				this.addressList = data.result;
			});
		},
		onCancel() {
			this.showFlag = false;
		},
		onMulDataItemClick(v) {
			// 改为单选
			if (v.choose) return;
			this.addressList.forEach(vv => {
				if (vv.choose) {
					this.$set(vv, "choose", false);
				}
			});
			this.$set(v, "choose", true);
		},
		onPickerConfirm() {
			this.address = [];
			this.addressList.forEach(v => {
				if (v.choose) {
					this.address.push(v);
				}
			});
			this.addressText = this.address[0].name;
			this.onCancel();
		},
		timeChange(val) {
			this.dateText = "";
			this.time = val + ":00";
		}
	}
}
</script>

<style scoped lang="scss">
	.address-text {
	  display: inline-block;
	  width: 470upx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	.buttom-btn {
	  width: 100%;
	  height: 98upx;
	  text-align: center;
	  line-height: 98upx;
	  color: #fff;
	  background-color: #42b983;
	  position: fixed;
	  bottom: 0;
	}
	.page-full {
	  height: calc(100% - 280upx);
	}
	.agree-on {
	  $h: 90upx;
	  background: #ffffff;
	  .title {
	    height: $h;
	    line-height: $h;
	    font-size: $font-size-28;
	    color: #4c5e56;
	    font-weight: bold;
	    position: relative;
	    text {
	      margin-left: 30upx;
	    }
	  }
	  .content {
	    padding: 0upx 30upx;
	    .item {
	      height: $h;
	      line-height: $h;
	      font-size: $font-size-32;
	      display: flex;
	      position: relative;
	      &-title {
	        color: $color-999;
	      }
	      &-content {
	        flex-grow: 1;
	        margin-left: 47upx;
	        input {
	          height: 100%;
	        }
	      }
	      .icongengduo {
	        color: $color-999;
	        font-size: $font-size-28;
	      }
	    }
	  }
	}
	.mark {
	  z-index: 10;
	  position: fixed;
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
	.mul-picker-content {
	  position: fixed;
	  z-index: 10;
	  background: #ffffff;
	  width: 100%;
	  height: 680upx;
	  bottom: 0px;
	  left: 0;
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

	.popr {
	  position: fixed;
	  top: 0;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  background-color: rgba(0, 0, 0, 0.6);
	  .list {
	    position: fixed;
	    bottom: 0;
	    width: 100%;
	    background-color: #f2f2f2 !important;
	  }
	  .item {
	    display: inline-block;
	    height: 87upx;
	    line-height: 87upx;
	    text-align: center;
	    font-size: 32upx;
	    width: 100%;
	    background-color: #fff;
	  }
	  .cancel {
	    margin-top: 20upx;
	  }
	}
	.position-btn-bar {
	  width: 100%;
	  height: 98upx;
	  position: fixed;
	  bottom: 0;
	  background-color: #fff;
	  .icongoutong {
	    font-size: 48upx;
	  }
	  .position-btn-editor {
	    padding-top: 8upx;
	    float: left;
	    text-align: center;
	    width: 150upx;
	    height: 100%;
	    font-size: 24upx;
	    color: #42b983;
	  }
	  .position-btn-150 {
	    float: left;
	    text-align: center;
	    width: 300upx;
	    height: 100%;
	    line-height: 98upx;
	    font-size: 30upx;
	    color: #999999;
	    border-left: 1px solid #d8d8d8;
	  }
	  .position-btn-150baac {
	    float: left;
	    text-align: center;
	    width: 300upx;
	    height: 100%;
	    line-height: 98upx;
	    font-size: 30upx;
	    color: #999;
	    background-color: #f2f2f2;
	  }
	}
	.userDetails {
	  background-color: #f2f2f2;
	  min-height: 100%;
	  padding-bottom: 98upx;
	  .txtBr {
	    white-space: normal;
	    word-break: break-all;
	  }
	  .ellipsis {
	    display: inline-block;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	  }
	  /deep/ .van-switch--on {
	    background-color: #42b983;
	  }
	  font-size: 24upx;
	  .H30 {
	    height: 30upx;
	  }
	  .inline_block {
	    display: inline-block;
	  }
	  .black666 {
	    color: #666;
	  }
	  .flexNone {
	    display: none;
	  }
	  .bg {
	    background: #ccc !important;
	  }
	  .padding_b_20 {
	    padding-bottom: 20upx;
	  }
	  .padding_l_20 {
	    padding-left: 20upx;
	  }
	  .margin_t_20 {
	    margin-top: 20upx;
	  }
	  .margin_b_20 {
	    margin-bottom: 20upx;
	  }
	  .margin_l_20 {
	    margin-left: 20upx;
	  }
	  .margin_r_20 {
	    margin-right: 20upx;
	  }
	  .phone {
	    color: #000;
	  }
	  .con_text1_sex {
	    font-size: 24upx;
	    margin-left: 6upx;
	    img {
	      width: 100%;
	    }
	  }
	  .edit_icon {
	    font-size: 26upx;
	    position: relative;
	    display: inline-block;
	    margin-left: 6upx;
	  }
	  .user_tag {
	    background: #fff;
	    margin: 30upx;
	    color: #666;
	    font-size: 28upx;
	    padding-bottom: 30upx;
	  }
	  .user_info {
	    font-size: 28upx;
	    background: #fff;
	    height: 100%;
	    .card {
	      margin-bottom: 10upx;
	    }
	    .user_info_title {
	      position: relative;
	      padding: 30upx;
	      .text_title {
	        font-size: 32upx;
	        margin-left: 0upx;
	        position: relative;
	        .title {
	          margin-left: 46upx;
	        }
	        .icon {
	          position: absolute;
	          top: -2upx;
	        }
	        .edit {
	          color: #666;
	          font-size: 28upx;
	          margin-left: auto;
	          float: right;
	        }
	      }
	    }
	    .user_info_box.bgclr1 {
	      background-color: #f8eedf;
	    }
	    .user_info_box {
	      background-color: #dcf2e8;
	      margin: 6upx;
	      padding: 6upx;
	      flex: 1;
	      text-align: center;
	    }
	    .user_info_cont1 {
	      width: 100%;
	      display: flex;
	      justify-content: center;
	      padding: 0upx 24upx;
	    }
	    .user_info_cont2 {
	      padding-bottom: 36upx;
	      .workUndergo_box {
	        padding-left: 30upx;
	        padding-right: 30upx;
	        padding-bottom: 30upx;
	        display: flex;
	        align-items: center;
	        justify-content: space-between;
	        .edit_icon {
	          margin-top: 50upx;
	        }
	        .workUndergo_box_name {
	          width: 650upx;
	          margin-top: 8upx;
	          margin-bottom: 14upx;
	          font-size: 34upx;
	          overflow: hidden;
	          text-overflow: ellipsis;
	          white-space: nowrap;
	        }
	        .workUndergo_box_time {
	          color: #666;
	          width: 650upx;
	          margin-top: 36upx;
	          margin-bottom: 8upx;
	          overflow: hidden;
	          text-overflow: ellipsis;
	          white-space: nowrap;
	        }
	        .text_t1 {
	          color: #666;
	        }
	        .text_t2 {
	          color: #666;
	          font-size: 24upx;
	          margin-top: 8upx;
	        }
	      }
	      .user_info_cont2_box {
	        padding-bottom: 20upx;
	        position: relative;
	      }
	      .round {
	        width: 22upx;
	        height: 22upx;
	        border-radius: 50%;
	        background: #42b983;
	        display: inline-block;
	        position: absolute;
	        top: 0;
	        bottom: 0;
	        left: -50upx;
	        margin: auto;
	      }
	      .user_info_cont_text1 {
	        font-size: 30upx;
	      }
	      .user_info_cont2_intro {
	        margin-left: 60upx;
	        font-size: 30upx;
	        .user_info_cont2_intro_t1 {
	          position: relative;
	        }
	        .user_info_cont2_intro_t3 {
	          margin-bottom: 30upx;
	          font-size: 28upx;
	        }
	        .user_info_cont2_intro_t4 {
	          font-size: 28upx;
	        }
	      }
	    }
	  }
	  .list {
	    font-size: 24upx;
	    background: #fff;
	    .list_box {
	      display: flex;
	      padding: 30upx 0upx;
	      padding-left: 30upx;
	      padding-bottom: 24upx;
	      .con_img {
	        width: 100upx;
	        height: 100upx;
	        border-radius: 100%;
	        margin-right: 20upx;
	        img {
	          width: 100%;
	          width: 100%;
	        }
	      }
	      .con_info {
	        flex: 1;
	        display: flex;
	        flex-wrap: wrap;
	        align-content: space-between;
	        .con_text1 {
	          width: 100%;
	          display: flex;
	          align-items: center;
	          .con_text1_name {
	            font-size: 40upx;
	            max-width: 150upx;
	            overflow: hidden;
	            text-overflow: ellipsis;
	            white-space: nowrap;
	          }
	        }

	        .con_text2 {
	          .con_text2_tag {
	            color: #666;
	            font-size: 26upx;
	            padding-right: 20upx;
	          }
	        }
	      }
	    }
	  }
	  .isOpen {
	    background-color: #f2f2f2;
	    padding: 20upx;
	    height: 90upx;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    .isOpen_left {
	      height: 100%;
	      display: flex;
	      flex-direction: column;
	      justify-content: space-between;
	      .isOpen_left_1 {
	        font-size: 32upx;
	      }
	      .isOpen_left_2 {
	        font-size: 24upx;
	        color: #999;
	      }
	    }
	  }
	}
	.user_info_span {
	  padding-bottom: 20upx;
	  font-size: 28upx;
	  color: rgb(102, 102, 102);
	  .div {
	    margin-left: 30upx;
	  }
	  .tips1 {
	    display: inline-block;
	    margin-right: 50upx;
	    margin-top: 10upx;
	    margin-bottom: 10upx;
	  }
	  .tips2 {
	    color: #000;
	  }
	}
	.spanborder {
	  color: #42b983;
	}
	.li-sp {
	  padding-top: 20upx;
	  padding-bottom: 20upx;
	}
	.icon-nan- {
	  color: #1296db;
	}
	.icon-nv- {
	  color: #ff75a9;
	}
	.edu-img {
	  width: 355upx;
	  height: 200upx;
	  margin-top: 20upx;
	  margin-bottom: 10upx;
	}
	.notes-btn {
	  width: 100%;
	  height: 98upx;
	  line-height: 98upx;
	  text-align: center;
	  font-size: 32upx;
	  color: #fff;
	  background-color: #42b983;
	  position: fixed;
	  bottom: 0;
	}
</style>
