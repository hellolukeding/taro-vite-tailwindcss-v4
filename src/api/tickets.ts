/**
 * 工单相关API
 */
import client from './client'

export interface CreateTicketParams {
  type: string
  priority?: string
  title: string
  description: string
  related_order_id?: string
  related_task_id?: string
  attachments?: string[]
  subscribe_accepted?: boolean  // 用户是否同意接收工单回复通知
}

export interface Ticket {
  id: number
  ticket_id: string
  user_id: string
  username: string | null
  type: string
  priority: string
  status: string
  title: string
  description: string
  related_order_id: string | null
  related_task_id: string | null
  assigned_to: string | null
  attachments: string[]
  subscribe_accepted: boolean  // 用户是否同意接收工单回复通知
  created_at: string
  updated_at: string
  resolved_at: string | null
  closed_at: string | null
  unread_count: number
}

export interface TicketMessage {
  id: number
  ticket_id: string
  sender_id: string
  sender_name: string | null
  sender_type: string
  message_type: string
  content: string
  attachments: string[]
  is_internal: boolean
  created_at: string
}

export interface TicketDetail {
  ticket: Ticket
  messages: TicketMessage[]
}

export interface GetTicketsParams {
  status?: string
  page?: number
  page_size?: number
}

export const ticketsApi = {
  /**
   * 创建工单
   */
  async createTicket(params: CreateTicketParams): Promise<Ticket> {
    return client.post('/miniprogram/tickets', params)
  },

  /**
   * 更新工单订阅状态
   */
  async updateSubscription(ticketId: string, subscribeAccepted: boolean): Promise<{
    success: boolean
    message: string
  }> {
    return client.patch(`/miniprogram/tickets/${ticketId}/subscription`, {}, {
      params: { subscribe_accepted: subscribeAccepted }
    })
  },

  /**
   * 获取我的工单列表
   */
  async getTickets(params: GetTicketsParams = {}): Promise<{
    total: number
    tickets: Ticket[]
  }> {
    return client.get('/miniprogram/tickets', params)
  },

  /**
   * 获取工单详情
   */
  async getTicketDetail(ticketId: string): Promise<TicketDetail> {
    return client.get(`/miniprogram/tickets/${ticketId}`)
  },

  /**
   * 发送工单消息
   */
  async sendMessage(ticketId: string, params: {
    content: string
    is_internal?: boolean
    attachments?: string[]
  }): Promise<{
    success: boolean
    message: TicketMessage
  }> {
    return client.post(`/miniprogram/tickets/${ticketId}/messages`, params)
  },

  /**
   * 上传工单附件
   */
  async uploadAttachments(ticketId: string, files: File[]): Promise<{
    success: boolean
    attachments: string[]
  }> {
    // TODO: 实现文件上传
    return Promise.resolve({ success: true, attachments: [] })
  },
}
