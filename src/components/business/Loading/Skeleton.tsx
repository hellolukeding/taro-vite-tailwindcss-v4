import { View } from '@tarojs/components'
import { FC } from 'react'

export interface SkeletonProps {
  count?: number
}

/**
 * Skeleton 骨架屏组件
 * 用于模拟内容加载状态
 */
export const Skeleton: FC<SkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className='skeleton-card animate-pulse bg-gray-200 rounded-xl overflow-hidden'
        >
          {/* 图片占位 */}
          <View className='skeleton-image h-64 bg-gray-300' />

          {/* 内容占位 */}
          <View className='skeleton-content p-4 space-y-3'>
            {/* 标题占位 */}
            <View className='skeleton-title h-4 bg-gray-300 rounded w-3/4' />

            {/* 作者信息占位 */}
            <View className='skeleton-author flex items-center gap-2'>
              <View className='skeleton-avatar w-5 h-5 bg-gray-300 rounded-full' />
              <View className='skeleton-name h-3 bg-gray-300 rounded w-20' />
            </View>

            {/* 统计信息占位 */}
            <View className='skeleton-stats flex items-center justify-between'>
              <View className='skeleton-likes h-3 bg-gray-300 rounded w-16' />
              <View className='skeleton-views h-3 bg-gray-300 rounded w-12' />
            </View>
          </View>
        </View>
      ))}
    </>
  )
}
