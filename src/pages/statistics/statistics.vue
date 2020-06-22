<template>
  <!--统计-->
  <view class="statistics page-full">
    <!-- 平台统计 -->
    <view class="platform-statistics block">
      <view class="title van-hairline--bottom">
        <text class="iconfont iconpingtaitongji title-icon"></text>
        <text class="title-text">基本统计</text>
      </view>
      <view class="platform-statistics-body">
        <view class="platform-statistics-category van-hairline--right-bottom" @click="toUser">
          <view class="iconbody iconbody-yh">
            <text class="iconfont iconyonghu"></text>
          </view>
          <view class="textbody">
            <text class="textbody-num">{{userCount}}</text>
            <text class="textbody-name">用户</text>
          </view>
        </view>
        <view class="platform-statistics-category van-hairline--bottom" @click="toOrg">
          <view class="iconbody iconbody-zz">
            <text class="iconfont iconzuzhi"></text>
          </view>
          <view class="textbody">
            <text class="textbody-num">{{orgCount}}</text>
            <text class="textbody-name">企业</text>
          </view>
        </view>
        <!-- <view class="platform-statistics-category van-hairline--right" @click="toWork">
          <view class="iconbody iconbody-zw">
            <text class="iconfont iconzhiwei"></text>
          </view>
          <view class="textbody">
            <text class="textbody-num">{{workNumber}}</text>
            <text class="textbody-name">职位</text>
          </view>
        </view>
        <view class="platform-statistics-category" @click="toJiuye">
          <view class="iconbody iconbody-jy">
            <text class="iconfont iconyonghu"></text>
          </view>
          <view class="textbody">
            <text class="textbody-num">{{bookingNumber}}</text>
            <text class="textbody-name">就业</text>
          </view>
        </view> -->
      </view>
    </view>
    <!-- 最近登录 -->
    <view class="latelylogin block">
      <view class="title van-hairline--bottom">
        <text class="iconfont iconzuijindenglu1 title-icon"></text>
        <text class="title-text">最近登录</text>
      </view>
      <view class="latelylogin-body">
        <canvas canvas-id="latelylogin-area" class="latelylogin-area" @touchstart="onTouchLineA" @touchmove="onMoveLineA" @touchend="onTouchEndLineA"></canvas>
      </view>
    </view>
    <!-- 管理日志 -->
    <view class="logs block" v-if="false">
      <view class="title van-hairline--bottom">
        <text class="iconfont iconguanlirizhi title-icon"></text>
        <text class="title-text">管理日志</text>
      </view>
      <view class="logs-body">
        <view class="log">
          <view class="log-timeline-divider-out first-timeline">
            <view class="log-timeline-divider-in"></view>
          </view>
          <view class="log-content">
            <view class="log-content-remark">
              <view class="log-content-tag tag-create">
                <text>创建</text>
              </view>
              <text>操作描述操作描述操作描述操作描述操作操作描述操作描述操作描述</text>
            </view>
            <view class="log-info">
              <text class="log-info-creater">创建人：周杰伦</text>
              <text>2019-03-28 10:50:02</text>
            </view>
          </view>
        </view>
        <view class="log">
          <view class="log-timeline-divider-out">
            <view class="log-timeline-divider-in"></view>
          </view>
          <view class="log-content">
            <view class="log-content-remark">
              <view class="log-content-tag tag-delete">
                <text>删除</text>
              </view>
              <text>阿达</text>
            </view>
            <view class="log-info">
              <text class="log-info-creater">创建人：周杰伦</text>
              <text>2019-03-28 10:50:02</text>
            </view>
          </view>
        </view>
        <view class="log">
          <view class="log-timeline-divider-out">
            <view class="log-timeline-divider-in"></view>
          </view>
          <view class="log-content">
            <view class="log-content-remark">
              <view class="log-content-tag tag-update">
                <text>修改</text>
              </view>
              <text>修改企业用户</text>
            </view>
            <view class="log-info">
              <text class="log-info-creater">创建人：周杰伦</text>
              <text>2019-03-28 10:50:02</text>
            </view>
          </view>
        </view>
        <view class="log">
          <view class="log-timeline-divider-out last-timeline">
            <view class="log-timeline-divider-in"></view>
          </view>
          <view class="log-content last-log-content">
            <view class="log-content-remark">
              <view class="log-content-tag tag-check">
                <text>审核</text>
              </view>
              <text>上下线文章</text>
            </view>
            <view class="log-info">
              <text class="log-info-creater">创建人：周杰伦</text>
              <text>2019-03-28 10:50:02</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// http://doc.ucharts.cn
