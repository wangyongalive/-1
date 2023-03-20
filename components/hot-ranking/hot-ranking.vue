<template>
  <view class="ranking-container">
    <image
      class="ranking-bg"
      :src="getRankingBg"
    />
    <text
      class="ranking-text"
      :class="{ 'text-white': ranking <= 3 }"
    >{{ ranking }}</text>
  </view>
</template>

<script>
export default {
  name: "hot-ranking",
  props: {
    ranking: {
      type: Number,
      required: true,
    },
  },
  /**
   * 当依赖值发生变化时，会重新计算
   */
  computed: {
    getRankingBg() {
      if (this.ranking <= 3) {
        return require(`@/static/images/ranking-${this.ranking}.png`);
      }
      return require("@/static/images/ranking-other.png");
    },
  },
};
</script>

<style lang="scss" scoped>
.ranking-container {
  position: relative; /*文字居中*/
  width: 18px;
  height: 20px;
  text-align: center;
  .ranking-bg {
    width: 100%;
    height: 100%;
  }
  .ranking-text {
    // 文字定位
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-55%, -55%);
    font-size: $uni-font-size-sm;
    font-weight: bold;
    color: $uni-text-color;
  }
  .text-white {
    color: white;
  }
}
</style>