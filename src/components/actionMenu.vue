<template>
	<view class="actionmenu" v-show="show && menuShow">
		<view class="mark" @tap="onHideMenu"></view>
		<view class="menus-content">
			<view class="title menu-bottom-border">
				<text>{{title}}</text>
			</view>
			<view class="menu-lv2-list">
				<template v-for="(row,j) of manageMenuList">
					<view v-for="(v,i) of row" class="menu-lv2" :class="{'van-hairline--right-bottom':((j+1)!=manageMenuList.length&&(i+1)%3!=0),'van-hairline--bottom':((j+1)!=manageMenuList.length&&(i+1)%3==0),'van-hairline--right':((j+1)==manageMenuList.length&&(i+1)%3!=0)}"
					 @tap="onLv2MenuClick(v.url)" :key="v.name">
						<text class="iconfont menu-lv2-icon" :class="v.iconClass"></text>
						<text class="menu-lv2-text">{{v.name}}</text>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: "菜单"
			},
			menuList: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		computed: {
			manageMenuList() {
				let list = [];
				let row = [];
				let i = 1;
				for (let m of this.menuList) {
					if (!m.show) continue;
					row.push(m);
					if (i % 3 == 0) {
						list.push(row);
						row = [];
					}
					++i;
				}
				if (row.length != 0) list.push(row);
				return list;
			}
		},
		data() {
			return {
				menuShow: true
			};
		},
		watch: {
			show(newV, oldV) {
				if (newV == true) {
					uni.hideTabBar({
						animation: false,
						success: () => {
							this.menuShow = newV;
						}
					});
				}else{
					
					this.menuShow = newV;
				}
			}
		},
		created() {
			this.menuShow = this.show;
			if (this.show) {
				uni.hideTabBar({
					animation: false
				});
			}
		},
		methods: {
			onHideMenu() {
				this.menuShow = false;
				uni.showTabBar({
					animation: false
				});
				this.$emit("onHideMenu");
			},
			onLv2MenuClick(url) {
				this.onHideMenu();
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style scoped>
	.actionmenu {
		height: 100%;
		width: 100%;
		position: absolute;
		bottom: 0upx;
	}

	.menus-content {
		position: absolute;
		bottom: 0upx;
		width: 100%;
	}

	.title {
		background: #f2f2f2;
		height: 88upx;
		width: 100%;
		line-height: 88upx;
		text-align: center;
		font-size: 30upx;
		font-family: PingFang-SC-Medium;
		color: rgba(102, 102, 102, 1);
	}

	.menu-lv2-list {
		background: #FFFFFF;
	}

	.menu-lv2-list,
	.menu-lv2 {
		display: flex;
		position: relative;
	}

	.menu-lv2-list {
		flex-wrap: wrap;
	}

	.menu-lv2 {
		width: calc(100% / 3);
		height: 210upx;
		background: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.menu-lv2-icon {
		margin-bottom: 20upx;
		font-size: 54upx;
	}

	.menu-lv2-text {
		font-size: 28upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(102, 102, 102, 1);
	}
</style>
