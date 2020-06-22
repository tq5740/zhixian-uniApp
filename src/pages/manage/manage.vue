<template>
	<view class="manage">
		<view class="menu-lv1-list">
			<template v-for="(row,j) of manageMenuList">
				<view v-for="(m,i) of row" v-if="m.show" class="menu-lv1" :class="{'van-hairline--right-bottom':((j+1)!=manageMenuList.length&&(i+1)%3!=0),'van-hairline--bottom':((j+1)!=manageMenuList.length&&(i+1)%3==0),'van-hairline--right':((j+1)==manageMenuList.length&&(i+1)%3!=0)}" @tap="onLv1MenuClick(m)" :key="m.name">
					<text class="iconfont menu-lv1-icon" :class="m.iconClass"></text>
					<text class="menu-lv1-text">{{m.name}}</text>
				</view>
			</template>
		</view>
		<action-menu :show="isShowLv2Menu" :title="lv2MenuTitle" :menuList="lv2MenuList" @onHideMenu="onHideLv2Menu"></action-menu>
		<no-data :isNoData="isNoData"></no-data>
	</view>
</template>
<script>
	import {
		mapState
	} from "vuex"
	import actionMenu from "../../components/actionMenu.vue"
	import menuTree from "@/utils/menuTree"

	export default {
		components: {
			actionMenu
		},
		data() {
			return {
				isShowLv2Menu: false,
				lv2MenuTitle: "菜单",
				lv2MenuList: [],
			}
		},
		computed: {
			isNoData(){
				return this.manageMenuList.length == 0;
			},
			manageMenuList() {
				if (!this.methodTree) return [];
				let list = [];
				let row = [];
				let i = 1;
				for (let m of menuTree.manage) {//本地
					let sm = this.methodTree.manage[m.key];//接口
					if (!sm) {
						this.$set(m, "show", false);
						continue;
					}
					this.$set(m, "show", true);
					this.$set(m, "name", sm.methodName);
					m.children.forEach(mm => {
						if (sm.children[mm.key]) {
							this.$set(mm, "show", true);
							this.$set(mm, "name", sm.children[mm.key].methodName);
						} else {
							this.$set(mm, "show", false);
						}
					});
					row.push(m);
					if (i % 3 == 0) {
						list.push(row);
						row = [];
					}
					++i;
				}
				if (row.length != 0) list.push(row);
				return list;
			},
			...mapState(["methodTree"])
		},
		onLoad() {
		},
		onShow() {
			this.$updateNavbarTitle("管理");
			if(this.isShowLv2Menu){
				uni.hideTabBar({
					animation:false
				});
			}else{
				uni.showTabBar({
					animation:false
				});
			}
		},
		methods: {
			onLv1MenuClick(menu) {
				this.isShowLv2Menu = true;
				this.lv2MenuTitle = menu.name;
				this.lv2MenuList = menu.children;
			},
			onHideLv2Menu() {
				this.isShowLv2Menu = false;
			}
		}
	}
</script>
<style scoped>
	.manage {
		background: rgba(242, 242, 242, 1);
		height: 100%;
	}

	.menu-lv1-list,
	.menu-lv1 {
		display: flex;
		background: #FFFFFF;
	}

	.menu-lv1-list {
		flex-wrap: wrap;
	}

	.menu-lv1 {
		width: calc(100% / 3);
		height: 210upx;
		background: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.menu-lv1-icon {
		margin-bottom: 20upx;
		font-size: 54upx;
	}

	.menu-lv1-text {
		font-size: 28upx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: rgba(102, 102, 102, 1);
	}
</style>
