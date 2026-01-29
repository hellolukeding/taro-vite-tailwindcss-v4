import CommonHeader from '@/components/CommonHeader'
import CommonWarp from '@/components/CommonWarp'
import { EmptyState } from '@/components/EmptyState'
import { Icon } from '@/components/common/Icon'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/store'
import { generateAvatarUrl } from '@/utils/constants'
import { normalizeUrl } from '@/utils/url'
import { Button } from '@taroify/core'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'

const UserDetail: React.FC = () => {
  const { isLogin, loading } = useAuth()
  const { userInfo, refreshUserInfo, logout } = useUser()
  const [refreshing, setRefreshing] = useState(false)
  const hasLoaded = useRef(false)

  // 恢复自动加载 - 只在首次挂载时执行
  useEffect(() => {
    if (isLogin && !hasLoaded.current) {
      console.log('[UserDetail] First mount, loading user info')
      loadUserInfo()
      hasLoaded.current = true
    }
  }, [isLogin])

  const loadUserInfo = async () => {
    if (refreshing) return
    setRefreshing(true)
    try {
      await refreshUserInfo()
    } catch (error) {
      console.error('Load user info error:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // 处理登录按钮点击
  const handleLogin = () => {
    Taro.navigateTo({
      url: '/packageUser/pages/login/index'
    })
  }

  // 处理编辑资料
  const handleEditProfile = () => {
    Taro.navigateTo({
      url: '/pages/profile-edit/index'
    })
  }

  // 处理工单
  const handleTickets = () => {
    Taro.navigateTo({
      url: '/packageUser/pages/tickets/index'
    })
  }

  // 处理测试页面（仅开发环境）
  const handleTestPage = () => {
    Taro.navigateTo({
      url: '/pages/test/index'
    })
  }

  // 处理复制邀请码
  const handleCopyInviteCode = () => {
    const inviteCode = userInfo?.inviteCode
    if (!inviteCode) {
      Taro.showToast({
        title: '邀请码不存在',
        icon: 'none'
      })
      return
    }

    // 复制到剪贴板
    Taro.setClipboardData({
      data: inviteCode,
      success: () => {
        Taro.showToast({
          title: '邀请码已复制',
          icon: 'success'
        })
      },
      fail: () => {
        Taro.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  }

  // 处理退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout()
            Taro.showToast({
              title: '已退出登录',
              icon: 'success'
            })
            // 跳转到首页
            setTimeout(() => {
              Taro.switchTab({
                url: '/pages/index/index'
              })
            }, 1500)
          } catch (error) {
            console.error('Logout error:', error)
            Taro.showToast({
              title: '退出失败',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  // 未登录显示空状态
  if (!loading && !isLogin) {
    return <EmptyState type='profile' onLogin={handleLogin} />
  }

  // 加载中
  if (loading) {
    return (
      <View className='w-full h-full flex items-center justify-center'>
        <Text>加载中...</Text>
      </View>
    )
  }

  // 格式化性别
  const getGenderText = (gender: string | null | undefined) => {
    if (gender === '1') return '男'
    if (gender === '2') return '女'
    return '未知'
  }

  // 格式化日期为更人性化的显示
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '未设置'

    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      // 如果是今天
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60))
          if (diffMinutes === 0) return '刚刚'
          return `${diffMinutes}分钟前`
        }
        return `${diffHours}小时前`
      }

      // 如果是昨天
      if (diffDays === 1) return '昨天'

      // 如果是7天内
      if (diffDays < 7) return `${diffDays}天前`

      // 如果是30天内
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`

      // 如果是12个月内
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`

      // 超过1年，显示具体日期
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error('Date formatting error:', error)
      return dateStr
    }
  }

  return (
    <CommonWarp title='个人详情' withHeader={false} className='w-screen h-screen'>
      <CommonHeader title='个人详情' withBack>
        <View className='w-full  bg-white pb-20'>
          <ScrollView scrollY className='h-full'>
            {/* 用户头像区域 */}
            <View className='bg-black pt-16 pb-12 px-6 rounded-b-4xl shadow-xl'>
              <View className='flex flex-col items-center'>
                {/* 头像 */}
                <View className='w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4'>
                  <Image
                    src={normalizeUrl(userInfo?.avatarUrl || generateAvatarUrl(userInfo?.nickname))}
                    className='w-full h-full object-cover'
                  />
                </View>

                {/* 昵称 */}
                <Text className='text-white text-2xl font-bold mb-2'>
                  {userInfo?.nickname || '未设置昵称'}
                </Text>

                {/* 用户ID */}
                <Text className='text-gray-400 text-sm'>
                  @{userInfo?.userId || '---'}
                </Text>
              </View>
            </View>

            {/* 详细信息卡片 */}
            <View className='px-4 -mt-6'>
              <View className='bg-white rounded-2xl shadow-lg p-5 space-y-5'>
                {/* 基本信息标题 */}
                <View className='flex items-center gap-2 pb-2 border-b border-gray-100'>
                  <Icon name='person' size={18} color='#000' />
                  <Text className='text-base font-bold'>基本信息</Text>
                </View>

                {/* 性别 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>性别</Text>
                  <Text className='text-gray-900 text-sm font-medium'>
                    {getGenderText(userInfo?.gender)}
                  </Text>
                </View>

                {/* 生日 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>生日</Text>
                  <Text className='text-gray-900 text-sm font-medium'>
                    {formatDate(userInfo?.birthday)}
                  </Text>
                </View>

                {/* 行业 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>行业</Text>
                  <Text className='text-gray-900 text-sm font-medium'>
                    {userInfo?.industry || '未设置'}
                  </Text>
                </View>

                {/* VIP 状态 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>VIP 状态</Text>
                  <View className='flex items-center gap-1'>
                    {userInfo?.vipInfo?.is_vip ? (
                      <Text className='text-yellow-600 text-sm font-bold'>VIP 会员</Text>
                    ) : (
                      <Text className='text-gray-400 text-sm'>普通用户</Text>
                    )}
                  </View>
                </View>

                {/* 积分 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>当前积分</Text>
                  <Text className='text-black text-base font-bold'>
                    {userInfo?.credits?.toLocaleString() || 0}
                  </Text>
                </View>

                {/* 邀请码 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>邀请码</Text>
                  <View className='flex items-center gap-2'>
                    <Text className='text-black text-sm font-medium'>
                      {userInfo?.inviteCode || '---'}
                    </Text>
                    {userInfo?.inviteCode && (
                      <Button
                        size='mini'
                        variant='text'
                        onClick={handleCopyInviteCode}
                      >
                        复制
                      </Button>
                    )}
                  </View>
                </View>

                {/* 注册时间 */}
                <View className='flex justify-between items-center py-2'>
                  <Text className='text-gray-500 text-sm'>注册时间</Text>
                  <Text className='text-gray-900 text-sm font-medium'>
                    {formatDate(userInfo?.createdAt)}
                  </Text>
                </View>
              </View>

              {/* 编辑资料按钮 */}
              <View className='mt-6'>
                <Button
                  shape="round"
                  onClick={handleEditProfile}
                  className='w-full'
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    fontWeight: "medium",
                  }}
                >
                  编辑资料
                </Button>
              </View>

              {/* 工单按钮 */}
              <View className='mt-2 w-full'>
                <Button
                  shape="round"
                  onClick={handleTickets}
                  variant="outlined"
                  className='w-full'
                  style={{
                    fontWeight: "medium",
                  }}
                >
                  我的工单
                </Button>
              </View>

              {/* 测试页面按钮（仅开发环境）
              {process.env.NODE_ENV === 'development' && (
                <View className='mt-2'>
                  <Button
                    shape="round"
                    onClick={handleTestPage}
                    style={{
                      backgroundColor: "#8B5CF6",
                      color: "#fff",
                      fontWeight: "medium",
                    }}
                  >
                    🧪 测试页面
                  </Button>
                </View>
              )} */}

              <View className='mt-2'>
                <Button
                  shape="round"
                  onClick={handleLogout}
                  className='w-full'
                  style={{
                    backgroundColor: "#EF4444",
                    color: "#fff",
                    fontWeight: "medium",
                  }}
                >
                  退出登录
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </CommonHeader>
    </CommonWarp>

  )
}

export default UserDetail
