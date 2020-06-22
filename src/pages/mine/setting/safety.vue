<template>
    <div class="safety">
        <div class="header-cell-group">
            <cell-list-item title="手机号码" :value="telephoneNumber" @onTapCellListItem="onItemCellTap('phone')"></cell-list-item>
            <cell-list-item :isBorder="false" title="电子邮箱" :value="email" @onTapCellListItem="onItemCellTap('email')"></cell-list-item>
        </div>
        <div class="footer-cell-group">
            <cell-list-item :isBorder="false" title="登录密码" @onTapCellListItem="onItemCellTap('password')"></cell-list-item>
        </div>
    </div>
</template>

<script>
import cellListItem from "../../../components/cellListItem"
export default {
    components: {
        cellListItem
    },
    data() {
        return {
            telephoneNumber: "",
            email: ""
        }
    },
    computed: {
    },
    methods: {
        onItemCellTap(url) {
            uni.navigateTo({ url: '/pages/mine/setting/' + url });
        }
    },
    onShow() {
       this.$updateNavbarTitle("账户与安全");
    }
}
</script>
<style lang="scss" scoped>
    .safety {
      min-height: 100%;
      background-color: #f2f2f2;
      .header-cell-group {
        margin-bottom: 20upx;
      }
      .footer-cell-group {
        margin-bottom: 40upx;
      }
    }
</style>
