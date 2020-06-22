<template>
  <div>
    <div class="venue-header scale-1px-bottom">
      <div class="venue-name">{{venueDetailData.venueTitle}}</div>
      <div class="recruit-hold-dateTime">举办时间：{{venueDetailData.startTimeString + " "}}<span v-if="venueDetailData.startDate != venueDetailData.endDate">~ {{venueDetailData.endTimeString}}</span> {{" " + venueDetailData.period}}</div>
      <div class="recruit-hold-dateTime" v-if="venueDetailData.deadline">报名截止时间：{{venueDetailData.deadlineStr}}</div>
    </div>
    <div class="venue-navigation" @click="navToAddressNavigation">
      <span class="iconfont icondingwei1 location-icon icon-dingwei_1"></span>
      <span class="location-sp">{{venueDetailData.address}}</span>
      <span class="iconfont icongengduo icon-gengduo"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    venueDetailData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    navToAddressNavigation() {
      // 导航功能
      let data = {
        latitude: new Number(this.venueDetailData.lat),
        longitude: new Number(this.venueDetailData.lng),
        address: this.venueDetailData.address
      }
      this.$openLocation(data);
    }
  }
}
</script>
<style scoped lang="scss">
  .icon-gengduo {
    font-size: 28upx;
    color: #999;
  }
  .venue-navigation {
    height: 88upx;
    padding: 0 20upx;
    display: flex;
    align-items: center;
  }
  .location-icon {
    margin-right: 8upx;
    flex-shrink: 0;
    font-size: 28upx;
    color: #42b983;
  }
  .location-sp {
    flex: 1;
    overflow: auto;
    white-space: nowrap;
  }
  .bottom-bar {
    border-top: 1px solid #dfdfdf;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 98upx;
    z-index: 1;
    font-size: 24upx;
    color: #42b983;
    background-color: #fff;
  }
  .position-btn {
    flex: 2;
    font-size: 32upx;
    background-color: #42b983;
    color: #fff;
  }
  .venue-header {
    padding: 15upx 30upx;
    text-align: center;
  }
  .venue-name {
    text-align: left;
    margin-bottom: 30upx;
    color: #000;
    font-size: 40upx;
  }
  .recruit-hold-dateTime {
    text-align: left;
    margin-bottom: 20upx;
  }
  .venue-hold-dateTime {
    font-size: 26upx;
  }
  .venue-hold-dateTime {
    margin-bottom: 20upx;
    text-align: left;
  }
</style>
