import { LazyImage } from '@/components/business/LazyImage'
import { LoadingDots } from '@/components/business/LoadingDots'
import { GoodJobOutlined } from '@taroify/icons'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { WaterfallItem } from './WaterfallItem'
import './index.scss'

export interface WorkItem {
  id: string
  title: string
  cover_image: string
  creator?: {
    nickname?: string
    avatar_url?: string
  }
  model?: string
  likes_count?: number
  views_count?: number
}

export interface VirtualWaterfallProps {
  items: WorkItem[]
  loading?: boolean
  hasMore?: boolean
  onItemClick?: (item: WorkItem) => void
  onRefresh?: () => void
  onLoadMore?: () => void
  renderEmpty?: () => React.ReactNode
}

/**
 * VirtualWaterfall 虚拟瀑布流组件
 *
 * 优化双列瀑布流渲染性能，支持自动加载更多
 *
 * @param items - 作品列表
 * @param loading - 是否加载中
 * @param hasMore - 是否还有更多
 * @param onItemClick - 点击作品回调
 * @param onRefresh - 下拉刷新回调
 * @param onLoadMore - 加载更多回调
 * @param renderEmpty - 自定义空状态渲染
 */
export const VirtualWaterfall: FC<VirtualWaterfallProps> = memo(({
  items,
  loading = false,
  hasMore = true,
  onItemClick,
  onRefresh,
  onLoadMore,
  renderEmpty
}) => {
  const scrollViewRef = useRef<any>(null)
  const [scrollViewHeight, setScrollViewHeight] = useState(0)

  // 分离左右列数据
  const leftColumnItems = items.filter((_, index) => index % 2 === 0)
  const rightColumnItems = items.filter((_, index) => index % 2 === 1)

  const handleItemClick = useCallback((item: WorkItem) => {
    onItemClick?.(item)
  }, [onItemClick])

  // 渲染单个作品卡片
  const renderItem = useCallback((item: WorkItem) => {
    return (
      <WaterfallItem
        key={item.id}
        item={item}
        onClick={() => handleItemClick(item)}
      />
    )
  }, [handleItemClick])

  // 延迟获取 ScrollView 高度
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query.select('.waterfall-scrollview').boundingClientRect()
      query.exec((res) => {
        if (res && res[0]) {
          const height = res[0].height
          console.log('[VirtualWaterfall] 获取到 ScrollView height:', height)
          setScrollViewHeight(height)
        } else {
          console.log('[VirtualWaterfall] 无法获取 ScrollView height，res:', res)
        }
      })
    }, 500) // 延迟 500ms 确保渲染完成

    return () => clearTimeout(timer)
  }, [])

  // 滚动事件处理 - 自动加载更多
  const handleScroll = useCallback((e: any) => {
    // 如果正在加载或没有更多数据，不触发
    if (loading || !hasMore) {
      return
    }

    const { scrollTop, scrollHeight } = e.detail
    const distanceToBottom = scrollHeight - scrollTop - scrollViewHeight

    // 距离底部 200px 时自动触发加载
    const threshold = 200
    if (distanceToBottom < threshold) {
      onLoadMore?.()
    }
  }, [loading, hasMore, onLoadMore, scrollViewHeight])

  // 渲染加载状态
  const renderLoading = () => {
    if (loading) {
      return (
        <View className='waterfall-loading'>
          <LoadingDots size={8} text='加载中...' />
        </View>
      )
    }
    return null
  }

  // 渲染加载更多提示
  const renderLoadMore = () => {
    if (items.length === 0) return null

    if (loading) {
      return renderLoading()
    }

    if (!hasMore) {
      return (
        <View className='waterfall-load-more'>
          <Text className='text-gray-400 text-sm'>没有更多了</Text>
        </View>
      )
    }

    return (
      <View className='waterfall-load-more'>
        <LoadingDots size={8} text='加载更多...' />
      </View>
    )
  }

  // 空状态判断
  const isEmpty = items.length === 0 && !loading

  return (
    <View className='virtual-waterfall'>
      {isEmpty ? (
        <View className='waterfall-empty'>
          {renderEmpty?.()}
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          scrollY
          className='waterfall-scrollview'
          refresherEnabled
          refresherTriggered={loading}
          onRefresherRefresh={onRefresh}
          onScroll={handleScroll}
          lowerThreshold={100}
        >
          <View className='waterfall-container'>
            {/* 左列 */}
            <View className='waterfall-column'>
              {leftColumnItems.map(renderItem)}
            </View>

            {/* 右列 */}
            <View className='waterfall-column'>
              {rightColumnItems.map(renderItem)}
            </View>
          </View>

          {renderLoadMore()}
        </ScrollView>
      )}
    </View>
  )
})

VirtualWaterfall.displayName = 'VirtualWaterfall'
