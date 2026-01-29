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
}
