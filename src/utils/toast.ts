import Taro from "@tarojs/taro";

/**
 * Toast 工具类
 * 使用 Taro 原生 API 替代 Taroify Toast，避免版本兼容性问题
 */
export const toast = {
  success: (title: string, duration = 2000) => {
    Taro.showToast({
      title,
      icon: "success",
      duration,
    });
  },

  error: (title: string, duration = 2000) => {
    Taro.showToast({
      title,
      icon: "error",
      duration,
    });
  },

  info: (title: string, duration = 2000) => {
    Taro.showToast({
      title,
      icon: "none",
      duration,
    });
  },

  loading: (title = "加载中...") => {
    Taro.showLoading({
      title,
      mask: true,
    });
  },

  hideLoading: () => {
    Taro.hideLoading();
  },
};
