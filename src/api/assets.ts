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
