/**
 * 广场相关API
 */
import client from './client'
import type { WorkItem, WorkDetail, Category } from '@/types'

export interface SquareFeedParams {
  limit?: number
  offset?: number
  category?: string
  sort?: 'hot' | 'latest'
  keyword?: string
}

export interface SquareFeedResponse {
  total: number
  has_more: boolean
  items: WorkItem[]
}

export const squareApi = {
  /**
   * 获取广场Feed流
   */
  async getFeed(params: SquareFeedParams): Promise<SquareFeedResponse> {
    return client.get('/miniprogram/square/feed', params)
  },

  /**
   * 获取作品详情
   */
  async getWorkDetail(taskId: string): Promise<WorkDetail> {
    return client.get(`/miniprogram/square/work/${taskId}`)
  },

  /**
   * 点赞/取消点赞作品
   */
  async toggleLike(taskId: string, action: 'toggle' | 'like' | 'unlike' = 'toggle'): Promise<{
    liked: boolean
    likes_count: number
  }> {
    return client.post(`/miniprogram/square/work/${taskId}/like`, { action })
  },

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<Category[]> {
    return client.get('/miniprogram/square/categories')
  },

  /**
   * 收藏/取消收藏作品
   */
  async toggleFavorite(taskId: string): Promise<{
    task_id: string
    is_favorited: boolean
    action: 'favorited' | 'unfavorited'
    favorites_count: number
  }> {
    return client.post(`/miniprogram/square/work/${taskId}/favorite`)
  },
}
