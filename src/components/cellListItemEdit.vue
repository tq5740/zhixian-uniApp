<template>
  <div class="cellListItem" :class="isBorder ? 'scale-1px-bottom' : ''" @tap="onCellListItem">
    <span class="title">{{title}}</span>
    <span v-if="isNoNull" style="color: #fc703e">*</span>

    <span v-if="isNoIcon" class="iconfont jiantou icongengduo"></span>
    <span class="values" v-if="isNoIcon" style="color: #999999">{{value}}</span>
    <span class="values mar-20" v-else style="color: #999999">{{value}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    isNoNull: {
      type: Boolean,
      default: true
    },
    isNoIcon: {
      type: Boolean,
      default: true
    },
    isBorder: {
      type: Boolean,
      default: true
    }
  },
  computed: {

  },
  methods: {
    onCellListItem() {
      this.$emit("onTapCellListItem");
    }
  }
}
</script>
<style lang="scss" scoped>
  .cellListItem {
    height: 100upx;
    line-height: 100upx;
    margin-left: 30upx;
    background-color: #fff;
    .title {
      font-size: 32upx;
    }
    .icon {
      font-size: 38upx;
      margin: 0 25upx;
      flex-shrink: 0;
    }
    .values {
      float: right;
      font-size: 30upx;
    }
    .mar-20 {
      margin-right: 25upx;
    }
    .jiantou {
      font-size: 26upx;
      color: #999999;
      float: right;
      margin: 0 25upx;
      flex-shrink: 0;
    }
  }
  .isRadius-top {
    border-top-left-radius: 10upx;
    border-top-right-radius: 10upx;
  }
  .isRadius-bottom {
    border-bottom-left-radius: 10upx;
    border-bottom-right-radius: 10upx;
  }
  .isRadius-none {
    border-radius: 0;
  }
  .isBorder-none {
    border: none;
  }
  .cellListItem-noIcon {
    height: 100upx;
    line-height: 100upx;
  }
</style>
