/**
 * 评论相关API
 */
import client from './client'

export interface CommentItem {
  comment_id: string
  task_id: string
  user_id: string
  user_nickname: string
  user_avatar: string
  content: string
  parent_id?: string
  likes_count: number
  is_liked: boolean
  created_at: string
  replies?: CommentItem[]
}

export const commentsApi = {
  /**
   * 获取作品评论列表
   */
  async getComments(taskId: string, params?: {
    limit?: number
    offset?: number
  }): Promise<{
    total: number
    has_more: boolean
    items: CommentItem[]
  }> {
    return client.get(`/miniprogram/comments`, { task_id: taskId, ...params })
  },

  /**
   * 发表评论
   */
  async postComment(taskId: string, content: string, parentId?: string): Promise<{
    comment_id: string
    message: string
  }> {
    return client.post(`/miniprogram/comments`, {
      task_id: taskId,
      content,
      parent_id: parentId,
    })
  },

  /**
   * 删除评论
   */
  async deleteComment(commentId: string): Promise<{
    success: boolean
    message: string
  }> {
    return client.delete(`/miniprogram/comments/${commentId}`)
  },

  /**
   * 点赞/取消点赞评论
   */
  async likeComment(commentId: string): Promise<{
    liked: boolean
    likes_count: number
  }> {
    return client.post(`/miniprogram/comments/${commentId}/like`)
  },

  /**
   * 回复评论
   */
  async replyComment(commentId: string, content: string): Promise<{
    comment_id: string
    message: string
  }> {
    return client.post(`/miniprogram/comments/${commentId}/reply`, { content })
  },

  /**
   * 举报评论
   */
  async reportComment(commentId: string, reason: string): Promise<{
    success: boolean
    message: string
  }> {
    return client.post(`/miniprogram/comments/${commentId}/report`, { reason })
  },
}
