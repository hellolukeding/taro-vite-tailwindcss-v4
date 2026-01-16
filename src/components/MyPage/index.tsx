import { Button, Card } from '@/components/common'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import React, { useState } from 'react'

interface UserInfo {
  userId: string
  nickname: string
  avatar: string
  role: number
}

interface Stats {
  favorites: number
  created: number
  used: number
}

const MyPage: React.FC = () => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: '123456',
    nickname: '我的账号',
    avatar: '',
    role: 0
  })
  const [stats, setStats] = useState<Stats>({
    favorites: 128,
    created: 45,
    used: 89
  })
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    loadUserInfo()
    loadStats()
  })

  // 加载用户信息
  const loadUserInfo = () => {
    try {
      const user = Taro.getStorageSync('userInfo')
      if (user) {
        setUserInfo({
          userId: user.userId || '123456',
          nickname: user.nickname || '微信用户',
          avatar: user.avatar || '',
          role: user.role || 0
        })
      }
    } catch (error) {
      console.error('Load user info error:', error)
    }
  }

  // 加载统计数据
  const loadStats = async () => {
    try {
      // TODO: 调用API获取统计数据
      console.log('Loading stats...')
      // 模拟数据
      setStats({
        favorites: 128,
        created: 45,
        used: 89
      })
    } catch (error) {
      console.error('Load stats error:', error)
    }
  }

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userInfo')
          Taro.showToast({ title: '已退出', icon: 'success' })
          setTimeout(() => {
            Taro.redirectTo({ url: '/packageUser/pages/login/index' })
          }, 1000)
        }
      }
    })
  }

  // 跳转到我的收藏
  const goToFavorites = () => {
    // TODO: 跳转到收藏页面
    console.log('Go to favorites')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 跳转到创建历史
  const goToCreated = () => {
    // TODO: 跳转到创建历史页面
    console.log('Go to created')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 跳转到使用记录
  const goToUsed = () => {
    // TODO: 跳转到使用记录页面
    console.log('Go to used')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 跳转到设置
  const goToSettings = () => {
    // TODO: 跳转到设置页面
    console.log('Go to settings')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 编辑资料
  const editProfile = () => {
    // TODO: 跳转到编辑资料页面
    console.log('Edit profile')
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  // 获取角色名称
  const getRoleName = (role: number) => {
    const roleNames = ['普通用户', 'VIP会员', '管理员']
    return roleNames[role] || '普通用户'
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* 顶部背景 */}
      <View className='bg-gradient-to-br from-theme-primary to-theme-secondary h-32'></View>

      <ScrollView className='flex-1 -mt-16' scrollY>
        {/* 个人资料卡片 */}
        <Card className='mx-4 mb-4' padding='p-5'>
          <View className='flex items-start justify-between'>
            <View className='flex items-center gap-3 flex-1'>
              <View className='w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm'>
                {userInfo.avatar ? (
                  <View
                    className='w-full h-full bg-cover bg-center'
                    style={{ backgroundImage: `url(${userInfo.avatar})` }}
                  />
                ) : (
                  <Text className='text-xl font-bold text-theme-primary'>
                    {userInfo.nickname.charAt(0)}
                  </Text>
                )}
              </View>
              <View className='flex-1'>
                <Text className='text-lg font-bold text-gray-800 block mb-1'>
                  {userInfo.nickname}
                </Text>
                <View className='flex items-center gap-2'>
                  <Text className='text-xs text-gray-500'>ID: {userInfo.userId}</Text>
                  <View className='px-2 py-0.5 bg-theme-primary/10 rounded-full'>
                    <Text className='text-xs text-theme-primary font-medium'>
                      {getRoleName(userInfo.role)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Button
              type='outline'
              size='small'
              onClick={editProfile}
              className='px-3 py-1.5'
            >
              编辑
            </Button>
          </View>
        </Card>

        {/* 统计数据 */}
        <Card className='mx-4 mb-4' padding='p-4'>
          <View className='flex justify-between'>
            <View
              className='flex-1 text-center active:opacity-70'
              onClick={goToFavorites}
            >
              <Text className='text-2xl font-bold text-theme-primary block mb-1'>
                {stats.favorites}
              </Text>
              <Text className='text-xs text-gray-500'>收藏</Text>
            </View>
            <View
              className='flex-1 text-center border-l border-gray-100 active:opacity-70'
              onClick={goToCreated}
            >
              <Text className='text-2xl font-bold text-theme-secondary block mb-1'>
                {stats.created}
              </Text>
              <Text className='text-xs text-gray-500'>创建</Text>
            </View>
            <View
              className='flex-1 text-center border-l border-gray-100 active:opacity-70'
              onClick={goToUsed}
            >
              <Text className='text-2xl font-bold text-theme-tertiary block mb-1'>
                {stats.used}
              </Text>
              <Text className='text-xs text-gray-500'>使用</Text>
            </View>
          </View>
        </Card>

        {/* 功能列表 */}
        <View className='mx-4 mb-4'>
          <Card padding='p-0' className='overflow-hidden'>
            <View
              className='flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50'
              onClick={goToFavorites}
            >
              <View className='flex items-center gap-3'>
                <Text className='text-lg'>❤️</Text>
                <Text className='text-gray-800 font-medium'>我的收藏</Text>
              </View>
              <Text className='text-gray-400'>查看全部</Text>
            </View>

            <View
              className='flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50'
              onClick={goToCreated}
            >
              <View className='flex items-center gap-3'>
                <Text className='text-lg'>📝</Text>
                <Text className='text-gray-800 font-medium'>创建历史</Text>
              </View>
              <Text className='text-gray-400'>查看全部</Text>
            </View>

            <View
              className='flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50'
              onClick={goToUsed}
            >
              <View className='flex items-center gap-3'>
                <Text className='text-lg'>✨</Text>
                <Text className='text-gray-800 font-medium'>使用记录</Text>
              </View>
              <Text className='text-gray-400'>查看全部</Text>
            </View>

            <View
              className='flex items-center justify-between p-4 active:bg-gray-50'
              onClick={goToSettings}
            >
              <View className='flex items-center gap-3'>
                <Text className='text-lg'>⚙️</Text>
                <Text className='text-gray-800 font-medium'>设置</Text>
              </View>
              <Text className='text-gray-400'>→</Text>
            </View>
          </Card>
        </View>

        {/* 其他功能 */}
        <View className='mx-4 mb-4'>
          <Card padding='p-0' className='overflow-hidden'>
            <View className='flex items-center justify-between p-4 active:bg-gray-50'>
              <View className='flex items-center gap-3'>
                <Text className='text-lg'>👥</Text>
                <Text className='text-gray-800 font-medium'>邀请好友</Text>
              </View>
              <Text className='text-gray-400'>赚取奖励</Text>
            </View>
          </Card>
        </View>

        {/* 退出登录 */}
        <View className='mx-4 mb-8'>
          <Button
            type='outline'
            block
            onClick={handleLogout}
            className='border-red-500 text-red-500'
          >
            退出登录
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default MyPage
