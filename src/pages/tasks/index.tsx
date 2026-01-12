import { BottomNav } from '@/components/business/BottomNav'
import { TaskCard } from '@/components/business/TaskCard'
import { Icon } from '@/components/common/Icon'
import { mockTasks } from '@/mock/tasks'
import { mockUser } from '@/mock/user'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import { useState } from 'react'
import './index.css'

type TabType = 'all' | 'public' | 'favorites'

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  return (
    <View className='page'>
      {/* 顶部栏 */}
      <View className='top-bar'>
        <View className='spacer' />
        <View className='icon-btn'>
          <Icon name='settings' size={26} />
        </View>
      </View>

      {/* 用户信息区 */}
      <View className='user-section'>
        {/* 头像 */}
        <View className='avatar-wrapper'>
          <View className='avatar-container'>
            <Image src={mockUser.avatar} className='avatar' mode='aspectFill' />
          </View>
          {/* PRO会员徽章 */}
          {mockUser.isVIP && (
            <View className='vip-badge'>
              <Text className='vip-text'>PRO会员</Text>
            </View>
          )}
        </View>

        {/* 用户信息 */}
        <View className='user-info'>
          <Text className='user-name'>{mockUser.nickname}</Text>
          <View className='user-id-row'>
            <Text className='user-id'>ID: {mockUser.userId}</Text>
            <Icon name='content_copy' size={14} />
          </View>
        </View>
        <Icon name='chevron_right' size={20} />
      </View>

      {/* 积分卡片 */}
      <View className='credits-card'>
        {/* 装饰光晕 */}
        <View className='glow-1' />
        <View className='glow-2' />

        {/* 当前积分区 */}
        <View className='credits-top'>
          <View>
            <View className='credits-label'>
              <Icon name='bolt' size={16} color='#FBBF24' />
              <Text className='label-text'>当前积分</Text>
            </View>
            <Text className='credits-amount'>{mockUser.credits.toLocaleString()}</Text>
          </View>
          <View className='recharge-btn'>
            <Icon name='add' size={14} />
            <Text>立即充值</Text>
          </View>
        </View>

        {/* 统计信息 */}
        <View className='stats-row'>
          <View className='stat-item'>
            <View className='stat-dot' />
            <Text>今日消耗: {mockUser.todayCost}</Text>
          </View>
          <View className='stat-item'>
            <View className='stat-dot' />
            <Text>累积创作: {mockUser.totalWorks} 张</Text>
          </View>
        </View>
      </View>

      {/* Tab导航 */}
      <View className='tab-nav'>
        <View
          onClick={() => setActiveTab('all')}
          className={'tab ' + (activeTab === 'all' ? 'tab-active' : '')}
        >
          <Text>全部任务</Text>
        </View>
        <View
          onClick={() => setActiveTab('public')}
          className={'tab ' + (activeTab === 'public' ? 'tab-active' : '')}
        >
          <Text>已公开</Text>
        </View>
        <View
          onClick={() => setActiveTab('favorites')}
          className={'tab ' + (activeTab === 'favorites' ? 'tab-active' : '')}
        >
          <Text>我的收藏</Text>
        </View>
        <Icon name='filter_list' size={20} />
      </View>

      {/* 任务网格 */}
      <ScrollView scrollY className='tasks-content'>
        <View className='tasks-grid'>
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomNav />
    </View>
  )
}
