import { Text, View } from '@tarojs/components'
import { FC } from 'react'
import { Spinner } from './Spinner'
import { Skeleton } from './Skeleton'
import './index.scss'

export type LoadingType = 'spinner' | 'skeleton' | 'fullscreen'

export interface LoadingProps {
  type?: LoadingType
  text?: string
  visible?: boolean
}

/**
 * Loading 加载组件
 *
 * @param type - 加载类型
 *   - spinner: 旋转图标（用于按钮、卡片内部）
 *   - skeleton: 骨架屏（用于列表、卡片占位）
 *   - fullscreen: 全屏遮罩（用于页面级加载）
 * @param text - 加载提示文本
 * @param visible - 是否显示，默认 true
 */
export const Loading: FC<LoadingProps> = ({
  type = 'spinner',
  text = '加载中...',
  visible = true
}) => {
  if (!visible) return null

  if (type === 'fullscreen') {
    return (
      <View className='loading-fullscreen'>
        <View className='loading-fullscreen-content'>
          <Spinner size='large' />
          <Text className='loading-fullscreen-text'>{text}</Text>
        </View>
      </View>
    )
  }

  if (type === 'skeleton') {
    return <Skeleton />
  }

  // 默认 spinner
  return <Spinner text={text} />
}

export { Spinner, Skeleton }
