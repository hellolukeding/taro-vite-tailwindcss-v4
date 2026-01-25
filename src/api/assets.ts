/**
 * 资产相关API
 */
import client from './client'
import type { TaskItem } from '@/types'

export interface GetTasksParams {
  status?: string
  publish_status?: string
  limit?: number
  offset?: number
}

export interface TaskDetail {
  task_id: string
  status: number
  status_text: string
  image_url: string
  thumbnail_url: string
  prompt: string
  model_id: string
  model_name: string
  cost: number
  is_vip: boolean
  created_at: string
  updated_at: string
  completed_at: string | null
  progress: number
  error_message: string | null
  publish_status: number
  publish_status_text: string
  can_publish: boolean
  is_auditing: boolean
  is_public: boolean
  parameters: {
    width?: number
    height?: number
    steps?: number
    cfg_scale?: number
    seed?: number
  } | null
  stats: {
    likes_count: number
    comments_count: number
    favorites_count: number
  } | null
}

export const assetsApi = {
  /**
   * 获取我的任务列表
   */
  async getTasks(params: GetTasksParams): Promise<{
    total: number
    has_more: boolean
    items: TaskItem[]
  }> {
    return client.get('/miniprogram/assets/tasks', params)
  },

  /**
   * 获取任务详情
   */
  async getTaskDetail(taskId: string): Promise<TaskDetail> {
    return client.get(`/miniprogram/assets/task/${taskId}`)
  },

  /**
   * 申请公开发布作品
   */
  async publishTask(taskId: string): Promise<{
    success: boolean
    message: string
  }> {
    return client.post(`/miniprogram/assets/publish/${taskId}`)
  },

  /**
   * 取消公开发布
   */
  async unpublishTask(taskId: string): Promise<{
    success: boolean
    message: string
  }> {
    return client.delete(`/miniprogram/assets/publish/${taskId}`)
  },

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<{
    success: boolean
    message: string
  }> {
    return client.delete(`/miniprogram/assets/task/${taskId}`)
  },
}
