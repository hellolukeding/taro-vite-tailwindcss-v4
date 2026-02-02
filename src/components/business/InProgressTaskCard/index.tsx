import { View, Text } from '@tarojs/components'
import { Icon } from '@/components/common/Icon'

interface InProgressTaskProps {
  id: string
  title: string
  description: string
  progress?: number // 0-100, undefined means queued
  status: 'progress' | 'queued' | 'failed'
  errorMessage?: string // 失败错误信息
  onCancel?: (id: string) => void
  onDelete?: (id: string) => void // 新增：删除任务回调
}

export function InProgressTaskCard({
  id,
  title,
  description,
  progress,
  status,
  errorMessage,
  onCancel,
  onDelete,
}: InProgressTaskProps) {
  return (
    <View className='flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm'>
      <View className='flex gap-4'>
        {/* Thumbnail */}
        <View className='w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative'>
          {status === 'progress' ? (
            <>
              <View className='absolute inset-0 bg-linear-to-tr from-gray-200 to-gray-100 animate-pulse' />
              <View className='absolute inset-0 flex items-center justify-center'>
                <Icon name='refresh' size={24} color='#9CA3AF' />
              </View>
            </>
          ) : status === 'failed' ? (
            <View className='w-full h-full flex items-center justify-center bg-red-50'>
              <Icon name='error_outline' size={24} color='#EF4444' />
            </View>
          ) : (
            <View className='w-full h-full flex items-center justify-center'>
              <Icon name='hourglass_empty' size={24} color='#D1D5DB' />
            </View>
          )}
        </View>

        {/* Content */}
        <View className='flex-1 flex flex-col justify-between py-0.5'>
          <View>
            <View className='flex justify-between items-start mb-1'>
              <Text className='text-sm font-bold flex-1 mr-2 text-black' numberOfLines={1}>
                {title}
              </Text>
              {status === 'progress' ? (
                <Text className='text-xs font-bold font-mono text-black'>
                  {progress}%
                </Text>
              ) : status === 'failed' ? (
                <Text className='text-xs font-bold text-red-500'>生成失败</Text>
              ) : (
                <Text className='text-xs font-bold text-gray-400'>排队中</Text>
              )}
            </View>
            <Text className='text-xs text-gray-500' numberOfLines={1}>
              {description}
            </Text>
            {status === 'failed' && errorMessage && (
              <Text className='text-xs text-red-500 mt-1' numberOfLines={2}>
                {errorMessage}
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          <View className='w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden'>
            {status === 'progress' && progress !== undefined ? (
              <View
                className='h-full bg-black rounded-full'
                style={{ width: `${progress}%` }}
              />
            ) : status === 'failed' ? (
              <View className='w-full h-full bg-red-500 rounded-full' />
            ) : (
              <View className='w-1/3 h-full bg-gray-300 rounded-full animate-pulse' />
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className='flex items-center justify-end gap-2'>
        {status !== 'failed' && (
          <View
            onClick={() => onCancel?.(id)}
            className='px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-medium flex items-center gap-1 active:bg-gray-50'
          >
            <Icon name='close' size={14} />
            <Text>取消任务</Text>
          </View>
        )}
        {status === 'failed' && (
          <View
            onClick={() => onDelete?.(id)}
            className='px-4 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-medium flex items-center gap-1 active:bg-red-100'
          >
            <Icon name='delete' size={14} />
            <Text className='text-red-600'>删除任务</Text>
          </View>
        )}
      </View>
    </View>
  )
}
