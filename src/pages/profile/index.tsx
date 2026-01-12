import { ScrollView, Image, Text, View } from '@tarojs/components'
import { useState } from 'react'
import CommonWarp from '@/components/CommonWarp'
import { TaskCard } from '@/components/business/TaskCard'
import { Icon } from '@/components/common/Icon'
import { mockTasks } from '@/mock/tasks'
import { mockUser } from '@/mock/user'
import Taro from '@tarojs/taro'

type TabType = 'all' | 'public' | 'favorites'

interface ProfileProps { }

const Profile: React.FC<ProfileProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  // 根据 tab 过滤任务
  const filteredTasks = mockTasks.filter((task) => {
    if (activeTab === 'all') return true
    if (activeTab === 'public') return task.status === 'public'
    if (activeTab === 'favorites') return task.status === 'private'
    return true
  })

  return (
    <CommonWarp title='我的' withHeader={false}>
      <View className='w-full h-full bg-white flex flex-col'>
        {/* 顶部栏 */}
        <View className='flex justify-between items-center px-6 pt-6 pb-2'>
          <View className='w-8' />
          <View
            onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}
            className='w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100'
          >
            <Icon name='settings' size={20} />
          </View>
        </View>

        <ScrollView scrollY className='flex-1'>
          {/* 用户信息区 */}
          <View className='px-6 mb-8 flex items-center gap-5'>
            {/* 头像 */}
            <View className='relative'>
              <View className='w-[84px] h-[84px] rounded-full overflow-hidden border border-gray-100 p-1 bg-white shadow-sm'>
                <Image
                  src={mockUser.avatar}
                  className='w-full h-full rounded-full'
                  mode='aspectFill'
                />
              </View>
              {/* PRO会员徽章 */}
              {mockUser.isVIP && (
                <View className='absolute -bottom-1 -right-1 bg-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm'>
                  <Text className='text-[10px] font-bold text-white'>PRO会员</Text>
                </View>
              )}
            </View>

            {/* 用户信息 */}
            <View className='flex-1'>
              <View className='flex items-center justify-between'>
                <View>
                  <Text className='text-xl font-bold text-gray-900 mb-1'>{mockUser.nickname}</Text>
                  <View className='flex items-center gap-2'>
                    <Text className='text-xs text-gray-400 font-mono tracking-wide'>ID: {mockUser.userId}</Text>
                    <View
                      onClick={() => {
                        Taro.setClipboardData({ data: mockUser.userId })
                        Taro.showToast({ title: '已复制', icon: 'success' })
                      }}
                      className='active:opacity-70'
                    >
                      <Icon name='content_copy' size={14} />
                    </View>
                  </View>
                </View>
                <Icon name='chevron_right' size={20} color='#9CA3AF' />
              </View>
            </View>
          </View>

          {/* 积分卡片 */}
          <View className='px-5 mb-8'>
            <View className='bg-linear-to-br from-gray-900 to-black rounded-3xl p-6 relative overflow-hidden shadow-xl'>
              {/* 装饰光晕 */}
              <View className='absolute -top-10 -right-5 w-40 h-40 bg-gray-700/20 rounded-full blur-3xl pointer-events-none' />
              <View className='absolute -bottom-5 -left-5 w-32 h-32 bg-gray-600/10 rounded-full blur-2xl pointer-events-none' />

              {/* 当前积分区 */}
              <View className='relative z-10 flex justify-between items-center'>
                <View>
                  <View className='flex items-center gap-1.5 mb-2 opacity-80'>
                    <Icon name='bolt' size={16} color='#FBBF24' />
                    <Text className='text-gray-300 text-xs font-medium tracking-wide'>当前积分</Text>
                  </View>
                  <Text className='text-[32px] font-bold text-white tracking-tight leading-none'>{mockUser.credits.toLocaleString()}</Text>
                </View>
                <View className='flex items-center gap-1 bg-white text-black px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform'>
                  <Icon name='add' size={14} />
                  <Text className='text-xs font-bold'>立即充值</Text>
                </View>
              </View>

              {/* 统计信息 */}
              <View className='mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2'>
                <View>
                  <Text className='text-[11px] text-gray-500 font-medium mb-1'>获赞</Text>
                  <Text className='text-[15px] font-bold text-white leading-none'>{mockUser.likes}</Text>
                </View>
                <View>
                  <Text className='text-[11px] text-gray-500 font-medium mb-1'>收藏</Text>
                  <Text className='text-[15px] font-bold text-white leading-none'>{mockUser.favorites}</Text>
                </View>
                <View>
                  <Text className='text-[11px] text-gray-500 font-medium mb-1'>累计创作</Text>
                  <Text className='text-[15px] font-bold text-white leading-none'>
                    {mockUser.totalWorks}
                    <Text className='text-[11px] font-normal text-gray-500 ml-0.5'>张</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tab导航 */}
          <View className='sticky top-0 bg-white/95 backdrop-blur-md z-30 px-6 border-b border-gray-100 flex items-center justify-between'>
            <View className='flex items-center gap-8'>
              <View
                onClick={() => setActiveTab('all')}
                className={`py-3 text-[15px] ${
                  activeTab === 'all' ? 'font-bold text-black border-b-[3px] border-black' : 'font-medium text-gray-400'
                }`}
              >
                <Text>全部任务</Text>
              </View>
              <View
                onClick={() => setActiveTab('public')}
                className={`py-3 text-[15px] ${
                  activeTab === 'public' ? 'font-bold text-black border-b-[3px] border-black' : 'font-medium text-gray-400'
                }`}
              >
                <Text>已公开</Text>
              </View>
              <View
                onClick={() => setActiveTab('favorites')}
                className={`py-3 text-[15px] ${
                  activeTab === 'favorites' ? 'font-bold text-black border-b-[3px] border-black' : 'font-medium text-gray-400'
                }`}
              >
                <Text>我的收藏</Text>
              </View>
            </View>
            <Icon name='filter_list' size={20} />
          </View>

          {/* 任务网格 */}
          <View className='grid grid-cols-2 gap-3 px-4 pb-4'>
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        </ScrollView>
      </View>
    </CommonWarp>
  )
}

export default Profile
