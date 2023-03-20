import store from "../store";
// 封装请求对象
// const BASE_URL = "https://api.imooc-blog.lgdsunday.club/api";
const BASE_URL = "http://127.0.1.1:3000/api"; // api前缀

function request({ url, data, method }) {
  return new Promise((resolve, reject) => {
    uni.request({
      header: {
        Authorization: store.state.user.token,
      },
      url: `${BASE_URL}${url}`,
      data,
      method,
      success({ data }) {
        if (data.success) {
          resolve(data);
        } else {
          uni.showToast({
            title: data.message,
            icon: "none",
            mask: true,
            duration: 3000,
          });
          reject(data.message);
        }
      },
      fail(error) {
        reject(error);
      },
      // 请求介绍之后调用
      complete: () => {
        // 关闭加载
        uni.hideLoading();
      },
    });
  });
}
export default request;
