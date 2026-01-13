import { Button } from '@/components/common'
import ProgressBar from '@/components/business/ProgressBar'
import { useTaskPolling } from '@/store'
import { Image, Text, View } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { assetsApi } from '@/api'
import './index.css'

export default function ResultPage() {
  const router = useRouter()
  const { taskId } = router.params as { taskId: string }
  const { taskStatus, startPolling } = useTaskPolling()
  const [publishing, setPublishing] = useState(false)

  useDidShow(() => {
    if (taskId) {
      startPolling(taskId)
    }
  })

  // 保存到相册
  const handleSave = async () => {
    if (!taskStatus?.result_url) return

    try {
      Taro.showLoading({ title: '保存中...' })
      const result = await Taro.downloadFile({
        url: taskStatus.result_url
      })

      await Taro.saveImageToPhotosAlbum({
        filePath: result.tempFilePath
      })

      Taro.hideLoading()
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (error) {
      console.error('Save error:', error)
      Taro.hideLoading()
      Taro.showToast({ title: '保存失败', icon: 'none' })
    }
  }

  // 发布到广场
  const handlePublish = async () => {
    if (!taskId) return

    setPublishing(true)
    try {
      await assetsApi.publishTask(taskId)
      Taro.showToast({ title: '已提交审核', icon: 'success' })
    } catch (error) {
      console.error('Publish error:', error)
      Taro.showToast({ title: '发布失败', icon: 'none' })
    } finally {
      setPublishing(false)
    }
  }

  // 重新生成
  const handleRetry = () => {
    Taro.navigateTo({
      url: '/pages/studio/index'
    })
  }

  // 返回首页
  const handleBackHome = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  return (
    <View className='result-page'>
      {/* 任务状态区域 */}
      <View className='status-section'>
        {taskStatus?.status === 'pending' && (
          <>
            <Text className='status-title'>排队中...</Text>
            <Text className='status-desc'>前方还有 {taskStatus.progress || 0} 个任务</Text>
          </>
        )}

        {taskStatus?.status === 'processing' && (
          <>
            <ProgressBar
              progress={taskStatus.progress || 0}
              message={taskStatus.progress_message}
            />
          </>
        )}

        {taskStatus?.status === 'success' && taskStatus.result_url && (
          <Image
            src={taskStatus.result_url}
            className='result-image'
            mode='widthFix'
          />
        )}

        {taskStatus?.status === 'failed' && (
          <View className='error-container'>
            <Text className='error-icon'>❌</Text>
            <Text className='error-title'>生成失败</Text>
            <Text className='error-message'>{taskStatus.error_message || '未知错误'}</Text>
          </View>
        )}
      </View>

      {/* 操作按钮区域 */}
      {taskStatus?.status === 'success' && (
        <View className='action-section'>
          <Button
            className='action-btn primary'
            onClick={handleSave}
          >
            保存到相册
          </Button>
          <Button
            className='action-btn'
            onClick={handlePublish}
            loading={publishing}
          >
            发布到广场
          </Button>
          <Button
            className='action-btn'
            onClick={handleRetry}
          >
            继续创作
          </Button>
        </View>
      )}

      {taskStatus?.status === 'failed' && (
        <View className='action-section'>
          <Button
            className='action-btn primary'
            onClick={handleRetry}
          >
            重新生成
          </Button>
          <Button
            className='action-btn'
            onClick={handleBackHome}
          >
            返回首页
          </Button>
        </View>
      )}
    </View>
  )
}
