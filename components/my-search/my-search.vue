<!-- 
1.具备输入框的样式
2.不可进行输入
3.placeholder 内容可以在父组件定义 
-->
<template>
  <view class="my-seach-container">
    <!-- 搜索输入框 -->
    <uni-search-bar
      v-if="isShowInput"
      class="my-search-bar"
      @confirm="onSearch"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
      @cancel="onCancel"
      @input="onInput"
      :radius="100"
      :bgColor="config.backgroundColor"
      :placeholder="placeholderText"
      :value="value"
    >
      <!--  :value="value"  单向数据流 -->
      <!-- 插槽 -->
      <uni-icons
        slot="clearIcon"
        type="clear"
        color="#999999"
      />
    </uni-search-bar>

    <!-- 搜索按钮 -->
    <view
      class="my-search-box"
      v-else
      :style="{
        height: config.height + 'px',
        backgroundColor: config.backgroundColor,
        border: config.border
      }"
    >
      <image
        class="icon"
        :src="config.icon"
      />
      <text
        class="placeholder"
        :style="{
          color: config.textColor
        }"
      >{{ placeholderText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-search",
  props: {
    placeholderText: {
      type: String,
      default: "搜索",
    },
    // 配置对象
    config: {
      type: Object,
      default: () => ({
        height: 36,
        backgroundColor: "#ffffff",
        icon: "/static/images/search.png",
        textColor: "#454545",
        border: "1px solid #c9c9c9",
      }),
    },
    // 是否显示输入框
    isShowInput: {
      type: Boolean,
      default: false,
    },
    // 输入的内容  不能使用v-model 因为直接使用会修改父组件传递过来的值
    // value 名称不可修改，与 $emit('input') 事件对应
    value: {
      type: String,
    },
  },
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  methods: {
    /**
     * 点击搜索按钮触发
     */
    onSearch(e) {
      this.$emit("search", this.value);
    },
    /**
     * 输入框获取焦点触发
     */
    onFocus(e) {
      this.$emit("focus", this.value);
    },
    /**
     * 输入框失去焦点触发
     */
    onBlur(e) {
      this.$emit("blur", this.value);
    },
    /**
     * 点击输入框中的清空按钮时
     */
    onClear(e) {
      this.$emit("clear", this.value);
    },
    /**
     * 点击取消按钮时
     */
    onCancel(e) {
      this.$emit("cancel", this.value);
    },
    /**
     *  value 改变时触发事件
     */
    onInput(val) {
      // 当同时存在：
      // props -> value
      // $emit('input', val)
      // 时，在组件外可以使用 v-model 完成双向数据绑定。
      // 即：用户输入内容时，父组件传递过来的 value 同步发生变化
      // 详细见 vue 中 v-model 指令：https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.my-seach-container {
  display: flex;
  align-items: center;
  .my-search-bar {
    width: 100%;
    ::v-deep .uni-searchbar__box {
      // 处理初始 searchbar 位置
      justify-content: start !important;
    }
  }

  .my-search-box {
    height: 36px;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 15px;
    border: 1px solid #c9c9c9;
    padding: 0 $uni-spacing-row-base;
    background-color: #ffffff;

    .icon {
      width: $uni-img-size-sm;
      height: $uni-img-size-sm;
    }

    .placeholder {
      font-size: $uni-font-size-sm;
      margin-left: $uni-spacing-row-sm;
      color: #454545;
    }
  }
}
</style>
