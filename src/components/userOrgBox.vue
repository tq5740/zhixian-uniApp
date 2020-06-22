<template>
  <div>
    <div class="position-org-detail" :style="isTopNum0 ? 'margin-top: 0' : ''">
      <div class="position-org-introduce" @click="onOrgClick">
        <img :src="dataOrg.orgLogoStr" class="position-org-avatar" v-if="dataOrg.orgLogoStr">
        <div class="position-org-profile">
          <div>
            <span class="position-org-name">{{dataOrg.orgName}}</span>
          </div>
          <div class="position-org-sub">
            <span class="none-tips">{{dataOrg.natrue ? dataOrg.natrue : ""}}</span>
            <span class="position-org-type">{{dataOrg.industry ? dataOrg.industry : ""}}</span>
            <span class="position-org-scale">{{dataOrg.scale ? dataOrg.scale : ""}}</span>
          </div>
        </div>
        <i class="iconfont gengduo_icon icongengduo"></i>
      </div>

      <div class="position-train-grade scale-1px-top" v-if="dataLocation.city" @click.stop="onLocation">
        <div class="position-train-stars">
          <span class="iconfont icondingwei_1"></span>
          <span>{{dataLocation.province ? dataLocation.province : ""}}{{dataLocation.city ? dataLocation.city : ""}}{{dataLocation.district ? dataLocation.district : ""}}{{dataLocation.street ? dataLocation.street : ""}}</span>
          <span class="iconfont icon-gengduo"></span>
        </div>
      </div>

      <div class="position-org-grade scale-1px-top" v-else>
        <div class="position-org-stars">
          <span class="iconfont position-org-stars-icon iconxing" v-for="item in 5" :key="item"></span>
        </div>
        <div>共{{dataOrg.comments == null ? 0 : dataOrg.comments}}人评分</div>
      </div>
    </div>
    <div class="margin-bott"></div>
  </div>

</template>

<script>

export default {
  props: {
    dataOrg: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isTopNum0: {
      type: Boolean,
      default: false
    },
    dataLocation: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  },
  methods: {
    onOrgClick() {
      let dataJson = JSON.stringify({ orgVideo: this.dataOrg.orgVideo, orgId: this.dataOrg.orgId, orgImg: this.dataOrg.orgImg })
      uni.navigateTo({ url: "/pages/detail/orgDetail?dataJson=" + dataJson + "&tabStatus=0" });
    },
    onLocation() {
      let data = {
        latitude: new Number(this.dataLocation.lat),
        longitude: new Number(this.dataLocation.lng),
        address: this.dataLocation.province + this.dataLocation.city + this.dataLocation.district + this.dataLocation.street
      }
      this.$openLocation(data);
    }
  }
}
</script>
<style lang="scss" scoped>
  .position-org-detail {
    background-color: #fff;
    margin-top: 20upx;
    padding: 20upx;
  }
  .margin-bott {
    width: 100%;
    height: 20upx;
    background-color: #f2f2f2;
  }
  .position-org-introduce {
    height: 108upx;
    display: flex;
    align-items: center;
    padding-bottom: 20upx;
  }
  .position-org-avatar {
    width: 80upx;
    height: 80upx;
    margin-right: 20upx;
  }
  .position-org-profile {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .position-org-name {
    float: left;
    margin-bottom: 14upx;
    font-size: 32upx;
    width: 600upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .position-org-sub {
    font-size: 24upx;
    color: #999;
  }
  .none-tips {
    float: left;
    font-size: 24upx;
    padding-right: 10upx;
  }
  .position-org-type {
    float: left;
    padding-left: 10upx;
    padding-right: 10upx;
    border-right: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
  }
  .position-org-scale {
    float: left;
    padding-left: 10upx;
  }
  .gengduo_icon {
    font-size: 24upx;
    color: #999;
  }
  .position-org-grade {
    height: 54upx;
    display: flex;
    align-items: center;
    padding-top: 14upx;
    color: #999;
    font-size: 24upx;
  }
  .position-org-stars-icon {
    font-size: 34upx;
    margin-right: 10upx;
    display: inline-block;
    color: rgb(255, 174, 0);
  }
  .position-org-stars {
    flex: 1;
  }
  .position-train-grade {
    width: 710upx;
    margin: auto;
    align-items: center;
    padding: 12upx 0 0 0;
    font-size: 24upx;
    color: #999;
    background-color: #fff;
  }
  .position-train-stars {
    flex: 1;
    line-height: 60upx;
    font-size: 26upx;
  }
  .position-train-stars-icon {
    width: 17px;
    height: 17px;
    margin-right: 5px;
    display: inline-block;
    color: rgb(255, 174, 0);
  }
  .icon-dingwei_1 {
    font-size: 28upx;
    display: inline-block;
    margin-right: 5upx;
    color: #42b983;
  }
  .icon-gengduo {
    float: right;
    font-size: 28upx;
  }
</style>
