<template>
  <div class="search-blog-container">
    <view class="search-bar-box">
      <!-- search模块 -->
      <my-search
        v-model="searchVal"
        isShowInput
        :placeholderText="defaultText"
        :config="{
          backgroundColor: '#f1f0f3'
        }"
        @search="onSearchConfirm"
        @focus="onSearchFocus"
        @blur="onSearchBlur"
        @clear="onSearchClear"
        @cancel="onSearchCancel"
      ></my-search>
      <!-- 热搜列表 -->
      <view
        class="search-hot-list-box card"
        v-if="showType === HOT_LIST"
      >
        <!-- 列表 -->
        <search-hot-list @onSearch="onSearchConfirm" />
      </view>
      <!-- 搜索历史 -->
      <view
        class="search-history-box"
        v-else-if="showType === SEARCH_HISTORY"
      >
        <search-history
          :searchData="searchData"
          @removeAllSearchData="onRemoveAllSearchData"
          @removeSearchData="onRemoveSearchData"
          @onItemClick="onSearchConfirm"
        />
      </view>
      <!-- 搜索结果 -->
      <view
        class="search-result-box"
        v-else
      >
        <!-- 1. 给mescroll-body的组件添加: ref="mescrollItem" (固定的,不可改,与mescroll-comp.js对应)-->
        <search-result-list
          ref="mescrollItem"
          :queryStr="searchVal"
        />
      </view>
    </view>
  </div>
</template>

<script>
// 直接写api就可以拿到资源
import { getDefaultText } from "api/search.js";
// 1. 导入 mapState 函数
import { mapState } from "vuex";
// 导入 mapMutations 函数
import { mapMutations } from "vuex";

// 2. 引入mescroll-comp.js
import MescrollCompMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js";

// 0: 热搜列表 - 默认
const HOT_LIST = "0";
// 1：搜索历史
const SEARCH_HISTORY = "1";
// 2：搜索结果
const SEARCH_RESULT = "2";
export default {
  components: {},
  data() {
    return {
      // 定义到data中template才能拿到数据
      HOT_LIST,
      SEARCH_HISTORY,
      SEARCH_RESULT,
      // 绑定输入框中的内容
      searchVal: "",
      // 默认的placeholderText
      defaultText: "默认的placeholderText",
      // 默认情况下 || 点击输入框的取消按钮时，显示【热搜列表】
      // 当 searchBar 获取焦点时 || 点击输入框清空按钮时，显示 【搜索历史】
      // 用户点击热搜列表 item || 用户点击搜索历史 || 用户按下搜索键，显示 【搜索结果】
      showType: HOT_LIST,
      // 搜索历史数据
      searchData: [],
    };
  },
  // 3. 注册 mixins
  mixins: [MescrollCompMixin],
  computed: {
    // 2. 在 computed 中，通过 mapState 函数，注册 state 中的数据，导入之后的数据可直接使用（就像使用 data 中的数据一样）
    // mapState(模块名, ['字段名','字段名','字段名'])
    ...mapState("search", ["msg"]),
  },
  created() {
    this.loadDefaultText();
  },
  methods: {
    ...mapMutations("search", ["addSearchData"]),
    /**
     * 获取推荐搜索文本
     */
    async loadDefaultText() {
      const { data: res } = await getDefaultText();
      this.defaultText = res.defaultText;
    },
    /**
     * 搜索内容
     */
    onSearchConfirm(val) {
      // 用户未输入文本，直接搜索时，使用【推荐搜索文本】
      this.searchVal = val ? val : this.defaultText;
      // this.saveSearchData();
      // 保存搜索历史数据
      this.addSearchData(this.searchVal);
      // 切换视图
      if (this.searchVal) {
        this.showType = SEARCH_RESULT;
      }
    },
    /**
     * 保存搜索历史数据
     */
    saveSearchData() {
      // 1. 如果数据已存在，则删除
      const index = this.searchData.findIndex(
        (item) => item === this.searchVal
      );
      if (index !== -1) {
        this.searchData.splice(index, 1);
      }
      // 2. 新的搜索内容需要先于旧的搜索内容展示
      this.searchData.unshift(this.searchVal);
    },
    /**
     * 删除数据
     */
    onRemoveSearchData(index) {
      this.searchData.splice(index, 1);
    },
    /**
     */
    onRemoveAllSearchData() {
      this.searchData = [];
    },
    // searchbar 获取焦点
    onSearchFocus(val) {
      this.showType = SEARCH_HISTORY;
    },
    /**
     * searchbar 失去焦点
     */
    onSearchBlur(val) {},
    /**
     * searchbar 清空内容
     */
    onSearchClear() {
      // 切换视图
      this.showType = SEARCH_HISTORY;
    },
    /**
     * searchbar 取消按钮
     */
    onSearchCancel(val) {
      this.showType = HOT_LIST;
    },
  },
};
</script>

<style  lang="scss" scoped>
.search-blog-container {
  .search-bar-box {
    background-color: $uni-bg-color;
    padding: $uni-spacing-row-sm;
    position: sticky;
    top: 0;
    z-index: 9;
  }
}
</style>