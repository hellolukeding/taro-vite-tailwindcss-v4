/**
 * 协议相关API
 */
import client from './client'

export interface AgreementData {
  title: string
  version: string
  updated_at: string
  content_html: string
}

export const agreementApi = {
  /**
   * 获取协议内容
   * @param agreementType 协议类型: user_agreement | privacy_policy
   */
  async getAgreement(agreementType: 'user_agreement' | 'privacy_policy'): Promise<AgreementData> {
    // 使用 skipAuth: true 因为协议接口不需要认证
    return client.get(`/api/v1/agreements/${agreementType}`, {}, { skipAuth: true })
  },
}
