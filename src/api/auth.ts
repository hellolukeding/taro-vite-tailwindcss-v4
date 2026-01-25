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
    nickname: string | null
    avatar_url: string | null
    gender?: string | null
    birthday?: string | null
    industry?: string | null
    tags?: string[] | null
    role: number
    status: number
    credits: number
    vip_info: VIPInfo
    invite_code?: string
    created_at?: string | null
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
    const data = await client.get<{user_id: string, nickname: string | null, avatar_url: string | null, gender?: string | null, birthday?: string | null, industry?: string | null, tags?: string[] | null, role: number, status: number, invite_code?: string | null, credits: number, created_at?: string | null, vip_info: any}>('/miniprogram/user/profile')

    // 字段映射：后端使用下划线命名，前端使用驼峰命名
    return {
      userId: data.user_id,
      nickname: data.nickname,
      avatarUrl: data.avatar_url,
      gender: data.gender,
      birthday: data.birthday,
      industry: data.industry,
      tags: data.tags,
      role: data.role,
      status: data.status,
      inviteCode: data.invite_code || undefined,
      credits: data.credits,
      createdAt: data.created_at,
      vipInfo: data.vip_info,
    }
  },

  /**
   * 获取用户统计数据
   */
  async getUserStats(): Promise<{
    total_works: number
    total_created: number
    total_likes: number
    total_favorites: number
  }> {
    // client.get() 会自动解包 {success, data} 并返回 data
    return client.get('/miniprogram/user/stats')
  },

  /**
   * 更新用户资料
   */
  async updateProfile(params: UpdateProfileParams): Promise<UserInfo> {
    const result = await client.put<{ user_info: {user_id: string, nickname: string | null, avatar_url: string | null, gender?: string | null, birthday?: string | null, industry?: string | null, tags?: string[] | null, role: number, status: number, invite_code?: string | null, credits: number, created_at?: string | null, vip_info: any} }>(
      '/miniprogram/user/profile',
      params
    )
    const data = result.user_info

    // 字段映射：后端使用下划线命名，前端使用驼峰命名
    return {
      userId: data.user_id,
      nickname: data.nickname,
      avatarUrl: data.avatar_url,
      gender: data.gender,
      birthday: data.birthday,
      industry: data.industry,
      tags: data.tags,
      role: data.role,
      status: data.status,
      inviteCode: data.invite_code || undefined,
      credits: data.credits,
      createdAt: data.created_at,
      vipInfo: data.vip_info,
    }
  },
}

export interface UpdateProfileParams {
  nickname?: string
  avatar_url?: string
  gender?: string  // "0": 未知, "1": 男, "2": 女
  birthday?: string  // YYYY-MM-DD
  industry?: string
}
