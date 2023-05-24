<!-- 
分析 my-tabs 组件的能力 -> 
希望创建一个通用的 my-tabs 组件，可以满足各个应用中的需求
1.可在父组件中定制 my-tabs 样式
2.可在父组件中设置展示数据
3.可在父组件中设置默认的激活项 
-->
<template>
  <view class="tab-container">
    <view class="tab-box">
      <scroll-view id='_scroll' scroll-x class="scroll-view" scroll-with-animation :scroll-left='scrollLeft'>
        <view class="scroll-content">
          <view class="tab-item-box">
            <block v-for="(item, index) in tabData" :key='index'>
              <view :id="'_tab_' + index" class="tab-item" :class="{ 'tab-item-active': activeIndex === index }"
                @click="tabClick(index)" :style="{
                  color: activeIndex === index ? defaultConfig.activeTextColor : defaultConfig.textColor
                }">{{ item.label || item }}</view>
            </block>
          </view>
          <!-- 滑块 -->
          <view class="underLine" :style="{
            transform: `translateX(${slider.left}px)`,
            width: defaultConfig.underLineWidth + 'px',
            height: defaultConfig.underLineHeight + 'px',
            backgroundColor: defaultConfig.underLineColor,
          }">
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-tabs",
  props: {
    // 1.定制样式
    config: {
      type: Object,
      // 使用函数返回复杂数据类型
      default: () => {
        return {};
      },
    },
    // 2.指定数据源
    tabData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 3.指定选中项
    // 子组件不能改变父组件传递的数据
    defaultIndex: {
      type: Number,
      defalt: 0,
    },
  },
  data() {
    return {
      // 内部维护的数据对象，为每个 item 单独额外维护一个 slider 的滑块对象
      tabList: [],
      // 当前激活项的 index
      activeIndex: -1,
      // 滑块对象
      // 1.确定滚动时机
      // 2.确定滚动距离
      slider: {
        // 距离左侧的距离
        left: 0,
      },
      // scrollView 的横向滚动条位置
      scrollLeft: 0,
      // 默认配置
      defaultConfig: {
        // 默认的字体颜色
        textColor: "#333333",
        // 高亮字体颜色
        activeTextColor: "#f94d2a",
        // 下划线宽度 px
        underLineWidth: 24,
        // 下划线高度 px
        underLineHeight: 2,
        // 下划线颜色
        underLineColor: "#f94d2a",
      },
    };
  },
  // 侦听器
  watch: {
    tabData: {
      handler(val) {
        this.tabList = val;
        // 维护tabList中的每个item, 且要为DOM渲染完成后的
        // this.$nextTick 在uniapp中存在兼容性问题
        setTimeout(() => {
          this.updateTabWidth();
        }, 0);
      },
      immediate: true,
    },
    // 监听激活项目的变化
    defaultIndex: {
      handler(val) {
        this.activeIndex = val;
        // 定义滑块的位置
        this.tabToIndex();
      },
      // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
    config: {
      handler(val) {
        // 合并配置项
        this.defaultConfig = { ...this.defaultConfig, ...val };
      },
      // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  methods: {
    /**
     * 更新 tab item 的宽度
     */
    updateTabWidth() {
      /**
       * 为 tabList 的每个 item 单独额外维护一个 slider 的滑块对象
       */
      const data = this.tabList;
      if (data.length === 0) return false;
      // 获取dom的固定写法
      const query = uni.createSelectorQuery().in(this);
      data.forEach((item, index) => {
        query
          .select("#_tab_" + index)
          .boundingClientRect((res) => {
            // 为数据对象中每一个 item 都维护一个 _slider（滑动条） 对象
            item._slider = {
              // 当前的 tab 距离左侧的距离
              left:
                res.left + (res.width - this.defaultConfig.underLineWidth) / 2,
            };
            if (data.length - 1 === index) {
              // 运算完成之后，执行一次 【滑块】位置运算
              this.tabToIndex();
            }
          })
          .exec();
      });
    },
    /**
     * tab 的点击事件处理
     */
    tabClick(index) {
      this.activeIndex = index;
      // 定义滑块的位置
      this.tabToIndex();
      // 发送通知
      this.$emit("tabClick", index);
    },
    /**
     * 根据当前的 activeIndex 下标，计算 【滑块】 滚动位置
     */
    tabToIndex() {
      //  this.tabList没有数据的时候 直接返回
      if (this.tabList.length === 0) return;
      // 获取当前的 activeIndex
      const activeIndex = this.activeIndex;
      this.slider = {
        // 1. 维护一个单独的数据对象 `tabList`
        // 2. 在 `tabList`  的 `item` 中为一个 `_slider` 属性
        // 3. 该属性保存了 【当前 `item` 下 的滑块位置】
        //    3.1. 计算公式：`滑块左侧位置 = item.left + (item.width - slider.width) / 2`
        left: this.tabList[activeIndex]._slider.left,
      };
      // 为 scrollView 设置滚动位置
      this.scrollLeft = activeIndex * this.defaultConfig.underLineWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-container {
  font-size: $uni-font-size-base;
  height: 40px;
  line-height: 40px;
  background-color: $uni-bg-color;

  .tab-box {
    width: 100%;
    height: 45px;
    display: flex;
    position: relative;

    .scroll-view {
      white-space: nowrap;
      /*不换行 否则不会出现滚动条*/
      width: 100%;
      height: 100%;
      box-sizing: border-box;

      .scroll-content {
        width: 100%;
        height: 100%;
        position: relative;

        .tab-item-box {
          height: 100%;
          display: flex;

          .tab-item {
            height: 100%;
            // display: inline-block;
            text-align: center;
            padding: 0 15px;
            position: relative;
            text-align: center;
            color: $uni-text-color;

            &-active {
              color: $uni-text-color-hot;
            }
          }
        }

        .underLine {
          height: 2px;
          width: 25px;
          background-color: #f01414;
          border-radius: 3px;
          transition: 0.5s; // 动画
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
}

/* #ifdef H5 */
/deep/.uni-scroll-view::-webkit-scrollbar {
  display: none;
}

/deep/.uni-scroll-view {
  scrollbar-width: none;
}

/* #endif */
</style>
