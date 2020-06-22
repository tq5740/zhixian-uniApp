<template>
  <div class="noData" v-if="isNoData">
    <div>
      <img :src="configData.imgDomain + '/default/cdwork/null.png'" alt="">
      <br>
      <br>
    </div>
    空空如也~
  </div>
</template>

<script>

export default {
  props: {
    isNoData: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  }
}
</script>
<style scoped lang="scss">
  .noData {
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: #427059;
    text-align: center;
    font-size: 28upx;
    padding-top: 240upx;
	
	position: fixed;left: 0; bottom: 0;
	
    img {
      width: 288upx;
      height: 240upx;
    }
  }
</style>
