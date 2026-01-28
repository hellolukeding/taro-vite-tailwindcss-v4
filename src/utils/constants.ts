/**
 * 常量定义
 */

// API基础URL - 从环境变量读取，支持开发/生产环境切换
// 开发环境：在 .env.development 中配置 TARO_BASE_URL
// 生产环境：在 .env.production 中配置 TARO_BASE_URL
export const BASE_URL = "https://hibrushapi.embivision.com";

// API基础URL
export const API_BASE_URL = `${BASE_URL}/api/v1`;

export const BASE_PAGE_SIZE = 20;

// 微信订阅消息模板ID
export const WECHAT_TASK_COMPLETE_TEMPLATE_ID = "3wbMuP_BB8AfTSFzWj46qfvfj6Jpw_nz_C9JhRjMvjU";
export const WECHAT_TICKET_REPLY_TEMPLATE_ID = "-A47c_eiF47h8p_5No3Sk29YyGT7KkfJ3j-aDsMbTxk";

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
} as const;

// 用户角色
export const USER_ROLES = {
  NORMAL: 0,
  VIP: 1,
  ADMIN: 9,
} as const;

// 任务状态
export const TASK_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  UPLOADING: 2,
  SUCCESS: 3,
  FAILED: 4,
  VIOLATION: 5,
} as const;

// 任务状态文本映射
export const TASK_STATUS_TEXT: Record<number, string> = {
  0: "排队中",
  1: "处理中",
  2: "上传中",
  3: "已完成",
  4: "失败",
  5: "违规",
};

// 发布状态
export const PUBLISH_STATUS = {
  PRIVATE: 0,
  AUDITING: 1,
  PUBLIC: 2,
} as const;

// 发布状态文本映射
export const PUBLISH_STATUS_TEXT: Record<number, string> = {
  0: "私有",
  1: "审核中",
  2: "已公开",
};

// 作品分类
export const CATEGORIES = {
  ALL: "all",
  ANIME: "anime",
  REALISTIC: "realistic",
  THREED: "3d",
} as const;

// 分类显示名称
export const CATEGORY_NAMES: Record<string, string> = {
  all: "全部",
  anime: "二次元",
  realistic: "写实摄影",
  "3d": "3D渲染",
};

// 排序类型
export const SORT_TYPE = {
  HOT: "hot",
  LATEST: "latest",
} as const;

// 图片比例
export const IMAGE_RATIOS = {
  "1:1": { width: 1024, height: 1024 },
  "3:4": { width: 768, height: 1024 },
  "16:9": { width: 1344, height: 768 },
  "9:16": { width: 768, height: 1344 },
} as const;

/**
 * 生成默认头像URL
 * 基于用户昵称生成唯一的几何图形头像
 * @param nickname 用户昵称
 * @returns 头像URL
 */
export function generateAvatarUrl(nickname?: string | null): string {
  if (!nickname || nickname.trim() === "") {
    // 如果没有昵称，使用默认头像
    return "https://i.urusai.cc/PlyC9.png";
  }
  // 使用后端头像生成API
  return `${API_BASE_URL}/avatar/${encodeURIComponent(nickname)}`;
}
