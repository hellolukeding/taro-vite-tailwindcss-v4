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
    return client.get('/miniprogram/recharge/packages')
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
    return client.post('/miniprogram/recharge/create-order', params)
  },

  /**
   * 查询订单状态
   */
  async getOrderStatus(orderId: string): Promise<{
    order_id: string
    status: string
    paid_at?: string
  }> {
    return client.get(`/miniprogram/recharge/order/${orderId}`)
  },
}
