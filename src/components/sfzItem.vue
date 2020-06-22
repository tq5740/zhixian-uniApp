<template>
  <div class="img-box-dzsbk" @click="onClickSFZ">
    <span class="name">{{dataItem.name}}</span>
    <span class="sex">{{dataItem.sex}}</span>
    <span class="nation">{{dataItem.nation}}</span>
    <span class="year">{{dataItem.year}}</span>
    <span class="month">{{dataItem.month}}</span>
    <span class="day">{{dataItem.day}}</span>
    <span class="addr">{{dataItem.addr}}</span>
    <span class="idNumber">{{dataItem.idNumber}}</span>
  </div>
</template> 

<script>
export default {
  props: {
    dataItem: {
      type: Object,
      default: function () {
        return {
          name: "张某某",
          sex: "男",
          nation: "汉",
          year: "1900",
          month: "01",
          day: "01",
          addr: "四川省成都市金牛区二环路北一段4号",
          idNumber: "123456789012345678"
        }
      }
    }
  },
  methods: {
    onClickSFZ() {
      this.$emit("click");
    }
  }
}
</script>
<style lang="scss" scoped>
  .img-box-dzsbk {
    background: url("https://i.weijiuye.com.cn/default/cdwork/id_number.jpg") no-repeat;
    background-size: 690upx 410upx;
    position: relative;
    width: 690upx;
    height: 410upx;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 28upx;
  }
  .img-box-dzsbk span {
    font-size: 26upx;
    color: #333333;
    position: absolute;
  }
  .name {
    top: 60upx;
    left: 120upx;
  }
  .sex {
    top: 106upx;
    left: 120upx;
  }
  .nation {
    top: 106upx;
    left: 264upx;
  }
  .year {
    top: 156upx;
    left: 120upx;
  }
  .month {
    top: 156upx;
    left: 226upx;
  }
  .day {
    top: 156upx;
    left: 291upx;
  }
  .addr {
    display: inline-block;
    top: 210upx;
    left: 122upx;
    width: 267upx;
    line-height: 36upx;
  }
  .idNumber {
    top: 337upx;
    left: 237upx;
    font-size: 28upx;
    color: #252116;
    font-weight: bold;
    letter-spacing: 6upx;
  }
</style>
