<template>
  <div class="img-box-dzsbk" @click="onClickDZSBK">
    <span class="name">姓名 &nbsp;{{dataItem.name}}</span>
    <span class="idNumber">社会保障号码 &nbsp;{{dataItem.idNumber}}</span>
    <span class="cardNumber">卡号 &nbsp;{{dataItem.cardNumber}}</span>
    <span class="id">{{dataItem.id}}</span>
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
          idNumber: "123456789012345678",
          cardNumber: "132456798",
          id: "888888 8888888888888"
        }
      }
    }
  },
  methods: {
    onClickDZSBK() {
      this.$emit("click");
    }
  }
}
</script>
<style lang="scss" scoped>
  .img-box-dzsbk {
    background: url("https://i.weijiuye.com.cn/default/cdwork/social_security.jpg")
      no-repeat;
    background-size: 690upx 410upx;
    position: relative;
    width: 690upx;
    height: 410upx;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 28upx;
  }
  .img-box-dzsbk span {
    font-size: 24upx;
    color: #333333;
    position: absolute;
  }
  .name {
    top: 110upx;
    left: 208upx;
  }
  .idNumber {
    top: 150upx;
    left: 208upx;
  }
  .cardNumber {
    top: 190upx;
    left: 208upx;
  }
  .id {
    top: 300upx;
    left: 122upx;
    color: #282828;
    font-weight: bold;
    font-size: 42upx;
  }
</style>
