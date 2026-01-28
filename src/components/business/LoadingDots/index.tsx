import { View } from '@tarojs/components'
import { FC } from 'react'
import './index.scss'

export interface LoadingDotsProps {
  size?: number
  color?: string
  text?: string
}

/**
 * LoadingDots 跳动点动画组件
 *
 * 三个圆点从左到右依次跳动，用于加载状态提示
 *
 * @param size - 圆点大小（px），默认 8
 * @param color - 圆点颜色，默认 #9ca3af
 * @param text - 提示文字，可选
 */
export const LoadingDots: FC<LoadingDotsProps> = ({
  size = 8,
  color = '#9ca3af',
  text
}) => {
  const dotStyle = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color
  }

  return (
    <View className='loading-dots-container'>
      <View className='loading-dots'>
        <View className='dot dot-1' style={dotStyle}></View>
        <View className='dot dot-2' style={dotStyle}></View>
        <View className='dot dot-3' style={dotStyle}></View>
      </View>
      {text && (
        <View className='loading-dots-text' style={{ color, fontSize: `${size * 2}px` }}>
          {text}
        </View>
      )}
    </View>
  )
}
