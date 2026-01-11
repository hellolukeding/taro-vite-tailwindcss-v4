/**
 * 全局类型定义
 */

// ============ 用户相关 ============

export interface VIPInfo {
  is_vip: boolean
  expire_at: string | null
  daily_free_quota: number
  today_used: number
  today_remaining: number
}

export interface UserInfo {
  userId: string
  nickname: string
  avatarUrl: string
  role: number // 0:普通, 1:VIP, 9:管理员
  credits: number
  vipInfo: VIPInfo
  inviteCode?: string
}

// ============ 作品相关 ============

export interface WorkItem {
  task_id: string
  user_id: string
  user_nickname: string
  user_avatar: string
  prompt: string
  translated_prompt: string
  model_id: string
  model_name: string
  image_url: string
  thumbnail_url: string
  aspect_ratio: string
  likes_count: number
  is_liked: boolean
  is_vip: boolean
  created_at: string
}

export interface WorkDetail extends WorkItem {
  negative_prompt: string
  parameters: {
    width: number
    height: number
    steps: number
    cfg_scale: number
    seed: number
    aspect_ratio: string
  }
  high_res_url: string
}

// ============ 模型相关 ============

export interface ModelInfo {
  model_id: string
  name: string
  icon: string
  is_vip: boolean
  cost_per_image: number
  description?: string
  supported_ratios: string[]
  default_ratio: string
}

// ============ 任务相关 ============

export interface TaskStatus {
  task_id: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  status_text: string
  progress: number
  progress_message: string
  result_url: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface TaskSubmitParams {
  model_id: string
  prompt: string
  negative_prompt?: string
  parameters: {
    width: number
    height: number
    steps?: number
    cfg_scale?: number
    seed?: number
  }
}

export interface TaskItem {
  task_id: string
  prompt: string
  model_id: string
  model_name: string
  image_url: string | null
  thumbnail_url: string | null
  status: number
  status_text: string
  publish_status: number
  publish_status_text: string
  created_at: string
  is_public: boolean
}

// ============ 分类相关 ============

export interface Category {
  id: string
  name: string
  icon?: string
  sort_order: number
}

// ============ 套餐相关 ============

export interface Package {
  id: number
  package_id: string
  name: string
  description?: string
  credits: number
  price: number
  original_price?: number
  bonus: number
  total_credits: number
  discount_percent?: number
  is_vip: boolean
  vip_days: number
  daily_free_quota: number
  is_active: boolean
  is_hot: boolean
  tag?: string
  sort_order: number
}

// ============ API响应相关 ============

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  total: number
  has_more: boolean
  items: T[]
  page?: number
  page_size?: number
}
