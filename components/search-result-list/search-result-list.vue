<template>
  <view class="search-result-list-container">
    <empty-data v-if="isEmpty"></empty-data>
    <!-- 1. 通过 mescroll-body 包裹列表，指定 ref 为 mescrollRef ，监听@init、@down、@up 事件 -->
    <mescroll-body
      v-else
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :up="{
        auto:false
      }"
      :down="{
        auto:false
      }"
    >
      <!-- 循环渲染列表数据 -->
      <block
        v-for="(item, index) in resultList"
        :key="index"
      >
        <view class="search-result-item-box">
          <!-- 内容区 - 样式 1 -->
          <search-result-item-theme-1
            v-if="!item.pic_list || item.pic_list.length === 0"
            :data="item"
          />

          <!-- 内容区 - 样式 2 -->
          <search-result-item-theme-2
            v-else-if="item.pic_list.length === 1"
            :data="item"
          />

          <!-- 内容区 - 样式 3 -->
          <search-result-item-theme-3
            v-else
            :data="item"
          />
          <!-- / -->
        </view>
      </block>
    </mescroll-body>
  </view>
</template>

<script>
import { getSearchResult } from "api/search";
// 2. 导入对应的 mixins
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  name: "search-result-list",
  props: {
    // 搜索关键字
    queryStr: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 数据源
      resultList: [],
      // 页数
      page: 1,
      // 实例
      mescroll: null,
      // 处理渲染，会回调 down和up 方法，为了避免该问题，定义 init 变量，表示当前是否为首次请求
      isInit: true,
      // 是否无数据
      isEmpty: false,
    };
  },
  // 3. 注册 mixins
  mixins: [MescrollMixin],
  // created() {
  //   不需要主动调用
  //  this.loadSearchResult();
  // },
  // 页面渲染完成之后回调，想要获取组件实例，需要在该回调中进行
  mounted() {
    // 通过 $refs 获取组件实例
    this.mescroll = this.$refs.mescrollRef.mescroll;
    this.mescroll?.endSuccess(10, true);
  },
  methods: {
    // 4. 实现三个回调方法
    /**
     * List 组件的首次加载
     */
    async mescrollInit() {
      await this.loadSearchResult();
      this.isInit = false;
      // 结束 上拉加载 && 下拉刷新
      this.mescroll?.endSuccess(10, true);
      // this.mescroll?.endSuccess();
    },
    /**
     * 下拉刷新的回调
     */
    async downCallback() {
      if (this.isInit) return;
      this.page = 1;
      await this.loadSearchResult();
      // 结束 上拉加载 && 下拉刷新
      // this.mescroll.endSuccess(10, true);
      this.mescroll?.endSuccess(10, true);
    },
    /**
     * 上拉加载的回调
     */
    async upCallback() {
      if (this.isInit) return;
      this.page += 1;
      await this.loadSearchResult();
      // 结束 上拉加载 && 下拉刷新
      // this.mescroll.endSuccess(10, true);
      this.mescroll?.endSuccess(10, true);
    },
    /**
     * 获取搜索数据
     */
    async loadSearchResult() {
      const { data: res } = await getSearchResult({
        q: this.queryStr,
        p: this.page,
      });
      // 更改返回数据样式（行内样式）
      res.list.forEach((item) => {
        item.title = item.title.replace(
          /<em>/g,
          "<em style='color:#f94d2a; margin:0 2px'>"
        );
        item.description = item.description.replace(
          /<em>/g,
          "<em style='color:#f94d2a; margin:0 2px'>"
        );
      });
      // this.resultList = res.list;
      // 判断是否为第一页数据
      if (this.page === 1) {
        this.resultList = res.list;
      } else {
        this.resultList = [...this.resultList, ...res.list];
      }

      // this.resultList = [];
      // 无数据，显示空数据组件
      if (this.resultList.length === 0) {
        this.isEmpty = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-result-list-container {
  padding: $uni-spacing-col-lg $uni-spacing-row-lg;
  .search-result-item-box {
    margin-bottom: $uni-spacing-col-big;
  }
}
</style>