import { Button } from '@taroify/core'
import { Text, View } from '@tarojs/components'
import { FC, ReactNode } from 'react'
import './index.scss'

export type EmptyType = 'no-data' | 'no-search-result' | 'network-error' | 'no-tasks'

export interface EmptyStateProps {
  type?: EmptyType
  title?: string
  description?: string
  icon?: string
  actionText?: string
  onAction?: () => void
}

const EMPTY_CONFIG = {
  'no-data': {
    icon: '📭',
    title: '暂无数据',
    description: '还没有相关内容'
  },
  'no-search-result': {
    icon: '🔍',
    title: '未找到结果',
    description: '试试其他关键词吧'
  },
  'network-error': {
    icon: '🔌',
    title: '网络错误',
    description: '请检查网络连接后重试'
  },
  'no-tasks': {
    icon: '🎨',
    title: '暂无任务',
    description: '快去创作你的第一个作品吧'
  }
}

/**
 * EmptyState 空状态组件
 *
 * @param type - 空状态类型
 * @param title - 自定义标题
 * @param description - 自定义描述
 * @param icon - 自定义图标（emoji）
 * @param actionText - 操作按钮文本
 * @param onAction - 操作按钮回调
 */
export const EmptyState: FC<EmptyStateProps> = ({
  type = 'no-data',
  title,
  description,
  icon,
  actionText,
  onAction
}) => {
  const config = EMPTY_CONFIG[type]
  const displayIcon = icon || config.icon
  const displayTitle = title || config.title
  const displayDescription = description || config.description

  return (
    <View className='empty-state'>
      <View className='empty-state-icon'>{displayIcon}</View>
      <Text className='empty-state-title'>{displayTitle}</Text>
      <Text className='empty-state-description'>{displayDescription}</Text>
      {actionText && onAction && (
        <Button
          shape="round"
          className='empty-state-action'
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </View>
  )
}
