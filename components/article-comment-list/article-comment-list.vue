<template>
  <view
    class="comment-limt-container"
    v-if="!isShowAllComment"
  >
    <view class="comment-title">精简评论</view>
    <block
      v-for="(item, index) in commentList.slice(0, 2)"
      :key="index"
    >
      <!-- item 项组件 -->
      <article-comment-item :data="item.info" />
    </block>
    <view
      class="show-more"
      @click="onMoreClick"
    >查看更多评论</view>
  </view>
  <!-- 全部评论 -->
  <view
    class="comment-all-container"
    v-else
  >
    <!-- 1. 通过 mescroll-body 包裹列表，指定 ref 为 么scrollRef，监听 @init，@down，@up 事件 -->
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      @up="upCallback"
      :up="{
				auto:false,
				textNoMore: '-- 我也是有底线的！ --',
				page:{
					num : 0 ,
					size : 1,
				}
			}"
      :down="{
        use: false
      }"
    >
      <view class="comment-title">全部评论</view>
      <block
        v-for="(item, index) in commentList"
        :key="index"
      >
        <!-- item 项组件 -->
        <article-comment-item :data="item.info"></article-comment-item>
      </block>
    </mescroll-body>
  </view>
</template>

<script>
import { getArticleCommentList } from "api/article";
export default {
  name: "article-comment-list",
  props: {
    // 文章 ID
    articleId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 当前页数
      page: 1,
      // 每页评论数
      pageSize: 5,
      // 评论列表
      commentList: [],
      // 是否展示全部评论
      isShowAllComment: false,
      // 组件实例
      mescroll: null,
      // 是否为 init
      isInit: true,
      commentListTotal: 0,
    };
  },
  created() {
    this.loadCommentList();
  },
  methods: {
    /**
     * 获取评论列表
     */
    async loadCommentList() {
      const { data: res } = await getArticleCommentList({
        articleId: this.articleId,
        page: this.page,
        size: this.pageSize,
      });
      // 获取总数量
      this.commentListTotal = res.count;
      // 判断是否为第一页数据
      if (this.page === 1) {
        this.commentList = res.list;
      } else {
        this.commentList = [...this.commentList, ...res.list];
      }
      // this.commentList = Object.freeze(res.list);
    },
    /**
     * 查看全部评论的点击事件
     */
    onMoreClick() {
      this.isShowAllComment = true;
    },
    /**
     * 首次加载
     */
    async mescrollInit() {
      await this.loadCommentList();
      this.isInit = false;
      // 结束 上拉加载 && 下拉刷新
      this.getMescroll().endSuccess();
      // 判断数据是否加载完成
      // console.log(this.commentList.length, this.commentListTotal);
      this.getMescroll().endBySize(
        this.commentList.length,
        this.commentListTotal
      );
    },
    /**
     * 上拉加载更多
     */
    async upCallback() {
      // console.log("up");
      if (this.isInit) return;
      this.page += 1;
      await this.loadCommentList();
      // 结束 上拉加载 && 下拉刷新
      this.getMescroll().endSuccess();
      // 判断数据是否加载完成
      this.getMescroll().endBySize(
        this.commentList.length,
        this.commentListTotal
      );
    },
    /**
     * 返回 mescroll实例对象
     */
    getMescroll() {
      // 不能放到 mounted当中
      if (!this.mescroll) {
        this.mescroll = this.$refs.mescrollRef.mescroll;
      }
      return this.mescroll;
    },
    /**
     * 为 comment 增加一个评论
     */
    addCommentList(data) {
      this.commentList.unshift(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-title {
  font-weight: bold;
  color: $uni-text-color-title;
  font-size: $uni-font-size-lg;
  margin: $uni-spacing-col-lg 0;
}
.comment-limt-container {
  .show-more {
    margin: $uni-spacing-col-lg;
    text-align: center;
    color: $uni-text-color-more;
    font-size: $uni-font-size-base;
  }
}
</style>