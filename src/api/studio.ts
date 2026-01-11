/**
 * 创作工作台相关API
 */
import client from './client'
import type { ModelInfo, TaskStatus, TaskSubmitParams } from '@/types'

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
   */
  async translate(prompt: string): Promise<{
    original: string
    translated: string
    suggestions: string[]
  }> {
    return client.post('/miniprogram/studio/translate', { prompt })
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
}