import uCharts from "../../utils/u-charts.min.js";
import userApi from "../../api/modules/user.js";
import workApi from "../../api/modules/work.js"

let canvaLineA = null;

export default {
  data() {
    return {
      userCount: 0,
      orgCount: 0,
      workNumber: 0,
      bookingNumber: 0
    };
  },
  onShow() {
    this.$updateNavbarTitle("统计");
	uni.showTabBar({
		animation:false
	});
    // workApi
    //   .getQueryBasicSituationWork()
    //   .then(data => {
    //     this.workNumber = data.workNumber;
    //     this.bookingNumber = data.bookingNumber;
    //   })
    //   .catch(err => {
    //     uni.showToast({ title: err, icon: "none" });
    //   });

    userApi
      .getQueryBasicSituationUser()
      .then(data => {
        this.userCount = data.userCount;
        this.orgCount = data.orgCount;
      })
      .catch(err => {
        uni.showToast({ title: err, icon: "none" });
      });
	let endTimeT = new Date().getTime();
	let startTimeT = endTimeT - 60 * 60 * 24 * 6 * 1000;
	let rqData={
		startTime: this.$formatDate(startTimeT, "YYYY-MM-DD 23:59:59"),
		endTime: this.$formatDate(endTimeT, "YYYY-MM-DD 00:00:00"),
		type: "week"
	};
    userApi
      .getLatelyLoginUserStatistic(rqData)
      .then(data => {
        let categories = [];
        let series = [];
        let yMax = 0;
		if(data.length==0){
			for (var i = 0; i < 7; i++) {
				categories.push(this.$formatDate(startTimeT, "YYYY-MM-DD"));
				startTimeT+=60 * 60 * 24  * 1000;
				series.push(0);
			}
		}else{
			data.forEach(v => {
			  categories.push(v.time);
			  series.push(v.loginuser);
			  yMax = yMax < v.loginuser ? v.loginuser : yMax;
			});
		}
        setTimeout(() => {
          this.drawAreaCharts(
            categories,
            [{ data: series, color: "#A7B1F5" }],
            yMax + 10
          );
        }, 500);

      })
      .catch(err => {
        uni.showToast({ title: err, icon: "none" });
      });
  },
  methods: {
    // 画图表
    drawAreaCharts(categories = [], series = [], yMax = 200) {
      let _self = this;
      canvaLineA = new uCharts({
        $this: _self,
        canvasId: "latelylogin-area",
        width: uni.upx2px(750),
        height: uni.upx2px(470),
        type: "area",
        fontSize: uni.upx2px(20),
        legend: false,
        dataLabel: false,
        dataPointShape: false,
        background: "#FFFFFF",
        pixelRatio: 1,
        enableScroll: true,
        animation: true,
        categories: categories,
        series: series,
        xAxis: {
          disableGrid: true,
          scrollShow: false,
          itemCount: 5 //x轴单屏显示数据的数量，默认为5个
        },
        yAxis: {
          type: "grid",
          gridColor: "#D8D8D8",
          gridType: "solid",
          dashLength: uni.upx2px(1),
          min: 0,
          max: yMax
        },
        extra: {
          area: {
            type: "curve",
            addLine: true
          }
        }
      });
    },
    toUser() {
      uni.navigateTo({ url: "/pages/manage/user/latelyregister/latelyregister" });
    },
    toOrg() {
      uni.navigateTo({ url: "/pages/manage/organization/organization/organization" });
    },
    toWork() {
      uni.navigateTo({ url: "/pages/manage/recruit/work/work" });
    },
    toJiuye() {
      uni.navigateTo({ url: "/pages/manage/recruit/booking/booking" });
    },
    onTouchLineA(e) {
      canvaLineA.scrollStart(e);
    },
    onMoveLineA(e) {
      canvaLineA.scroll(e);
    },
    onTouchEndLineA(e) {
      canvaLineA.scrollEnd(e);
    }
  }
};
</script>
<style scoped>
  .block {
    margin-bottom: 20upx;background: #FFFFFF;
  }
  .title,
  .platform-statistics-body,
  .platform-statistics-category,
  .textbody,
  .log-info,
  .log {
    display: flex;
  }

  .logs-body {
    margin: 0upx 50upx;
    /* #ifdef H5 */
    padding-bottom: var(--window-bottom);
    /* #endif */
  }

  .log-content {
    width: 572upx;
    border-bottom: 1upx solid rgba(216, 216, 216, 1);
    box-sizing: border-box;
    padding-bottom: 30upx;
  }
  .last-log-content {
    border: none;
  }
  .log {
    min-height: 148upx;
    padding-top: 28upx;
    overflow: hidden;
  }
  .log-content-tag {
    display: inline-block;
    width: 66upx;
    height: 30upx;
    border-radius: 15px;
    font-size: 22upx;
    font-family: PingFang-SC-Regular;
    text-align: center;
    line-height: 30upx;
    margin-right: 10upx;
  }
  .tag-create {
    color: rgba(66, 185, 131, 1);
    border: 1upx solid rgba(66, 185, 131, 1);
  }
  .tag-delete {
    color: #fc703e;
    border: 1upx solid #fc703e;
  }
  .tag-update {
    color: #ffae00;
    border: 1upx solid #ffae00;
  }
  .tag-check {
    color: #75caff;
    border: 1upx solid #75caff;
  }

  .log-content-remark {
    font-size: 28upx;
    font-family: PingFang-SC-Medium;
    color: rgba(0, 0, 0, 1);
    line-height: 42upx;
  }
  .log-info {
    justify-content: space-between;
    font-size: 24upx;
    font-family: PingFang-SC-Regular;
    color: rgba(153, 153, 153, 1);
    margin-top: 40upx;
  }
  .first-timeline {
    background: rgba(217, 241, 230, 1);
    border-radius: 50%;
  }
  .first-timeline .log-timeline-divider-in {
    background: rgba(66, 185, 131, 1);
    border-radius: 50%;
  }
  .log-timeline-divider-out {
    width: 28upx;
    height: 28upx;
    margin-top: 8upx;
    margin-right: 57upx;
    position: relative;
  }
  .log-timeline-divider-out::before,
  .log-timeline-divider-out::after {
    position: absolute;
    left: 50%;
    content: "";
    width: 2upx;
    height: 20vh;
    background: rgba(216, 216, 216, 1);
  }
  .first-timeline::after {
    margin-top: 5upx;
  }
  .last-timeline::after,
  .first-timeline::before {
    display: none;
  }
  .log-timeline-divider-out::before {
    bottom: 100%;
  }
  .log-timeline-divider-out::after {
    top: 100%;
  }
  .log-timeline-divider-in {
    width: 14upx;
    height: 14upx;
    background: rgba(177, 177, 177, 1);
    border-radius: 50%;
    margin: 7upx;
  }
  .latelylogin {
    height: 604upx;
  }
  .latelylogin-area {
    height: 470upx;
    width: 750upx;
    margin-top: calc(604upx - 470upx - 74upx - 10upx);
  }

  .platform-statistics {
    /* height: 396upx; */
  }
  .platform-statistics-body {
    flex-wrap: wrap;
  }
  .platform-statistics-category {
    width: 374upx;
    height: 160upx;
    align-items: center;
	position: relative;
  }
  .iconbody {
    width: 80upx;
    height: 80upx;
    border-radius: 50%;
    display: flex;align-items: center;justify-content: center;
    margin: auto 40upx auto 80upx;
  }
  .iconbody-yh {
    background: rgba(59, 199, 207, 1);
    box-shadow: 0px 3px 8px 0px rgba(59, 199, 207, 0.8);
  }
  .iconbody-zz {
    background: rgba(117, 202, 255, 1);
    box-shadow: 0px 3px 8px 0px rgba(117, 202, 255, 0.8);
  }
  .iconbody-zw {
    background: rgba(199, 155, 250, 1);
    box-shadow: 0px 2px 6px 0px rgba(199, 155, 250, 0.66);
  }
  .iconbody-jy {
    background: rgba(255, 130, 151, 1);
    box-shadow: 0px 2px 6px 0px rgba(255, 130, 151, 0.66);
  }
  .textbody {
    height: 80upx;
    flex-direction: column;
    justify-content: space-around;
    margin: auto 0upx;
  }
  .textbody-num {
    font-size: 40upx;
    color: rgba(0, 0, 0, 1);
  }
  .textbody-name {
    font-size: 24upx;
    color: rgba(102, 102, 102, 1);
  }
  .title {
    height: 74upx;
    width: 100%;
    align-items: center;
   position: relative;
  }
  .title-icon {
    margin: 0px 15upx 0upx 20upx;
  }
  .title-text {
    font-size: 30upx;
    color: rgba(102, 102, 102, 1);
  }
</style>



