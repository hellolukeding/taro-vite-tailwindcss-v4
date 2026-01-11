import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'
import { TaskCard } from '@/components/business/TaskCard'
import { BottomNav } from '@/components/business/BottomNav'
import { mockUser } from '@/mock/user'
import { mockTasks } from '@/mock/tasks'
import { useState } from 'react'
import './index.css'

type TabType = 'all' | 'public' | 'favorites'

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  return (
    <View className='bg-white min-h-screen pb-24'>
      {/* 顶部栏 */}
      <View className='flex justify-between items-center px-6 pt-6 pb-2'>
        <View className='w-8' />
        <View className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors'>
          <Icon name='settings' size={26} />
        </View>
      </View>

      {/* 用户信息区 */}
      <View className='px-6 mb-8 flex items-center gap-5'>
        {/* 头像 */}
        <View className='relative group cursor-pointer'>
          <View className='w-[84px] h-[84px] rounded-full overflow-hidden border border-gray-100 p-1 bg-white shadow-sm'>
            <Image
              src={mockUser.avatar}
              className='w-full h-full object-cover rounded-full'
              mode='aspectFill'
            />
          </View>
          {/* PRO会员徽章 */}
          {mockUser.isVIP && (
            <View className='absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm'>
              PRO会员
            </View>
          )}
        </View>

        {/* 用户信息 */}
        <View className='flex-1'>
          <View className='flex items-center justify-between'>
            <View>
              <Text className='text-xl font-bold text-gray-900 mb-1'>{mockUser.nickname}</Text>
              <View className='flex items-center gap-2'>
                <Text className='text-xs text-gray-400 font-mono tracking-wide'>
                  ID: {mockUser.userId}
                </Text>
                <View className='text-gray-400 hover:text-black transition-colors'>
                  <Icon name='content_copy' size={14} />
                </View>
              </View>
            </View>
            <Icon name='chevron_right' size={20} className='text-gray-400' />
          </View>
        </View>
      </View>

      {/* 积分卡片 */}
      <View className='px-5 mb-8'>
        <View className='bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-gray-200'>
          {/* 装饰光晕 */}
          <View className='absolute top-[-40px] right-[-20px] w-40 h-40 bg-gray-700/20 rounded-full blur-3xl pointer-events-none' />
          <View className='absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-gray-600/10 rounded-full blur-2xl pointer-events-none' />

          {/* 当前积分区 */}
          <View className='relative z-10 flex justify-between items-center'>
            <View>
              <View className='flex items-center gap-1.5 mb-2 opacity-80'>
                <Icon name='bolt' size={16} color='#FBBF24' filled />
                <Text className='text-gray-300 text-xs font-medium tracking-wide'>当前积分</Text>
              </View>
              <Text className='text-[32px] font-bold text-white tracking-tight leading-none'>
                {mockUser.credits.toLocaleString()}
              </Text>
            </View>
            <View className='bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold shadow-lg hover:bg-gray-100 active:scale-95 transition-transform flex items-center gap-1'>
              <Icon name='add' size={14} />
              立即充值
            </View>
          </View>

          {/* 统计信息 */}
          <View className='mt-5 pt-4 border-t border-white/10 flex gap-6 text-[11px] text-gray-400 font-medium'>
            <View className='flex items-center gap-1'>
              <View className='w-1 h-1 rounded-full bg-gray-500' />
              <Text>今日消耗: {mockUser.todayCost}</Text>
            </View>
            <View className='flex items-center gap-1'>
              <View className='w-1 h-1 rounded-full bg-gray-500' />
              <Text>累积创作: {mockUser.totalWorks} 张</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab导航 */}
      <View className='sticky top-0 bg-white/95 backdrop-blur-md z-30 px-6 border-b border-gray-100'>
        <View className='flex items-center justify-between'>
          <View className='flex items-center gap-8'>
            <View
              onClick={() => setActiveTab('all')}
              className={`py-3 text-[15px] font-bold relative top-[1.5px] cursor-pointer ${
                activeTab === 'all' ? 'text-black border-b-[3px] border-black' : 'text-gray-400'
              }`}
            >
              全部任务
            </View>
            <View
              onClick={() => setActiveTab('public')}
              className={`py-3 text-[15px] font-medium cursor-pointer ${
                activeTab === 'public' ? 'text-black border-b-[3px] border-black' : 'text-gray-400'
              }`}
            >
              已公开
            </View>
            <View
              onClick={() => setActiveTab('favorites')}
              className={`py-3 text-[15px] font-medium cursor-pointer ${
                activeTab === 'favorites' ? 'text-black border-b-[3px] border-black' : 'text-gray-400'
              }`}
            >
              我的收藏
            </View>
          </View>
          <Icon name='filter_list' size={20} className='text-gray-400' />
        </View>
      </View>

      {/* 任务网格 */}
      <ScrollView scrollY className='p-4 min-h-[400px]'>
        <View className='grid grid-cols-2 gap-3'>
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomNav activeTab='profile' />
    </View>
  )
}
