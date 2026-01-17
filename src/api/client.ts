/**
 * HTTP客户端封装
 */
import { API_BASE_URL } from '@/utils/constants'
import { getAuthToken, removeAuthToken, setAuthToken } from '@/utils/storage'
import Taro from '@tarojs/taro'
import { authApi } from './auth'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  skipAuth?: boolean
  skipErrorTip?: boolean
  returnFullResponse?: boolean  // 是否返回完整响应对象（包含success、data等所有字段）
}

class APIClient {
  private baseURL: string = API_BASE_URL
  private refreshing: boolean = false
  private refreshSubscribers: Array<(token: string) => void> = []

  /**
   * 订阅Token刷新完成
   */
  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb)
  }

  /**
   * Token刷新完成,通知所有订阅者
   */
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach(cb => cb(token))
    this.refreshSubscribers = []
  }

  /**
   * 统一请求方法
   */
  async request<T = any>(options: RequestOptions): Promise<T> {
    const {
      url,
      method = 'GET',
      data,
      header = {},
      skipAuth = false,
      skipErrorTip = false,
      returnFullResponse = false
    } = options

    // 1. 添加认证Token
    if (!skipAuth) {
      const token = await getAuthToken()
      console.log('[API Request] URL:', url, 'Has Token:', !!token)
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      } else {
        console.warn('[API Request] No token found, user might not be logged in')
      }
    }

    try {
      // 2. 发起请求
      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...header
        }
      })

      const { statusCode, data: responseData } = response

      // 3. 处理401 - Token过期
      if (statusCode === 401) {
        if (this.refreshing) {
          // Token正在刷新,等待刷新完成
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh(async () => {
              try {
                const result = await this.request<T>({ ...options })
                resolve(result)
              } catch (error) {
                reject(error)
              }
            })
          })
        } else {
          // 开始刷新Token
          this.refreshing = true
          try {
            await this.refreshToken()
            this.refreshing = false
            // 重试原请求
            return this.request<T>(options)
          } catch (error) {
            this.refreshing = false
            // Token刷新失败,清除本地数据并跳转登录
            await removeAuthToken()
            Taro.redirectTo({
              url: '/pages/login/index'
            })
            throw new Error('登录已过期,请重新登录')
          }
        }
      }

      // 4. 处理其他HTTP错误
      if (statusCode >= 400) {
        const errorMsg = responseData?.error?.message || '请求失败'
        if (!skipErrorTip) {
          Taro.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
        throw new Error(errorMsg)
      }

      // 5. 返回业务数据
      // 兼容直接返回数据对象的情况(后端未包装success字段)
      if (responseData?.success) {
        return returnFullResponse ? responseData : responseData.data
      } else if (responseData?.token || responseData?.user_info) {
        // 特殊处理登录接口: 如果没有success字段但包含关键登录信息，视为成功
        return returnFullResponse ? { success: true, data: responseData } : responseData
      } else {
        const errorMsg = responseData?.error?.message || responseData?.detail || '请求失败'
        if (!skipErrorTip) {
          Taro.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
        throw new Error(errorMsg)
      }
    } catch (error: any) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  /**
   * 刷新Token
   */
  private async refreshToken(): Promise<void> {
    try {
      const oldToken = await getAuthToken()
      if (!oldToken) {
        throw new Error('No token to refresh')
      }

      // 调用刷新接口
      const { token } = await authApi.refreshToken(oldToken)

      // 保存新Token
      await setAuthToken(token)

      // 通知所有等待的请求
      this.onTokenRefreshed(token)
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({ url, method: 'GET', data, ...options })
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({ url, method: 'POST', data, ...options })
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({ url, method: 'PUT', data, ...options })
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, data?: any, options?: Partial<RequestOptions>) {
    return this.request<T>({ url, method: 'DELETE', data, ...options })
  }
}

export default new APIClient()
