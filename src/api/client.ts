/**
 * HTTP客户端封装
 */
import Taro from '@tarojs/taro'
import { API_BASE_URL } from '@/utils/constants'
import { getAuthToken, removeAuthToken, setAuthToken } from '@/utils/storage'
import type { ApiResponse } from '@/types'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  skipAuth?: boolean
  skipErrorTip?: boolean
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
      skipErrorTip = false
    } = options

    // 1. 添加认证Token
    if (!skipAuth) {
      const token = await getAuthToken()
      if (token) {
        header['Authorization'] = `Bearer ${token}`
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
      if (responseData?.success) {
        return responseData.data
      } else {
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
    } catch (error: any) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  /**
   * 刷新Token
   */
  private async refreshToken(): Promise<void> {
    // TODO: 实现Token刷新逻辑
    // 暂时直接抛出错误,让用户重新登录
    throw new Error('Token refresh not implemented')
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
