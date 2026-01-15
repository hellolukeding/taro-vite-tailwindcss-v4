import { useContext } from 'react'
import Taro from '@tarojs/taro'
import { UserContext } from '@/store/user'

/**
 * 权限控制 Hook
 * 提供登录检查和登录弹窗功能
 */
export const useAuth = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useAuth must be used within UserProvider')
  }

  const { isLogin, loading } = context

  /**
   * 检查登录状态,未登录则显示登录弹窗
   * @returns 是否已登录
   */
  const requireLogin = (): boolean => {
    if (loading) return false

    if (!isLogin) {
      Taro.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页
            Taro.navigateTo({
              url: '/packageUser/pages/login/index'
            })
          }
        }
      })
      return false
    }

    return true
  }

  /**
   * 检查登录状态,未登录则直接跳转登录页(用于二级页面)
   * @returns 是否已登录
   */
  const requireLoginRedirect = (): boolean => {
    if (loading) return false

    if (!isLogin) {
      Taro.redirectTo({
        url: '/packageUser/pages/login/index'
      })
      return false
    }

    return true
  }

  return {
    isLogin,
    loading,
    requireLogin,
    requireLoginRedirect
  }
}
