/**
 * 用户状态管理
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/api'
import { getUserInfo, removeAuthToken, removeUserInfo } from '@/utils/storage'
import type { UserInfo } from '@/types'

interface UserContextType {
  userInfo: UserInfo | null
  isLogin: boolean
  loading: boolean
  login: (code: string, inviteCode?: string) => Promise<void>
  logout: () => void
  refreshUserInfo: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化:从存储恢复用户信息
  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const cachedUser = await getUserInfo()
      if (cachedUser) {
        setUserInfo(cachedUser)
      }
    } catch (error) {
      console.error('Load user info error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (code: string, inviteCode?: string) => {
    const result = await authApi.wechatLogin({ code, invite_code: inviteCode })

    // 保存用户信息到状态
    const userData: UserInfo = {
      userId: result.user_info.user_id,
      nickname: result.user_info.nickname,
      avatarUrl: result.user_info.avatar_url,
      role: result.user_info.role,
      credits: result.user_info.credits,
      vipInfo: result.user_info.vip_info,
    }
    setUserInfo(userData)
  }

  const logout = async () => {
    await removeAuthToken()
    await removeUserInfo()
    setUserInfo(null)
  }

  const refreshUserInfo = async () => {
    try {
      const freshUserInfo = await authApi.getUserProfile()
      setUserInfo(freshUserInfo)
    } catch (error) {
      console.error('Refresh user info error:', error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        userInfo,
        isLogin: !!userInfo,
        loading,
        login,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
