import CommonWarp from '@/components/CommonWarp'
import { InProgressTaskCard } from '@/components/business/InProgressTaskCard'
import { TaskCard } from '@/components/business/TaskCard'
import { EmptyState } from '@/components/EmptyState'
import { Icon } from '@/components/common/Icon'
import type { MockTask } from '@/mock/tasks'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { assetsApi } from '@/api'
import type { TaskItem } from '@/types'

interface AssetsProps { }

const Assets: React.FC<AssetsProps> = () => {
  const { isLogin, loading } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 加载任务列表
  const loadTasks = useCallback(async (loadMore = false) => {
    if (loadingTasks) return

    setLoadingTasks(true)
    try {
      const status = activeTab === 0 ? 'pending' : 'success'
      const result = await assetsApi.getTasks({
        status,
        limit: 20,
        offset: loadMore ? tasks.length : 0
      })

      if (loadMore) {
        setTasks([...tasks, ...result.items])
      } else {
        setTasks(result.items)
      }
      setHasMore(result.has_more)
    } catch (error) {
      console.error('Load tasks error:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoadingTasks(false)
    }
  }, [activeTab, tasks, loadingTasks])

  // 切换标签时重新加载
  useEffect(() => {
    if (isLogin) {
      loadTasks(false)
    }
  }, [activeTab, isLogin, loadTasks])

  // 下拉刷新
  usePullDownRefresh(() => {
    loadTasks(false).then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  // 上拉加载更多
  useReachBottom(() => {
    if (hasMore && !loadingTasks) {
      loadTasks(true)
    }
  })

  // 处理登录按钮点击
  const handleLogin = () => {
    Taro.navigateTo({
      url: '/packageUser/pages/login/index'
    })
  }

  // 发布/取消发布
  const handleTogglePublish = async (taskId: string, isPublic: boolean) => {
    try {
      if (isPublic) {
        await assetsApi.unpublishTask(taskId)
        Taro.showToast({ title: '已取消发布', icon: 'success' })
      } else {
        await assetsApi.publishTask(taskId)
        Taro.showToast({ title: '已提交审核', icon: 'success' })
      }
      loadTasks(false)
    } catch (error) {
      console.error('Toggle publish error:', error)
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await assetsApi.deleteTask(taskId)
            Taro.showToast({ title: '删除成功', icon: 'success' })
            setTasks(tasks.filter(t => t.task_id !== taskId))
          } catch (error) {
            console.error('Delete task error:', error)
            Taro.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }

  // 取消任务
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

  // 转换 TaskItem 到 MockTask 格式
  const transformToMockTask = (task: TaskItem): MockTask => {
    const time = (() => {
      const date = new Date(task.created_at)
      const now = new Date()
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)

      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
      return `${Math.floor(diff / 1440)}天前`
    })()

    // 根据状态映射
    let status: MockTask['status'] = 'private'
    if (task.is_public) {
      status = 'public'
    } else if (task.status === 4) {
      status = 'failed'
    }

    return {
      id: task.task_id,
      imageUrl: task.thumbnail_url || task.image_url || undefined,
      category: task.model_name,
      time,
      status,
      likes: 0, // API 返回的数据中没有 likes
    }
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
              {tasks.length === 0 && !loadingTasks ? (
                <View className='text-center py-8 text-gray-400'>
                  <Text>暂无进行中的任务</Text>
                </View>
              ) : (
                tasks.map((task) => (
                  <InProgressTaskCard
                    key={task.task_id}
                    id={task.task_id}
                    title={task.prompt.length > 30 ? task.prompt.substring(0, 30) + '...' : task.prompt}
                    description={task.model_name}
                    progress={0}
                    status='queued'
                    onCancel={handleCancelTask}
                  />
                ))
              )}
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
                {tasks.length === 0 && !loadingTasks ? (
                  <View className='col-span-2 text-center py-8 text-gray-400'>
                    <Text>暂无已完成的任务</Text>
                  </View>
                ) : (
                  tasks.map((task) => {
                    const mockTask = transformToMockTask(task)
                    return (
                      <View key={task.task_id} className='relative'>
                        <TaskCard task={mockTask} />
                        {/* 添加长按删除功能 */}
                        <View
                          className='absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full z-10'
                          onClick={() => handleDeleteTask(task.task_id)}
                        >
                          <Text className='text-xs'>×</Text>
                        </View>
                      </View>
                    )
                  })
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </CommonWarp>
  )
}

export default Assets
