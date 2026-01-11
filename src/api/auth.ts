/**
 * 认证相关API
 */
import client from './client'
import { setAuthToken, setUserInfo } from '@/utils/storage'
import type { UserInfo, VIPInfo } from '@/types'

export interface WechatLoginParams {
  code: string
  invite_code?: string
}

export interface LoginResponse {
  token: string
  is_new_user: boolean
  user_info: {
    user_id: string
    nickname: string
    avatar_url: string
    role: number
    credits: number
    vip_info: VIPInfo
  }
}

export const authApi = {
  /**
   * 微信登录
   */
  async wechatLogin(params: WechatLoginParams): Promise<LoginResponse> {
    const result = await client.post<LoginResponse>(
      '/miniprogram/wechat-login',
      params,
      { skipAuth: true }
    )

    // 保存Token和用户信息
    await setAuthToken(result.token)

    const userInfo: UserInfo = {
      userId: result.user_info.user_id,
      nickname: result.user_info.nickname,
      avatarUrl: result.user_info.avatar_url,
      role: result.user_info.role,
      credits: result.user_info.credits,
      vipInfo: result.user_info.vip_info,
      inviteCode: result.user_info.invite_code,
    }
    await setUserInfo(userInfo)

    return result
  },

  /**
   * 刷新Token
   */
  async refreshToken(token: string): Promise<{ token: string }> {
    return client.post(
      '/miniprogram/refresh-token',
      { token },
      { skipAuth: true }
    )
  },

  /**
   * 获取用户信息
   */
  async getUserProfile(): Promise<UserInfo> {
    return client.get('/miniprogram/user/profile')
  },
}
