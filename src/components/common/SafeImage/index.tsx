import { Image, View, Text } from '@tarojs/components'
import { useState } from 'react'
import { normalizeUrl } from '@/utils/url'
import { Icon } from '@/components/common/Icon'

interface SafeImageProps {
  /**
   * 图片URL（可以是相对路径或完整URL）
   */
  src: string | undefined | null
  /**
   * 类名
   */
  className?: string
  /**
   * 图片显示模式
   * @default 'aspectFill'
   */
  mode?: keyof Taro.Image.Mode
  /**
   * 是否懒加载
   * @default true
   */
  lazyLoad?: boolean
  /**
   * 是否显示加载状态
   * @default true
   */
  showLoading?: boolean
  /**
   * 是否显示错误状态
   * @default true
   */
  showError?: boolean
  /**
   * 自定义加载组件
   */
  loadingElement?: React.ReactNode
  /**
   * 自定义错误组件
   */
  errorElement?: React.ReactNode
  /**
   * 点击事件
   */
  onClick?: () => void
  /**
   * 图片加载成功回调
   */
  onLoad?: () => void
  /**
   * 图片加载失败回调
   */
  onError?: () => void
}

/**
 * 安全图片组件
 *
 * 功能特性：
 * - 自动处理相对路径和完整URL
 * - 懒加载优化
 * - 加载状态和错误处理
 * - 防止空白占位
 *
 * @example
 * ```tsx
 * // 基本用法
 * <SafeImage src="/minio/image.png" className="w-full h-40" />
 *
 * // 完整用法
 * <SafeImage
 *   src={imageUrl}
 *   mode="aspectFill"
 *   lazyLoad
 *   showLoading
 *   showError
 *   onLoad={() => console.log('加载成功')}
 *   onError={() => console.log('加载失败')}
 * />
 * ```
 */
export function SafeImage({
  src,
  className = '',
  mode = 'aspectFill',
  lazyLoad = true,
  showLoading = true,
  showError = true,
  loadingElement,
  errorElement,
  onClick,
  onLoad,
  onError,
}: SafeImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const normalizedUrl = normalizeUrl(src)

  // 如果URL为空，直接显示错误状态
  if (!normalizedUrl) {
    return showError ? (
      errorElement || (
        <View className={`safe-image-error ${className}`}>
          <View className='flex flex-col items-center justify-center h-full gap-2'>
            <Icon name='image_not_supported' size={32} color='#9ca3af' />
            <Text className='text-gray-400 text-xs'>暂无图片</Text>
          </View>
        </View>
      )
    ) : null
  }

  const handleLoad = () => {
    setLoaded(true)
    setLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    console.error('[SafeImage] 图片加载失败:', normalizedUrl)
    setError(true)
    setLoading(false)
    onError?.()
  }

  return (
    <View className={`safe-image-wrapper ${className}`} onClick={onClick}>
      {/* 加载状态 */}
      {showLoading && loading && !error && (
        <View className='safe-image-loading absolute inset-0 flex items-center justify-center bg-gray-100'>
          {loadingElement || <View className='animate-pulse bg-gray-200 w-full h-full' />}
        </View>
      )}

      {/* 错误状态 */}
      {showError && error ? (
        errorElement || (
          <View className='safe-image-error absolute inset-0 flex flex-col items-center justify-center bg-gray-50'>
            <Icon name='image_not_supported' size={32} color='#9ca3af' />
            <Text className='text-gray-400 text-xs mt-2'>加载失败</Text>
          </View>
        )
      ) : (
        <Image
          src={normalizedUrl}
          mode={mode}
          lazyLoad={lazyLoad}
          className={`safe-image w-full h-full ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </View>
  )
}
