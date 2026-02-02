/**
 * 支付相关API
 */
import client from './client'
import type { Package } from '@/types'

export const paymentApi = {
  /**
   * 获取充值套餐列表
   */
  async getPackages(): Promise<Package[]> {
    const response = await client.get<any>('/miniprogram/recharge/packages', {}, { returnFullResponse: true })
    // 手动处理解包，避免双重解包问题
    return response.success ? response.data : response
  },

  /**
   * 创建充值订单
   */
  async createOrder(params: {
    package_id: string
    quantity?: number
  }): Promise<{
    order_id: string
    payment_params: {
      timeStamp: string
      nonceStr: string
      package: string
      signType: string
      paySign: string
    }
  }> {
    const response = await client.post<any>('/miniprogram/recharge/create-order', params, { returnFullResponse: true })
    // 手动处理解包，避免双重解包问题
    const data = response.success ? response.data : response
    return data
  },

  /**
   * 查询订单状态
   */
  async getOrderStatus(orderId: string): Promise<{
    order_id: string
    status: string
    paid_at?: string
  }> {
    const response = await client.get<any>(`/miniprogram/recharge/order/${orderId}`, {}, { returnFullResponse: true })
    // 手动处理解包，避免双重解包问题
    const data = response.success ? response.data : response
    return data
  },

  /**
   * 获取订单列表（充值记录和消费记录）
   */
  async getOrders(params?: {
    page?: number
    page_size?: number
    type?: 'recharge' | 'consume' | 'all'
  }): Promise<{
    items: Array<{
      id: string
      order_id: string
      type: 'recharge' | 'consume'
      amount: number
      balance_after: number
      description: string
      created_at: string
      status: string
      // 充值订单特有字段
      package_name?: string
      credits?: number
      bonus?: number
      is_vip?: boolean
      vip_days?: number
      amount_rmb?: number
      payment_method?: string
      paid_at?: string
      // 消费记录特有字段
      ref_id?: string
      task_info?: {
        task_id: string
        task_type: string
      }
      transaction_type?: string
    }>
    total: number
    page: number
    page_size: number
    has_more: boolean
  }> {
    const response = await client.get<any>('/miniprogram/recharge/orders', params, { returnFullResponse: true })
    const data = response.success ? response.data : response
    return data
  },
}
