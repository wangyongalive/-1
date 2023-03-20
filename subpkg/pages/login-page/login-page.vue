<template>
  <view>
    <my-login @onLoginSuccess="onLoginSuccess" />
  </view>
</template>

<script>
export default {
  name: "login-page",
  data() {
    return {};
  },
  methods: {
    /**
     * 登录成功的事件回调
     */
    onLoginSuccess() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss">
</style>