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
      // 2. 构建完整URL，确保格式正确
      let fullUrl = `${this.baseURL}${url}`

      // 移除可能出现的双斜杠问题（避免 https://...//api/...）
      fullUrl = fullUrl.replace(/([^:])\/\//g, '$1/')

      console.log('[API Request] Full URL:', fullUrl)

      // 3. 发起请求
      const response = await Taro.request({
        url: fullUrl,
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
      // 统一响应格式: { success: true, data: {...} }
      // 中间件会自动包装所有API响应（除了排除的路径如登录、验证码等）
      if (responseData && typeof responseData === 'object') {
        // 检查是否是统一响应格式
        if ('success' in responseData && 'data' in responseData) {
          // 标准响应格式: { success: true, data: {...} }
          return returnFullResponse ? responseData : responseData.data
        } else if (responseData?.token || responseData?.user_info || responseData?.access_token) {
          // 特殊处理未包装的登录接口响应(登录接口在中间件排除列表中)
          // 这些接口直接返回 { token, user_info } 或 { access_token, refresh_token }
          return returnFullResponse ? { success: true, data: responseData } : responseData
        } else if (!responseData?.error?.message && !responseData?.detail && statusCode < 400) {
          // 兼容旧的直接返回数据格式（HTTP状态码<400且无error字段）
          // 这种情况可能发生在：
          // 1. 排除路径之外的接口但还未使用中间件
          // 2. 某些特殊响应格式
          return responseData
        }
      }

      // 6. 处理错误响应
      const errorMsg = responseData?.error?.message || responseData?.detail || '请求失败'

      // 检查是否是认证相关错误
      const authErrorKeywords = ['未提供认证Token', '认证失败', '未授权', 'Unauthorized', 'Authentication failed']
      const isAuthError = authErrorKeywords.some(keyword => errorMsg.includes(keyword))

      if (isAuthError) {
        // 认证错误，清除token并跳转登录
        await removeAuthToken()
        Taro.redirectTo({
          url: '/pages/login/index'
        })
        throw new Error('登录已过期,请重新登录')
      }

      if (!skipErrorTip) {
        Taro.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
      }
      throw new Error(errorMsg)
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
