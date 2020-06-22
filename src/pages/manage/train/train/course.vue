<template>
	<view class="train-chapter page-full" :class="noData ? '' : 'padding_bottom_88'">
		<view class="list-content">
			<template v-for="(d,i) of dataList">
				<list-item :item="d" @onBtnClick="onBtnClick" :key="i">
					<template v-slot:content>
						<list-item-article :name="d.trainResourceTitle" :tips="getTips(d)" tipsColor="#999999">
							<template v-slot:intro>
								<view class="link">
									<text class="title">{{"资源类型"}}：</text>
									<text class="url uni-ellipsis">{{d.type==3?"课程":d.type==5?"考试":"调查"}}</text>
								</view>
							</template>
						</list-item-article>
					</template>
					<template v-slot:footer>
						<view class="footer"></view>
					</template>
				</list-item>
			</template>
		</view>
		<view class="create-btn" @tap="onCreateBtnClick">
			<text class="iconfont iconchuangjian"></text>
			<text>添加课程</text>
		</view>
		<msg-modal ref="msg" @onConfirm="onMsgConfirm"></msg-modal>
		<no-data :isNoData="noData"></no-data>
	</view>
</template>

<script>
import trainApi from "@/api/modules/train.js";
import listItemArticle from "@/components/listItemArticle.vue"

let getListFn = trainApi.getTrainResourceListAdmin.bind(trainApi);
export default {
	components: {
		listItemArticle
	},
	data() {
		return {
			stateIconSize: uni.upx2px(30) + "px",
			pageNum: 1,
			pageTotal: 2,
			trainId: undefined,
			dataList: [],
		};
	},
	onLoad({ id, name }) {
		this.$updateNavbarTitle(name);
		this.trainId = id;
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	onShow(refresh) {
		if (refresh)
			this.getList(true);
	},
	methods: {
		/**
		 * 请求列表
		 */
		getList(restart = false) {
			this._getListFromServer(getListFn, restart, ["trainId"])
		},
		onDeleteClick(o) {
			this.$refs.msg.show(`<span>是否删除课程“</span><span style="color: #000;font-weight: bold">${o.trainResourceTitle}</span><span>”？</span>`, o.resourceId);
		},
		onMsgConfirm(flag) {
			uni.showLoading();
			trainApi.postDeleteTrainResourceAdmin({
				trainId: this.trainId,
				resourceIds: flag
			}).then(data => {
				uni.hideLoading();
				this.getList(true);
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: err,
					duration: 2000,
					icon: "none"
				});
			});
		},
		onCreateBtnClick() {
			uni.navigateTo({
				url: `/pages/manage/train/train/addCourse?trainId=${this.trainId}`
			})
		},
		getTips: function (d) {
			return `修改人：${d.updateUserName}  修改时间：${this.$formatDate(d.updateTime, "YYYY-MM-DD hh:mm:ss")}`;
		}
	},
}
</script>

<style lang="scss" scoped>
	.train-chapter {
	  height: auto;
	}
	.padding_bottom_88 {
	  padding-bottom: 88upx;
	}
	.link {
	  font-size: $font-size-24;
	  width: 100%;
	  margin: 30upx 0px 22upx;
	  color: #666666;
	  .url {
	    color: #6d9985;
	    display: inline-block;
	    width: 580upx;
	    vertical-align: top;
	  }
	}
	.footer {
	  width: 100%;
	  height: 10upx;
	  background: #ffffff;
	}
</style>
