import CommonWarp from '@/components/CommonWarp'
import { InProgressTaskCard } from '@/components/business/InProgressTaskCard'
import { TaskCard } from '@/components/business/TaskCard'
import { EmptyState } from '@/components/EmptyState'
import { Icon } from '@/components/common/Icon'
import { mockInProgressTasks } from '@/mock/inProgressTasks'
import { mockTasks } from '@/mock/tasks'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AssetsProps { }

const Assets: React.FC<AssetsProps> = () => {
  const { isLogin, loading } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  // 处理登录按钮点击
  const handleLogin = () => {
    Taro.navigateTo({
      url: '/packageUser/pages/login/index'
    })
  }

  // 未登录显示空状态
  if (!loading && !isLogin) {
    return <EmptyState type='assets' onLogin={handleLogin} />
  }

  // 加载中
  if (loading) {
    return (
      <View className='w-full h-full flex items-center justify-center'>
        <Text>加载中...</Text>
      </View>
    )
  }

  const handleCancelTask = (_id: string) => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '任务已取消', icon: 'success' })
        }
      }
    })
  }

  return (
    <CommonWarp title='资产' withHeader={false}>
      <View className='w-full h-full bg-white '>

        <View className='bg-black pt-20 pb-8 px-3 rounded-b-4xl shadow-xl relative z-10'>
          {/* Top Bar */}
          <View className='flex justify-between items-center mb-6'>
            <View className='flex items-center gap-2' onClick={() => Taro.navigateBack()}>
              <Icon name='arrow_back_ios' size={20} color='white' />
              <Text className='text-white text-xl font-semibold tracking-wide'>资产中心</Text>
            </View>

          </View>


        </View>

        {/* Header */}
        <View className='sticky top-0 z-50 bg-white border-b border-gray-100'>


          {/* Tabs */}
          <View className='px-4 py-4'>
            <View className='flex p-1 w-full bg-gray-100 rounded-xl relative'>
              {
                (["进行中", "已完成"] as const).map((tabTitle, index) => {
                  return (
                    <View
                      key={tabTitle}
                      className={`flex-1 py-2 text-sm font-bold text-center rounded-lg transition-colors ${activeTab === index ? 'text-white bg-black' : 'text-gray-500'}`}
                      onClick={() => setActiveTab(index)}
                    >
                      <Text>{tabTitle}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView scrollY className='h-full pb-32'>
          {activeTab === 0 ? (
            <View className='px-4 py-4 space-y-4'>
              <Text className='text-xl font-bold px-1 pt-2'>正在绘制</Text>
              {mockInProgressTasks.map((task) => (
                <InProgressTaskCard
                  key={task.id}
                  {...task}
                  onCancel={handleCancelTask}
                />
              ))}
            </View>
          ) : (
            <View className='px-4 py-4 space-y-4'>
              <View className='flex items-center justify-between px-1 pt-2 border-t border-gray-100'>
                <Text className='text-xl font-bold'>已完成</Text>
                <View className='text-xs font-medium text-gray-500 flex items-center gap-0.5'>
                  <Text>批量管理</Text>
                  <Icon name='checklist' size={14} />
                </View>
              </View>

              <View className='grid grid-cols-2 gap-4'>
                {mockTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </CommonWarp>
  )
}

export default Assets
