<template>
  <div class="flex text-center" :style="isFixed ? 'position: fixed;width: 100%;top: 0;z-index: 777;' : ''">
    <div class="wuc-tab-item flex-sub" :style="list.length > 1 ? '' : 'border-bottom: 0 solid; color: #000;'" :class="idx == init ? selectClass + ' cur':''" v-for="(item, idx) in list" :key="idx" @tap="tabSelect(idx)">
      <span>{{item}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    init: {
      type: Number | String,
      default: 0
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    selectClass: {
      type: String,
      default: 'text-blue'
    }
  },
  methods: {
    tabSelect(index) {
      this.$emit('change', index);
    }
  }
};
</script>
<style lang="scss" scoped>
  .wuc-tab-item {
    height: 88upx;
    display: inline-block;
    line-height: 88upx;
    padding: 0 10upx;
  }

  .wuc-tab-item.cur {
    border-bottom: 2px solid;
  }
  .flex {
    box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    display: flex;
    font-size: 28upx;
    width: 100%;
    height: 88upx;
    border-bottom: 2upx solid #d8d8d8;
  }
  .text-center {
    text-align: center;
  }
  .flex-sub {
    flex: 1;
  }
  .text-blue {
    color: #42B983;
  }
  .text-white {
    color: #ffffff;
  }
  .bg-white {
    background-color: #ffffff;
  }
  .bg-blue {
    background-color: #42B983;
  }
  .text-orange {
    color: #f37b1d;
  }

  .text-xl {
    font-size: 36upx;
  }
</style>
