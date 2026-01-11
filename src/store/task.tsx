/**
 * 任务轮询状态管理
 */
import { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react'
import { studioApi } from '@/api'
import type { TaskStatus } from '@/types'

interface TaskPollingContextType {
  activeTaskId: string | null
  taskStatus: TaskStatus | null
  startPolling: (taskId: string) => void
  stopPolling: () => void
}

const TaskPollingContext = createContext<TaskPollingContextType | undefined>(undefined)

export const TaskPollingProvider = ({ children }: { children: ReactNode }) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null)
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)

  const pollTaskStatus = useCallback(async (taskId: string) => {
    try {
      const status = await studioApi.getTaskStatus(taskId)
      setTaskStatus(status)

      // 如果任务完成或失败,停止轮询
      if (status.status === 'success' || status.status === 'failed') {
        stopPolling()
      }
    } catch (error) {
      console.error('Poll task status error:', error)
      // 错误也停止轮询
      stopPolling()
    }
  }, [])

  const startPolling = useCallback((taskId: string) => {
    setActiveTaskId(taskId)
    setTaskStatus(null)

    // 立即查询一次
    pollTaskStatus(taskId)

    // 每2秒轮询一次
    pollingTimer.current = setInterval(() => {
      pollTaskStatus(taskId)
    }, 2000)
  }, [pollTaskStatus])

  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
      pollingTimer.current = null
    }
    setActiveTaskId(null)
  }, [])

  return (
    <TaskPollingContext.Provider
      value={{
        activeTaskId,
        taskStatus,
        startPolling,
        stopPolling,
      }}
    >
      {children}
    </TaskPollingContext.Provider>
  )
}

export const useTaskPolling = () => {
  const context = useContext(TaskPollingContext)
  if (!context) {
    throw new Error('useTaskPolling must be used within TaskPollingProvider')
  }
  return context
}
