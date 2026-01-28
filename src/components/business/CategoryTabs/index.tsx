import { ScrollView, Text, View } from '@tarojs/components'
import { FC, useMemo } from 'react'
import './index.scss'

export interface CategoryTabsProps {
  categories: string[]
  value: number
  onChange: (index: number) => void
  loading?: boolean
}

/**
 * CategoryTabs 分类标签组件
 *
 * @param categories - 分类数组
 * @param value - 当前选中的索引
 * @param onChange - 分类切换回调
 * @param loading - 是否加载中
 */
export const CategoryTabs: FC<CategoryTabsProps> = ({
  categories,
  value,
  onChange,
  loading = false
}) => {
  // 骨架屏占位数据
  const skeletonItems = useMemo(() => Array.from({ length: 4 }), [])

  // 判断是否显示骨架屏
  const showSkeleton = loading || categories.length === 0

  return (
    <View className='category-tabs-wrapper'>
      <ScrollView scrollX className='category-tabs-scroll'>
        {showSkeleton ? (
          <View className='flex gap-3 px-6 py-4'>
            {skeletonItems.map((_, index) => (
              <View
                key={index}
                className='skeleton-item animate-pulse h-8 bg-gray-200 rounded-full'
                style={{ width: `${60 + Math.random() * 40}px` }}
              />
            ))}
          </View>
        ) : (
          <View className='flex gap-3 px-6 py-4'>
            {categories.map((category, index) => (
              <View
                key={category}
                className={`category-pill ${value === index ? 'category-pill-active' : ''}`}
                onClick={() => onChange(index)}
              >
                <Text className={`category-pill-text ${value === index ? 'category-pill-text-active' : ''}`}>
                  {category}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
