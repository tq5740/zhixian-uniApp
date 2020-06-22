<template>
  <div class="problem">
    <search @search="onSearch" plhder="输入问题关键字"></search>

    <div class="problem-cell-group">
      <cell-list-item v-for="(item, key) in problemData" :title="item.problemTitle" @onTapCellListItem="onItemCellTap(item.problemId)" :key="key"></cell-list-item>
    </div>
    <no-data :isNoData="isNoData"></no-data>
  </div>
</template>

<script>
import cellListItem from "../../../../components/cellListItem"
import Search from '../../../../components/mehaotianSearch'
import Publics from '../../../../api/modules/public'
export default {
  components: {
    Search,
    cellListItem
  },
  data() {
    return {
      isNoData: false,
      query: "",
      problemData: []
    }
  },
  onLoad() {
    this.getList();
  },
  onShow() {
    this.$updateNavbarTitle("常见问题");
  },
  computed: {
  },
  methods: {
    onSearch(e) {
      this.query = e;
      this.getList();
    },
    onItemCellTap(e) {
      uni.navigateTo({ url: '/pages/mine/setting/problem/detail?problemId=' + e });
    },
    getList() {
      Publics.problemList({
        pageSize: "99", pageNum: "1", query: this.query, type: 1
      }).then(res => {
        this.problemData = res.result;
        if (res.result.length <= 0) {
          this.isNoData = true;
        } else {
          this.isNoData = false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .problem {
    height: 100%;
    background-color: #f2f2f2;
  }
</style>
