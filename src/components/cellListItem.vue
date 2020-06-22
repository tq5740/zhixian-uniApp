<template>
  <div class="cellListItem" :class="cellListItemClass" @tap="onCellListItem">
    <span v-if="icon" :class="'iconfont icon ' + icon"></span>
    <span :class="icon ? 'paLeft0' : 'paLeft32'" class="title">{{title}}</span>

    <span v-if="isIcon" class="iconfont jiantou icongengduo"></span>
    <span :style="'color:' + color" class="values">
      <span :style="isInten ? 'color: #FC703E': ''">{{value}}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#808080"
    },
    value: {
      type: String,
      default: ""
    },
    isIcon: {
      type: Boolean,
      default: true
    },
    isBorder: {
      type: Boolean,
      default: true
    },
    isInten: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cellListItemClass() {
      let borderClass = this.isBorder ? 'van-hairline--bottom' : '';
      let heightClass = this.icon ? '' : 'cellListItem-noIcon';
      return borderClass + " " + heightClass;
    }
  },
  methods: {
    onCellListItem() {
      this.$emit("onTapCellListItem");
    }
  }
}
</script>
<style lang="scss" scoped>
  .iconxiaoxi_xuanzhong {
    color: rgb(66, 185, 131);
  }
  .iconshenfenrenzheng1 {
    color: rgb(255, 121, 107);
  }
  .icontoudijilu1 {
    color: rgb(248, 174, 54);
  }
  .iconkefurexian1 {
    color: rgb(66, 185, 131);
  }
  .iconshezhi {
    color: rgb(248, 174, 54);
  }
  .iconqiehuanjiaose {
    color: rgb(253, 159, 41);
  }
  .iconqiye {
    color: rgb(22, 178, 247);
  }
  .paLeft32 {
    padding-left: 32upx;
  }
  .paLeft0 {
    padding-left: 0;
  }
  .cellListItem {
    height: 100upx;
    background-color: #fff;
    line-height: 100upx;
    position: relative;
    .title {
      font-size: 32upx;
    }
    .icon {
      font-size: 38upx;
      margin: 0 20upx;
      flex-shrink: 0;
    }
    .values {
      float: right;
      font-size: 30upx;
    }
    .jiantou {
      font-size: 26upx;
      color: #808080;
      float: right;
      margin: 0 25upx;
      flex-shrink: 0;
    }
  }
  .hot-show {
    position: absolute;
    width: 38upx;
    height: 46upx;
    left: 244upx;
    top: 22upx;
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
    height: 88upx;
    line-height: 88upx;
  }
</style>
