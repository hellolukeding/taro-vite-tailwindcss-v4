/**
 * 创作工作台相关API
 */
import type { ModelInfo, TaskStatus, TaskSubmitParams } from '@/types'
import client from './client'

export interface RandomPrompt {
  prompt: string
  category?: string
}

export interface TaskEstimate {
  estimated_cost: number
  estimated_time: number
  user_credits: number
  can_afford: boolean
}

export const studioApi = {
  /**
   * 获取可用模型列表
   */
  async getModels(isActive?: boolean): Promise<ModelInfo[]> {
    return client.get('/miniprogram/studio/models', { is_active: isActive })
  },

  /**
   * 获取随机提示词灵感
   */
  async getRandomPrompt(category?: string): Promise<RandomPrompt> {
    return client.get('/miniprogram/studio/random-prompt', { category })
  },

  /**
   * 提示词翻译
   * @param prompt 待翻译文本
   * @param source 源语言: auto=自动检测, zh=中文, en=英文, ja=日文
   * @param target 目标语言: zh=中文, en=英文, ja=日文
   * @param withSuggestions 是否返回优化建议
   */
  async translate(
    prompt: string,
    source: string = 'auto',
    target: string = 'en',
    withSuggestions: boolean = false
  ): Promise<{
    success: boolean
    original_text: string
    translated_text: string
    source_language: string
    target_language: string
    suggestions?: Array<{
      type: string
      label: string
      prompt: string
    }>
  }> {
    return client.post('/miniprogram/studio/translate', {
      prompt,
      source,
      target,
      with_suggestions: withSuggestions
    })
  },

  /**
   * 估算任务成本
   */
  async estimate(params: {
    model_id: string
    prompt: string
    parameters: {
      width: number
      height: number
      steps?: number
    }
  }): Promise<TaskEstimate> {
    return client.post('/miniprogram/studio/estimate', params)
  },

  /**
   * 提交生图任务
   */
  async submitTask(params: TaskSubmitParams): Promise<{
    task_id: string
    status: string
    message: string
  }> {
    return client.post('/miniprogram/studio/submit', params)
  },

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    return client.get(`/miniprogram/studio/task/${taskId}`)
  },

  /**
   * 获取提示词标签分类列表
   */
  async getCategories(): Promise<string[]> {
    return client.get('/miniprogram/studio/categories', {}, { skipAuth: true })
  },

  /**
   * 获取提示词列表
   */
  async getPrompts(params?: {
    tag?: string
    keyword?: string
    page?: number
    page_size?: number
  }): Promise<{
    success: boolean
    data: Array<{
      id: string
      title: string
      cover_image: string | null
      tags: string[]
      model: string
      description: string | null
      views_count: number
      likes_count: number
      favorites_count: number
      creator: {
        user_id: string
        nickname: string | null
        avatar_url: string | null
      }
    }>
    total: number
    page: number
    page_size: number
    has_more: boolean
  }> {
    return client.get('/miniprogram/studio/prompts', params, { skipAuth: true, returnFullResponse: true })
  },

}
