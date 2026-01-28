import { Image, View } from '@tarojs/components'
import { FC, useState } from 'react'
import './index.scss'

export interface LazyImageProps {
  src: string
  width?: string | number
  mode?: 'aspectFill' | 'aspectFit' | 'widthFix' | 'heightFix'
  className?: string
  style?: React.CSSProperties
  showLoading?: boolean
  showError?: boolean
  onLoad?: () => void
  onError?: () => void
}

/**
 * LazyImage 图片组件
 *
 * @param src - 图片地址
 * @param width - 宽度
 * @param mode - 图片模式，widthFix 会保持宽高比
 * @param className - 自定义类名
 * @param style - 自定义样式
 * @param showLoading - 是否显示加载动画
 * @param showError - 是否显示错误占位
 * @param onLoad - 加载成功回调
 * @param onError - 加载失败回调
 */
export const LazyImage: FC<LazyImageProps> = ({
  src,
  width = '100%',
  mode = 'widthFix',
  className = '',
  style: customStyle,
  showLoading = true,
  showError = true,
  onLoad,
  onError
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // 图片加载完成
  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  // 图片加载失败
  const handleError = () => {
    setError(true)
    onError?.()
  }

  // 样式
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    display: 'block',
    ...customStyle
  }

  return (
    <View className={`lazy-image-wrapper ${className}`}>
      {/* 加载占位 */}
      {showLoading && !loaded && !error && (
        <View className='lazy-image-placeholder' style={style}>
          <View className='lazy-image-skeleton animate-pulse bg-gray-200' style={style} />
        </View>
      )}

      {/* 图片 */}
      {!error && (
        <Image
          src={src}
          mode={mode}
          className={`lazy-image ${loaded ? 'lazy-image-loaded' : ''}`}
          style={style}
          onLoad={handleLoad}
          onError={handleError}
          lazyLoad
        />
      )}

      {/* 错误状态 */}
      {showError && error && (
        <View className='lazy-image-error' style={style}>
          <View className='error-icon'>🖼️</View>
          <View className='error-text'>加载失败</View>
        </View>
      )}
    </View>
  )
}
