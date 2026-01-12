import CommonWarp from '@/components/CommonWarp'
import { InProgressTaskCard } from '@/components/business/InProgressTaskCard'
import { TaskCard } from '@/components/business/TaskCard'
import { Icon } from '@/components/common/Icon'
import { mockInProgressTasks } from '@/mock/inProgressTasks'
import { mockTasks } from '@/mock/tasks'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'

interface AssetsProps { }

const Assets: React.FC<AssetsProps> = () => {
  const [activeTab, setActiveTab] = useState(0)

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
    <CommonWarp title='资产' withHeader>
      <View className='w-full h-full bg-white'>
        {/* Header */}
        <View className='sticky top-0 z-50 bg-white border-b border-gray-100'>


          {/* Tabs */}
          <View className='px-4 py-4'>
            <View className='flex p-1 bg-gray-100 rounded-xl relative'>
              <View
                className={`w-1/2 bg-black rounded-lg shadow-sm absolute top-1 bottom-1 transition-all ${activeTab === 0 ? 'left-1' : 'left-1/2'
                  }`}
              />
              <View
                onClick={() => setActiveTab(0)}
                className={`relative z-10 flex-1 py-2 text-sm font-bold text-center rounded-lg transition-colors ${activeTab === 0 ? 'text-white' : 'text-gray-500'
                  }`}
              >
                进行中 ({mockInProgressTasks.length})
              </View>
              <View
                onClick={() => setActiveTab(1)}
                className={`relative z-10 flex-1 py-2 text-sm font-medium text-center rounded-lg transition-colors ${activeTab === 1 ? 'text-white' : 'text-gray-500'
                  }`}
              >
                已完成
              </View>
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
