/**
 * 常量定义
 */

// API基础URL
export const API_BASE_URL = 'http://localhost:8000/api/v1'

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
} as const

// 用户角色
export const USER_ROLES = {
  NORMAL: 0,
  VIP: 1,
  ADMIN: 9,
} as const

// 任务状态
export const TASK_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  UPLOADING: 2,
  SUCCESS: 3,
  FAILED: 4,
  VIOLATION: 5,
} as const

// 任务状态文本映射
export const TASK_STATUS_TEXT: Record<number, string> = {
  0: '排队中',
  1: '处理中',
  2: '上传中',
  3: '已完成',
  4: '失败',
  5: '违规',
}

// 发布状态
export const PUBLISH_STATUS = {
  PRIVATE: 0,
  AUDITING: 1,
  PUBLIC: 2,
} as const

// 发布状态文本映射
export const PUBLISH_STATUS_TEXT: Record<number, string> = {
  0: '私有',
  1: '审核中',
  2: '已公开',
}

// 作品分类
export const CATEGORIES = {
  ALL: 'all',
  ANIME: 'anime',
  REALISTIC: 'realistic',
  THREED: '3d',
} as const

// 分类显示名称
export const CATEGORY_NAMES: Record<string, string> = {
  all: '全部',
  anime: '二次元',
  realistic: '写实摄影',
  '3d': '3D渲染',
}

// 排序类型
export const SORT_TYPE = {
  HOT: 'hot',
  LATEST: 'latest',
} as const

// 图片比例
export const IMAGE_RATIOS = {
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 768, height: 1024 },
  '16:9': { width: 1344, height: 768 },
  '9:16': { width: 768, height: 1344 },
} as const
