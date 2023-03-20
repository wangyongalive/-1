// 通用样式
import "./styles/global.scss";
// 导入所有的过滤器 并重命名为filters
import * as filters from "./filters";

// #ifndef VUE3
import Vue from "vue";
import App from "./App";
// 导入 vuex 实例
import store from "./store";

Vue.config.productionTip = false;

App.mpType = "app";

// 注册过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

const app = new Vue({
  ...App,
  store, // 挂载实例对象
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
import App from "./App.vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
