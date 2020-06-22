<template>
  <view class="loadmsg-view" :class="{hidden:!loading&&!nomore}">
    <canvas :class="{hidden:!loading}" class="loadmsg" canvas-id="loadmsg"></canvas>
    <view :class="{hidden:!nomore}">
      <text>已经全部加载完了{{assist.timeid}}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    nomore: { type: Boolean, default: false }
  },
  data() {
    return {
      f: 0.5,
      s: 1.5,
      t: 2.5,
      assist: {}
    };
  },
  watch: {
    loading(val, oldval) {
      if (!val) {
        clearInterval(this.assist.timeid);
      } else {
        this.darw();
      }
    }
  },
  created() {
    this.assist.timeid = null;
  },
  mounted() {
    if (this.loading) this.darw();
  },
  destroyed() {
    clearInterval(this.assist.timeid);
  },
  methods: {
    darw() {
      let con = uni.createCanvasContext("loadmsg", this);
      let num1, num2, num3;
      num1 = num2 = num3 = 0.1;
      this.assist.timeid = setInterval(() => {
        con.setFillStyle("#8B8B8B");
        con.arc(3, 3, this.f, 0, 2 * Math.PI);
        con.arc(10, 3, this.s, 0, 2 * Math.PI);
        con.arc(17, 3, this.t, 0, 2 * Math.PI);
        con.fill();
        con.draw(false);
        this.f += num1;
        this.s += num2;
        this.t += num3;
        if (this.f > 3 || this.f < 0.1) {
          num1 = -num1;
        }
        if (this.s > 3 || this.s < 0.1) {
          num2 = -num2;
        }
        if (this.t > 3 || this.t < 0.1) {
          num3 = -num3;
        }
      }, 25);
    }
  }
};
</script>
 <style scoped>
.loadmsg-view {
  height: 50upx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loadmsg {
  width: 21px;
  height: 6px;
  margin: auto;
}
.hidden {
  display: none;
}
text {
  color: #afafaf;
}
</style>


